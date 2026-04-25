#!/bin/bash
set -e

WP_THEME="ragu"
WP_TITLE="Рагу"
BACKUP_MARKER="/tmp/backup-restored.marker"
URL_FIX_MARKER="/tmp/urls-fixed.marker"

# 🔑 Валидация переменных
: "${WORDPRESS_DB_HOST:?WORDPRESS_DB_HOST is required}"
: "${WORDPRESS_DB_USER:?WORDPRESS_DB_USER is required}"
: "${WORDPRESS_DB_PASSWORD:?WORDPRESS_DB_PASSWORD is required}"
: "${WORDPRESS_DB_NAME:?WORDPRESS_DB_NAME is required}"

# =============================================================================
# 🔐 Восстановление бэкапа из Google Drive
# =============================================================================
restore_backup() {
    if [ -f "$BACKUP_MARKER" ]; then
        echo "[INFO] Backup already restored, skipping..."
        return 0
    fi
    if [ -z "$GDRIVE_SERVICE_ACCOUNT_JSON" ] || [ -z "$GDRIVE_BACKUP_FOLDER" ]; then
        echo "[INFO] No Google Drive credentials, skipping backup..."
        return 0
    fi

    echo "[INFO] Configuring rclone..."
    mkdir -p /root/.config/rclone
    cat > /root/.config/rclone/rclone.conf <<EOF
[gdrive]
type = drive
scope = drive.readonly
service_account_credentials = $GDRIVE_SERVICE_ACCOUNT_JSON
root_folder_id = $GDRIVE_BACKUP_FOLDER
EOF

    echo "[INFO] Downloading backups..."
    mkdir -p /tmp/backups
    rclone copy "gdrive:" /tmp/backups --progress 2>/dev/null || true

    UPLOADS_BACKUP=$(find /tmp/backups -name "*uploads*.zip" -type f 2>/dev/null | head -n 1)
    DB_BACKUP=$(find /tmp/backups -name "*db*.gz" -type f 2>/dev/null | head -n 1)

    [ -n "$UPLOADS_BACKUP" ] && {
        echo "[INFO] Restoring uploads..."
        mkdir -p /var/www/html/wp-content/uploads
        unzip -o "$UPLOADS_BACKUP" -d /var/www/html/wp-content/ 2>/dev/null || true
        chown -R 33:33 /var/www/html/wp-content/uploads
    }

    [ -n "$DB_BACKUP" ] && {
        echo "[INFO] Restoring database..."
        gunzip -c "$DB_BACKUP" | mysql -h "$WORDPRESS_DB_HOST" \
            -u "$WORDPRESS_DB_USER" \
            -p"$WORDPRESS_DB_PASSWORD" \
            "$WORDPRESS_DB_NAME" \
            --skip-ssl 2>/dev/null || true
        echo "[SUCCESS] Database restored from backup"
    }

    rm -rf /tmp/backups
    touch "$BACKUP_MARKER"
    echo "[SUCCESS] Backup restore completed"
}

# =============================================================================
# 🔗 Замена старых URL в БД на актуальные (ВЫЗЫВАТЬ ПОСЛЕ ВОССТАНОВЛЕНИЯ БЭКАПА!)
# =============================================================================
fix_urls_in_db() {
    # Пропускаем, если уже чинили
    if [ -f "$URL_FIX_MARKER" ]; then
        echo "[INFO] URLs already fixed in DB, skipping..."
        return 0
    fi

    local OLD_URL="http://localhost:8080"
    local NEW_URL="${WORDPRESS_URL:-https://wordpress.${DOMAIN:-restoranragu.ru}}"
    
    echo "[INFO] Fixing URLs in database: $OLD_URL → $NEW_URL"
    
    # Ждём, пока БД будет доступна
    until mysql -h "$WORDPRESS_DB_HOST" -u "$WORDPRESS_DB_USER" -p"$WORDPRESS_DB_PASSWORD" --skip-ssl -e "SELECT 1;" >/dev/null 2>&1; do
        sleep 1
    done
    
    # Используем WP-CLI search-replace (надёжнее прямого SQL)
    if command -v wp &>/dev/null && wp core is-installed --allow-root 2>/dev/null; then
        wp search-replace "$OLD_URL" "$NEW_URL" \
            --all-tables \
            --skip-columns=guid \
            --allow-root \
            --quiet 2>/dev/null && \
        echo "[SUCCESS] URLs replaced via WP-CLI" || \
        echo "[WARN] search-replace completed with warnings"
    else
        # Fallback: прямой SQL (менее идеально, но работает)
        mysql -h "$WORDPRESS_DB_HOST" \
              -u "$WORDPRESS_DB_USER" \
              -p"$WORDPRESS_DB_PASSWORD" \
              "$WORDPRESS_DB_NAME" \
              --skip-ssl \
              -e "
                UPDATE wp_options SET option_value = REPLACE(option_value, '$OLD_URL', '$NEW_URL') WHERE option_value LIKE '%$OLD_URL%';
                UPDATE wp_posts SET post_content = REPLACE(post_content, '$OLD_URL', '$NEW_URL') WHERE post_content LIKE '%$OLD_URL%';
                UPDATE wp_postmeta SET meta_value = REPLACE(meta_value, '$OLD_URL', '$NEW_URL') WHERE meta_value LIKE '%$OLD_URL%';
              " 2>/dev/null && \
        echo "[SUCCESS] URLs replaced via SQL" || \
        echo "[WARN] SQL replace completed with warnings"
    fi
    
    # Ставим маркер, чтобы не чинить повторно
    touch "$URL_FIX_MARKER"
}

