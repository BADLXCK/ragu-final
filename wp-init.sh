#!/usr/bin/env bash
set -euo pipefail

WP_PATH="/var/www/html"
WP_THEME="ragu"
WP_TITLE="Рагу"

echo "[INFO] Starting WordPress init..."

# ---------------------------
# Подготовка папок и прав
# ---------------------------
mkdir -p "$WP_PATH/wp-content/uploads" "$WP_PATH/wp-content/upgrade" "$WP_PATH/wp-content/updraft"
chown -R www-data:www-data "$WP_PATH/wp-content"
chmod -R 755 "$WP_PATH/wp-content"
chmod -R 777 "$WP_PATH/wp-content/upgrade" "$WP_PATH/wp-content/updraft"

# ---------------------------
# Установка WordPress
# ---------------------------
if ! wp core is-installed --allow-root --path="$WP_PATH"; then
	echo "[INFO] Installing WordPress..."
	wp core install \
		--url="$WORDPRESS_URL" \
		--title="$WP_TITLE" \
		--admin_user="$WORDPRESS_DB_USER" \
		--admin_password="$WORDPRESS_DB_PASSWORD" \
		--admin_email="$WORDPRESS_ADMIN_EMAIL" \
		--locale=ru_RU \
		--skip-email \
		--allow-root \
		--path="$WP_PATH"

	wp language core install ru_RU --allow-root --path="$WP_PATH"
	wp language core activate ru_RU --allow-root --path="$WP_PATH"
else
	echo "[INFO] WordPress already installed"
fi

# ---------------------------
# Тема и плагины
# ---------------------------
echo "[INFO] Activating theme..."
wp theme activate "$WP_THEME" --allow-root --path="$WP_PATH" || true

DEFAULT_THEMES=$(wp theme list --field=name --allow-root --path="$WP_PATH" | grep '^twenty' || true)
if [ -n "$DEFAULT_THEMES" ]; then
	wp theme delete $DEFAULT_THEMES --allow-root --path="$WP_PATH"
fi

PLUGINS=("woocommerce" "advanced-custom-fields" "wordpress-seo" "filebird" "updraftplus" "organize-media-folder" "pods" "wp-graphql")
echo "[INFO] Installing plugins..."
wp plugin install "${PLUGINS[@]}" --activate --allow-root --path="$WP_PATH" || true

# ---------------------------
# Отключение запроса FTP
# ---------------------------
echo "[INFO] Configuring wp-config.php for direct filesystem access..."
WP_CONFIG="$WP_PATH/wp-config.php"

if ! grep -q "FS_METHOD" "$WP_CONFIG"; then
	echo "define('FS_METHOD', 'direct');" >> "$WP_CONFIG"
fi

# ---------------------------
# Финальная настройка прав
# ---------------------------
echo "[INFO] Setting final permissions..."
find "$WP_PATH" -type d -exec chmod 755 {} \;
find "$WP_PATH" -type f -exec chmod 644 {} \;
chmod -R 777 "$WP_PATH/wp-content/upgrade" "$WP_PATH/wp-content/updraft" "$WP_PATH/wp-content/uploads"
chown -R www-data:www-data "$WP_PATH"

echo "[INFO] WordPress setup completed successfully!"
