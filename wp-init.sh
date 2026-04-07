#!/bin/bash
set -e

WP_PATH="/var/www/html"
WP_THEME="ragu"
WP_TITLE="Рагу"
WP_DEFAULT_PLUGINS=("hello" "akismet")
WP_PLUGINS=("woocommerce" "advanced-custom-fields" "wordpress-seo" "filebird" "updraftplus" "organize-media-folder" "pods" "wp-graphql")

# --- Установка WordPress ---
if ! wp core is-installed --allow-root --path="$WP_PATH"; then
  echo "[INFO] Installing WordPress..."
  wp core install \
    --url="$WP_URL" \
    --title="$WP_TITLE" \
    --admin_user="$WP_USER" \
    --admin_password="$WP_PASSWORD" \
    --admin_email="$WP_ADMIN_EMAIL" \
    --locale=ru_RU \
    --skip-email \
    --allow-root \
    --path="$WP_PATH"

  wp language core install ru_RU --allow-root --path="$WP_PATH"
  wp language core activate ru_RU --allow-root --path="$WP_PATH"
fi

# --- Создание папки uploads ---
echo "[INFO] Creating uploads folder..."
mkdir -p "$WP_PATH/wp-content/uploads"
chown -R www-data:www-data "$WP_PATH/wp-content/uploads"
chmod -R 755 "$WP_PATH/wp-content/uploads"

# --- Активируем тему ---
echo "[INFO] Activating theme $WP_THEME..."
wp theme activate "$WP_THEME" --allow-root --path="$WP_PATH"

# --- Исправляем права на темы ---
echo "[INFO] Fixing theme permissions..."
chown -R www-data:www-data "$WP_PATH/wp-content/themes"
chmod -R 755 "$WP_PATH/wp-content/themes"

# --- Удаляем стандартные темы безопасно ---
echo "[INFO] Removing default themes..."
for theme in $(wp theme list --field=name --allow-root --path="$WP_PATH" | grep -E '^twenty'); do
  wp theme delete "$theme" --allow-root --path="$WP_PATH" || true
done

# --- Удаляем дефолтные плагины ---
echo "[INFO] Removing default plugins..."
wp plugin delete "${WP_DEFAULT_PLUGINS[@]}" --allow-root --path="$WP_PATH" || true

# --- Установка остальных плагинов ---
echo "[INFO] Installing plugins..."
wp plugin install "${WP_PLUGINS[@]}" --activate --allow-root --path="$WP_PATH"

echo "[INFO] WordPress setup completed successfully!"