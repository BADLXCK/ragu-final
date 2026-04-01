#!/bin/bash
set -e

# --- Настройки ---
WP_PATH="/var/www/html"
WP_URL="${WP_URL:-http://localhost:8080}"
WP_TITLE="${WP_TITLE:-Docker WP}"
WP_ADMIN_USER="${WP_ADMIN_USER:-admin}"
WP_ADMIN_PASS="${WP_ADMIN_PASS:-admin123}"
WP_ADMIN_EMAIL="${WP_ADMIN_EMAIL:-admin@example.com}"

WP_THEME="${WP_THEME:-ragu}"
WP_DEFAULT_PLUGINS=("hello-dolly" "akismet")
WP_PLUGINS=("woocommerce" "advanced-custom-fields" "wordpress-seo" "filebird" "updraftplus")

# --- Экспорт переменной для PHP CLI ---
export HTTP_HOST=$(echo "$WP_URL" | awk -F/ '{print $3}')

# --- Настройка DB ---
export WORDPRESS_DB_HOST="${WORDPRESS_DB_HOST:-database:3306}"
export WORDPRESS_DB_USER="${WORDPRESS_DB_USER:-admin}"
export WORDPRESS_DB_PASSWORD="${WORDPRESS_DB_PASSWORD:-admin123}"
export WORDPRESS_DB_NAME="${WORDPRESS_DB_NAME:-wordpress}"

# --- Ждём файлы WordPress ---
echo "Waiting for WordPress files..."
until [ -d "$WP_PATH" ] && [ "$(ls -A $WP_PATH)" ]; do
  echo "WordPress not ready yet..."
  sleep 2
done
echo "WordPress files ready!"

# --- Ждём доступность MySQL TCP ---
DB_HOST="${WORDPRESS_DB_HOST%%:*}"
DB_PORT="${WORDPRESS_DB_HOST##*:}"

echo "Waiting for database TCP connection at $DB_HOST:$DB_PORT..."
until nc -z -v -w5 "$DB_HOST" "$DB_PORT"; do
  echo "Database not ready yet..."
  sleep 3
done
echo "Database TCP ready!"

# --- Проверяем WP ---
if ! wp core is-installed --allow-root --path="$WP_PATH" >/dev/null 2>&1; then
  echo "Installing WordPress..."
  wp core install \
    --url="$WP_URL" \
    --title="$WP_TITLE" \
    --admin_user="$WP_ADMIN_USER" \
    --admin_password="$WP_ADMIN_PASS" \
    --admin_email="$WP_ADMIN_EMAIL" \
    --skip-email \
    --allow-root \
    --path="$WP_PATH"
fi

# --- Тема ---
echo "Activating theme $WP_THEME..."
wp theme activate "$WP_THEME" --allow-root --path="$WP_PATH"

# --- Удаляем дефолтные темы ---
echo "Removing default themes..."
for theme in $(wp theme list --field=name --allow-root --path="$WP_PATH" | grep -E '^twenty'); do
  wp theme delete "$theme" --allow-root --path="$WP_PATH"
done

# Удаляем дефолтные плагины
wp plugin delete "${WP_DEFAULT_PLUGINS[@]}" --allow-root --path="$WP_PATH" || true

# Устанавливаем плагины
wp plugin install "${WP_PLUGINS[@]}" --activate --allow-root --path="$WP_PATH"

echo "WordPress initialization complete!"