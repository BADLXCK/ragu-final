#!/usr/bin/env bash
set -euo pipefail

WP_PATH="/var/www/html"
WP_THEME="ragu"
WP_TITLE="Рагу"

echo "[INFO] Starting WordPress init..."
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
	wp site switch-language ru_RU --allow-root --path="$WP_PATH"

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
PLUGINS=(
	"woocommerce"
	"advanced-custom-fields"
	"wordpress-seo"
	"filebird"
	"updraftplus"
	"organize-media-folder"
	"pods"
	"wp-graphql"
)

wp plugin delete hello akismet --allow-root --path="$WP_PATH" || true
wp plugin install "${PLUGINS[@]}" --activate --allow-root --path="$WP_PATH" || true

# --- Устанавливаем WP-GraphQL-WooCommerce из GitHub ---
PLUGIN_DIR="$WP_PATH/wp-content/plugins/wp-graphql-woocommerce"
if [ ! -d "$PLUGIN_DIR" ]; then
	echo "Installing wp-graphql-woocommerce from GitHub..."
	git clone --branch "$GITHUB_BRANCH" "$GITHUB_PLUGIN" "$PLUGIN_DIR"
fi
wp plugin activate wp-graphql-woocommerce --allow-root --path="$WP_PATH"

# ---------------------------
# Права на файлы
# ---------------------------
chown -R www-data:www-data "$WP_PATH"
chmod -R 755 "$WP_PATH/wp-content"
chmod -R 775 "$WP_PATH/wp-content/uploads"
chmod -R 775 "$WP_PATH/wp-content/upgrade"
chmod -R 775 "$WP_PATH/wp-content/updraft"

echo "[INFO] WordPress setup completed successfully!"
