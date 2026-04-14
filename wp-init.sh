#!/usr/bin/env bash
set -euo pipefail

WP_PATH="/var/www/html"
WP_THEME="ragu"
WP_TITLE="Рагу"

echo "[INFO] Starting WordPress init..."

# ---------------------------
# Подготовка папок
# ---------------------------
mkdir -p "$WP_PATH/wp-content/uploads" "$WP_PATH/wp-content/upgrade"
chown -R www-data:www-data "$WP_PATH/wp-content"
chmod -R 755 "$WP_PATH/wp-content"
chmod -R 777 "$WP_PATH/wp-content/upgrade" "$WP_PATH/wp-content/uploads"

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
# Тема
# ---------------------------
wp theme activate "$WP_THEME" --allow-root --path="$WP_PATH"
wp theme list --field=name --allow-root --path="$WP_PATH" | grep '^twenty' | xargs -r wp theme delete --allow-root --path="$WP_PATH" || true

# ---------------------------
# Плагины
# ---------------------------
wp plugin install woocommerce advanced-custom-fields wordpress-seo filebird updraftplus organize-media-folder pods wp-graphql --activate --allow-root --path="$WP_PATH" || true

wp plugin activate nextjs-status-monitor --allow-root --path="$WP_PATH" || true

# ---------------------------
# Права
# ---------------------------
chown -R www-data:www-data "$WP_PATH"

echo "[INFO] WordPress setup completed successfully!"
