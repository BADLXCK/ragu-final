#!/bin/bash
set -e

WP_THEME="ragu"
WP_TITLE="Рагу"

# 🔑 Валидация переменных
: "${WORDPRESS_DB_HOST:?WORDPRESS_DB_HOST is required}"
: "${WORDPRESS_DB_USER:?WORDPRESS_DB_USER is required}"
: "${WORDPRESS_DB_PASSWORD:?WORDPRESS_DB_PASSWORD is required}"
: "${WORDPRESS_DB_NAME:?WORDPRESS_DB_NAME is required}"

# =============================================================================
# 🔗 Замена старых URL в БД на актуальные
# =============================================================================
fix_urls_in_db() {
    local OLD_URL="http://localhost:8080"
    local NEW_URL="${WORDPRESS_URL:-https://wordpress.${DOMAIN:-restoranragu.ru}}"
    
    echo "[INFO] Checking for URLs to fix in database: $OLD_URL → $NEW_URL"
    
    # Ждём, пока БД будет доступна
    until mysql -h "$WORDPRESS_DB_HOST" -u "$WORDPRESS_DB_USER" -p"$WORDPRESS_DB_PASSWORD" --skip-ssl -e "SELECT 1;" >/dev/null 2>&1; do
        sleep 1
    done
    
    # Используем WP-CLI search-replace
    if command -v wp &>/dev/null && wp core is-installed --allow-root 2>/dev/null; then
        echo "[INFO] Running search-replace via WP-CLI..."
        wp search-replace "$OLD_URL" "$NEW_URL" \
            --all-tables \
            --skip-columns=guid \
            --allow-root \
            --quiet 2>/dev/null || true
        echo "[SUCCESS] URL check/replace completed"
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
fi

# 🔹 Тема
if [ -d "/usr/src/wordpress/wp-content/themes/$WP_THEME" ]; then
    cp -r "/usr/src/wordpress/wp-content/themes/$WP_THEME" /var/www/html/wp-content/themes/ 2>/dev/null || true
fi
wp theme activate "$WP_THEME" --allow-root 2>/dev/null || true

# 🔹 Синхронизируем mu-plugins
mkdir -p /var/www/html/wp-content/mu-plugins
if [ -d "/usr/src/wordpress/wp-content/mu-plugins" ]; then
    cp -r /usr/src/wordpress/wp-content/mu-plugins/. /var/www/html/wp-content/mu-plugins/ 2>/dev/null || true
fi

# 🔹 Удаление дефолтных тем
wp theme list --field=name --allow-root 2>/dev/null | grep '^twenty' | xargs -r wp theme delete --allow-root 2>/dev/null || true

# 🔹 Плагины
PLUGINS=(woocommerce advanced-custom-fields autodescription filebird updraftplus organize-media-folder pods wp-graphql)
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

# 🔹 Фиксируем URL в БД
fix_urls_in_db

# 🔹 Создаем маркер завершения для healthcheck
touch /tmp/wordpress-setup-complete

echo "[INFO] Setup completed successfully!"