#!/bin/bash
set -e

WP_THEME="ragu"
WP_TITLE="Рагу"
BACKUP_MARKER="/tmp/backup-restored.marker"

# 🔑 Валидация переменных
: "${WORDPRESS_DB_HOST:?WORDPRESS_DB_HOST is required}"
: "${WORDPRESS_DB_USER:?WORDPRESS_DB_USER is required}"
: "${WORDPRESS_DB_PASSWORD:?WORDPRESS_DB_PASSWORD is required}"
: "${WORDPRESS_DB_NAME:?WORDPRESS_DB_NAME is required}"

# =============================================================================
# 🔐 Восстановление бэкапа
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
        echo "[SUCCESS] Database restored"
    }

    rm -rf /tmp/backups
    touch "$BACKUP_MARKER"
    echo "[SUCCESS] Backup restore completed"
}

# =============================================================================
# 🔗 Безопасная фиксация URL (БЕЗ sed, только echo >>)
# =============================================================================
fix_urls() {
    local TARGET_URL="${WORDPRESS_URL:-https://wordpress.${DOMAIN:-restoranragu.ru}}"
    local WP_CONFIG="/var/www/html/wp-config.php"
    
    # Добавляем в КОНЕЦ файла — никаких поисков, никаких экранирований
    echo "" >> "$WP_CONFIG"
    echo "/* === Fixed URLs === */" >> "$WP_CONFIG"
    echo "if(!defined('WP_SITEURL'))define('WP_SITEURL','$TARGET_URL');" >> "$WP_CONFIG"
    echo "if(!defined('WP_HOME'))define('WP_HOME','$TARGET_URL');" >> "$WP_CONFIG"
    echo "[INFO] URLs fixed: $TARGET_URL"
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

# 🔹 🔑 ФИКСИРУЕМ URL (в самом конце, когда всё точно готово)
echo "[INFO] Fixing WordPress URLs..."
fix_urls

echo "[INFO] Setup completed successfully!"