#!/bin/bash
set -e

WP_THEME="ragu"
WP_TITLE="Рагу"

# Function to restore backup from Google Drive
restore_backup() {
	if [ -z "$GDRIVE_SERVICE_ACCOUNT_JSON" ] || [ -z "$GDRIVE_BACKUP_FOLDER" ]; then
		echo "[INFO] Backup restore skipped (no Google Drive credentials provided)"
		return 0
	fi

	echo "[INFO] Configuring rclone for Google Drive..."
	mkdir -p /root/.config/rclone
	cat > /root/.config/rclone/rclone.conf <<EOF
[gdrive]
type = drive
scope = drive.readonly
service_account_credentials = $GDRIVE_SERVICE_ACCOUNT_JSON
root_folder_id = $GDRIVE_BACKUP_FOLDER
EOF

	echo "[INFO] Downloading backups from Google Drive..."
	mkdir -p /tmp/backups
	rclone copy "gdrive:" /tmp/backups --progress

	# Find backup files (support both - and _ separators)
	UPLOADS_BACKUP=$(find /tmp/backups -name "*uploads*.zip" -type f | head -n 1)
	DB_BACKUP=$(find /tmp/backups -name "*db*.gz" -type f | head -n 1)

	if [ -n "$UPLOADS_BACKUP" ]; then
		echo "[INFO] Restoring uploads from $UPLOADS_BACKUP..."
		mkdir -p /var/www/html/wp-content/uploads
		unzip -o "$UPLOADS_BACKUP" -d /var/www/html/wp-content/
		chown -R 33:33 /var/www/html/wp-content/uploads
	else
		echo "[WARN] No uploads backup found"
	fi

	if [ -n "$DB_BACKUP" ]; then
		echo "[INFO] Restoring database from $DB_BACKUP..."
		gunzip -c "$DB_BACKUP" | mysql -h db -u "$WORDPRESS_DB_USER" -p"$WORDPRESS_DB_PASSWORD" "$WORDPRESS_DB_NAME" --skip-ssl
		echo "[SUCCESS] Database restored"
	else
		echo "[WARN] No database backup found"
	fi

	rm -rf /tmp/backups
	echo "[SUCCESS] Backup restore completed"
}

until mysql -h db -u "$WORDPRESS_DB_USER" -p"$WORDPRESS_DB_PASSWORD" "$WORDPRESS_DB_NAME" --skip-ssl -e "SELECT 1;" >/dev/null 2>&1; do
  echo "[INFO]Waiting for database..."
  sleep 3
done

echo "[SUCCESS] Database is ready"

if ! wp core is-installed --allow-root  2> /dev/null; then
	echo "[INFO] Installing WordPress..."

	wp core install \
		--url="${WORDPRESS_URL:-http://localhost}" \
		--title="${WORDPRESS_TITLE:-My WordPress Site}" \
		--admin_user="${WORDPRESS_DB_USER:-admin}" \
		--admin_password="${WORDPRESS_DB_PASSWORD:-changeme}" \
		--admin_email="${WORDPRESS_ADMIN_EMAIL:-admin@example.com}" \
		--locale=ru_RU \
		--skip-email \
		--allow-root \

	echo "Removing default plugins..."
	wp plugin delete akismet --allow-root 2>/dev/null || true
	wp plugin delete hello --allow-root 2>/dev/null || true

	wp language core install ru_RU --allow-root
	wp site switch-language ru_RU --allow-root

	echo "[INFO] WordPress installed successfully!"

	# Restore backup after WordPress installation
	restore_backup
fi

wp theme activate "$WP_THEME" --allow-root

# Activate the headless theme (always run, safe if already active)
# Note: Theme directory name must match the actual directory in wp-content/themes
echo "Activating Ragu theme..."
wp theme activate ragu --allow-root

# безопасное удаление дефолтных тем
THEMES=$(wp theme list --field=name --allow-root  | grep '^twenty' || true)
if [ -n "$THEMES" ]; then
	echo "$THEMES" | xargs -r wp theme delete --allow-root 
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

wp plugin install "${PLUGINS[@]}" --activate --allow-root

# Enable Public Introspection for WPGraphQL
echo "[INFO] Enabling WPGraphQL Public Introspection..."
wp option update graphql_general_settings '{"public_introspection_enabled":"on"}' --format=json --allow-root

# Отключаем Legacy REST API WooCommerce — используем только GraphQL
echo "[INFO] Disabling WooCommerce Legacy REST API..."
wp plugin deactivate woocommerce-legacy-rest-api --allow-root  2> /dev/null || true
wp plugin delete woocommerce-legacy-rest-api --allow-root  2> /dev/null || true
# Отключаем через настройки WooCommerce
wp option update woocommerce_legacy_api_enabled "no" --allow-root  2> /dev/null || true

echo "[INFO] Installing wp-graphql-woocommerce..."
wp plugin install \
	"https://github.com/wp-graphql/wp-graphql-woocommerce/archive/refs/heads/master.zip" \
	--activate \
	--allow-root

# Композер зависимости для wp-graphql-woocommerce
echo "[INFO] Running composer update for wp-graphql-woocommerce..."
cd "/var/www/html/wp-content/plugins/wp-graphql-woocommerce"
if [ -f "composer.json" ]; then
	# Проверяем, доступен ли composer
	if command -v composer &> /dev/null; then
		composer update --no-dev --optimize-autoloader --no-interaction
	else
		echo "[WARN] Composer not found in CLI container. wp-graphql-woocommerce may not work properly."
	fi
fi

cd "/var/www/html"

chown -R 33:33 "/var/www/html"
chmod -R 755 "/var/www/html/wp-content"

# UpdraftPlus — директория бэкапов должна быть записываемой
mkdir -p "/var/www/html/wp-content/updraft"
chown -R 33:33 "/var/www/html/wp-content/updraft"
chmod -R 775 "/var/www/html/wp-content/updraft"

echo "[INFO] WordPress setup completed successfully!"

# Create marker file for healthcheck
touch /tmp/wordpress-setup-complete