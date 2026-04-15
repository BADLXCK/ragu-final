#!/usr/bin/env bash
set -euo pipefail

WP_PATH="/var/www/html"
WP_THEME="ragu"
WP_TITLE="Рагу"

echo "[INFO] Running with shell: $0"

# ---------------------------
# Ждём БД
# ---------------------------
echo "[INFO] Waiting for database..."

until mariadb-admin ping \
	-h "$WORDPRESS_DB_HOST" \
	-u "$WORDPRESS_DB_USER" \
	-p"$WORDPRESS_DB_PASSWORD" \
	--ssl=0 \
	--silent; do
	sleep 2
done

echo "[INFO] Database is ready"

# ---------------------------
# Установка WP
# ---------------------------
if ! wp core is-installed --allow-root --path="$WP_PATH" 2> /dev/null; then
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
	exit 0
fi

# ---------------------------
# Тема
# ---------------------------
wp theme activate "$WP_THEME" --allow-root --path="$WP_PATH"

# безопасное удаление дефолтных тем
THEMES=$(wp theme list --field=name --allow-root --path="$WP_PATH" | grep '^twenty' || true)
if [ -n "$THEMES" ]; then
	echo "$THEMES" | xargs -r wp theme delete --allow-root --path="$WP_PATH"
fi

# ---------------------------
# Плагины
# ---------------------------
PLUGINS=(
	woocommerce
	advanced-custom-fields
	wordpress-seo
	filebird
	updraftplus
	organize-media-folder
	pods
	wp-graphql
)

wp plugin delete hello akismet --allow-root --path="$WP_PATH" || true
wp plugin install "${PLUGINS[@]}" --activate --allow-root --path="$WP_PATH"

echo "[INFO] Installing wp-graphql-woocommerce..."
wp plugin install \
	"https://github.com/wp-graphql/wp-graphql-woocommerce/archive/refs/heads/master.zip" \
	--activate \
	--allow-root \
	--path="$WP_PATH"

# ---------------------------
# Права
# ---------------------------
chown -R www-data:www-data "$WP_PATH"
chmod -R 755 "$WP_PATH/wp-content"

echo "[INFO] WordPress setup completed successfully!"