# =============================================================================
# 🔗 Фиксация URL в wp-config.php (БЕЗ sed, только echo >>)
# =============================================================================
fix_wp_config() {
    local TARGET_URL="${WORDPRESS_URL:-https://wordpress.${DOMAIN:-restoranragu.ru}}"
    local WP_CONFIG="/var/www/html/wp-config.php"
    
    # Добавляем в КОНЕЦ файла — никаких поисков, никаких экранирований
    if [ -f "$WP_CONFIG" ] && ! grep -q "WP_SITEURL" "$WP_CONFIG"; then
        echo "" >> "$WP_CONFIG"
        echo "/* === Fixed URLs === */" >> "$WP_CONFIG"
        echo "if(!defined('WP_SITEURL'))define('WP_SITEURL','$TARGET_URL');" >> "$WP_CONFIG"
        echo "if(!defined('WP_HOME'))define('WP_HOME','$TARGET_URL');" >> "$WP_CONFIG"
        echo "[INFO] URLs fixed in wp-config.php: $TARGET_URL"
    fi
}

# =============================================================================
# 🚀 Основная логика
# =============================================================================

# 🔹 Установка только если сайт ещё не установлен
if ! wp core is-installed --allow-root 2>/dev/null; then
    echo "[INFO] Installing WordPress..."
    
    wp core install \
        --url="${WORDPRESS_URL:-http://localhost}" \
        --title="${WP_TITLE:-My WordPress Site}" \
        --admin_user="${WORDPRESS_DB_USER:-admin}" \
        --admin_password="${WORDPRESS_DB_PASSWORD:-changeme}" \
        --admin_email="${WORDPRESS_ADMIN_EMAIL:-admin@example.com}" \
        --locale=ru_RU \
        --skip-email \
        --allow-root

    echo "[INFO] WordPress installed"
    
    # 🔹 Бэкап только при чистой установке
    echo "[INFO] Checking for backups..."
    restore_backup
    
    # 🔑 КРИТИЧНО: Чиним URL в БД СРАЗУ ПОСЛЕ восстановления бэкапа
    fix_urls_in_db
fi

# 🔹 Тема
wp theme activate "$WP_THEME" --allow-root 2>/dev/null || true

# 🔹 Удаление дефолтных тем
wp theme list --field=name --allow-root 2>/dev/null | grep '^twenty' | xargs -r wp theme delete --allow-root 2>/dev/null || true

# 🔹 Плагины
PLUGINS=(woocommerce advanced-custom-fields wordpress-seo filebird updraftplus organize-media-folder pods wp-graphql)
wp plugin install "${PLUGINS[@]}" --activate --allow-root 2>/dev/null || true

# 🔹 WPGraphQL
wp option update graphql_general_settings '{"public_introspection_enabled":"on"}' --format=json --allow-root 2>/dev/null || true
wp plugin deactivate woocommerce-legacy-rest-api --allow-root 2>/dev/null || true
wp option update woocommerce_legacy_api_enabled "no" --allow-root 2>/dev/null || true

# 🔹 wp-graphql-woocommerce
if ! wp plugin is-installed wp-graphql-woocommerce --allow-root 2>/dev/null; then
    wp plugin install "https://github.com/wp-graphql/wp-graphql-woocommerce/archive/refs/heads/master.zip" --activate --allow-root 2>/dev/null || true
fi

# 🔹 Composer для wp-graphql-woocommerce (если есть)
if [ -f "/var/www/html/wp-content/plugins/wp-graphql-woocommerce/composer.json" ] && command -v composer &>/dev/null; then
    cd /var/www/html/wp-content/plugins/wp-graphql-woocommerce
    composer update --no-dev --optimize-autoloader --no-interaction 2>/dev/null || true
    cd /var/www/html
fi

# 🔹 Права
chown -R 33:33 /var/www/html
chmod -R 755 /var/www/html/wp-content
mkdir -p /var/www/html/wp-content/updraft
chown -R 33:33 /var/www/html/wp-content/updraft

# 🔹 Фиксируем URL в wp-config.php (в самом конце)
echo "[INFO] Fixing WordPress URLs in wp-config.php..."
fix_wp_config

echo "[INFO] Setup completed successfully!"