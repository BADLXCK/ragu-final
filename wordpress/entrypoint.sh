#!/bin/bash
set -e

# 🔑 Переменные для удобства
BACKUP_MARKER="/tmp/backup-restored.marker"
WP_CONFIG="/var/www/html/wp-config.php"

# Function to restore backup from Google Drive
restore_backup() {
    # Пропускаем, если бэкап уже восстанавливали
    if [ -f "$BACKUP_MARKER" ]; then
        echo "[INFO] Backup already restored (marker found), skipping..."
        return 0
    fi

    if [ -z "$GDRIVE_SERVICE_ACCOUNT_JSON" ] || [ -z "$GDRIVE_BACKUP_FOLDER" ]; then
        echo "[INFO] Backup restore skipped (no Google Drive credentials provided)"
        return 0
    fi

    # Проверка валидности JSON
    if ! echo "$GDRIVE_SERVICE_ACCOUNT_JSON" | python3 -m json.tool >/dev/null 2>&1; then
        echo "[ERROR] GDRIVE_SERVICE_ACCOUNT_JSON is not valid JSON!"
        return 1
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
        gunzip -c "$DB_BACKUP" | mysql -h "$WORDPRESS_DB_HOST" \
            -u "$WORDPRESS_DB_USER" \
            -p"$WORDPRESS_DB_PASSWORD" \
            "$WORDPRESS_DB_NAME" \
            --skip-ssl
        echo "[SUCCESS] Database restored"
    else
        echo "[WARN] No database backup found"
    fi

    rm -rf /tmp/backups
    touch "$BACKUP_MARKER"
    echo "[SUCCESS] Backup restore completed + marker set"
}

# 🔑 Ожидание БД
echo "[INFO] Waiting for database at $WORDPRESS_DB_HOST..."
until mysql -h "$WORDPRESS_DB_HOST" \
            -u "$WORDPRESS_DB_USER" \
            -p"$WORDPRESS_DB_PASSWORD" \
            "$WORDPRESS_DB_NAME" \
            --skip-ssl \
            -e "SELECT 1;" >/dev/null 2>&1; do
  echo "[INFO] Waiting for database at $WORDPRESS_DB_HOST..."
  sleep 3
done
echo "[SUCCESS] Database is ready"

# 🔑 Запускаем официальный entrypoint в фоне, чтобы он создал wp-config.php
echo "[INFO] Starting WordPress initialization..."
/usr/local/bin/docker-entrypoint.sh "$@" &
WP_PID=$!

# Ждём, пока wp-config.php не появится
until [ -f "$WP_CONFIG" ]; do
    sleep 1
done

# 🔑 КРИТИЧНО: Фиксируем URL в wp-config.php (переопределит БД)
if ! grep -q "define('WP_SITEURL'" "$WP_CONFIG"; then
    echo "[INFO] Fixing WordPress URL in wp-config.php..."
    
    TARGET_URL="${WORDPRESS_URL:-https://wordpress.${DOMAIN}}"
    
    # Добавляем константы ПЕРЕД "That's all, stop editing"
    sed -i "/That's all, stop editing/a \
\ndefine('WP_SITEURL', '${TARGET_URL}');\
\ndefine('WP_HOME', '${TARGET_URL}');" \
    "$WP_CONFIG"
    
    echo "[SUCCESS] WP_SITEURL and WP_HOME set to ${TARGET_URL}"
fi

# 🔑 Копирование файлов (ваша логика)
copy_custom_files() {
    while [ ! -d /var/www/html/wp-content/plugins ]; do
        sleep 1
    done

    if [ ! -d /var/www/html/wp-content/themes/ragu ]; then
        echo "📦 Installing ragu theme..."
        cp -r /usr/src/ragu /var/www/html/wp-content/themes/
        chown -R www-data:www-data /var/www/html/wp-content/themes/ragu
    fi

    echo "🤖 Creating robots.txt..."
    cat > /var/www/html/robots.txt << 'ROBOTS'
User-agent: *
Disallow: /
ROBOTS
    chown www-data:www-data /var/www/html/robots.txt

    echo "⚙️ Running setup script..."
    /usr/local/bin/setup-wordpress.sh
}

copy_custom_files &

# 🔑 Ждём завершения фонового процесса (Apache запустится)
wait $WP_PID