#!/bin/bash
set -e

# 🔑 Переменные для удобства
BACKUP_MARKER="/tmp/backup-restored.marker"
WP_CONFIG="/var/www/html/wp-config.php"

# =============================================================================
# 🔐 Функция: восстановление бэкапа из Google Drive
# =============================================================================
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

# =============================================================================
# 🔗 Функция: безопасная фиксация URL в wp-config.php (БЕЗ sed!)
# =============================================================================
fix_wp_config_urls() {
    local TARGET_URL="${WORDPRESS_URL:-https://wordpress.${DOMAIN:-restoranragu.ru}}"
    
    # Ждём, пока файл не появится
    until [ -f "$WP_CONFIG" ]; do
        sleep 1
    done
    
    # Если константы ещё не добавлены — добавляем в КОНЕЦ файла (безопасно!)
    if ! grep -q "WP_SITEURL" "$WP_CONFIG"; then
        echo "" >> "$WP_CONFIG"
        echo "/* === Auto-fixed URLs (entrypoint) === */" >> "$WP_CONFIG"
        echo "if (!defined('WP_SITEURL')) define('WP_SITEURL', '$TARGET_URL');" >> "$WP_CONFIG"
        echo "if (!defined('WP_HOME')) define('WP_HOME', '$TARGET_URL');" >> "$WP_CONFIG"
        echo "[INFO] Fixed URLs in wp-config.php: $TARGET_URL"
    fi
}

# =============================================================================
# 📁 Функция: копирование темы и настройка
# =============================================================================
copy_custom_files() {
    # Ждём, пока официальный entrypoint развернёт файлы WordPress
    while [ ! -d /var/www/html/wp-content/plugins ]; do
        sleep 1
    done

    # Копируем тему, если её ещё нет
    if [ ! -d /var/www/html/wp-content/themes/ragu ]; then
        echo "📦 Installing ragu theme..."
        cp -r /usr/src/ragu /var/www/html/wp-content/themes/
        chown -R www-www-data /var/www/html/wp-content/themes/ragu
    fi

    # Создаём robots.txt
    echo "🤖 Creating robots.txt..."
    cat > /var/www/html/robots.txt << 'ROBOTS'
User-agent: *
Disallow: /
ROBOTS
    chown www-www-data /var/www/html/robots.txt

    # Запускаем ваш скрипт настройки
    echo "⚙️ Running setup script..."
    /usr/local/bin/setup-wordpress.sh
}

# =============================================================================
# 🚀 ОСНОВНАЯ ЛОГИКА
# =============================================================================

# 1. 🔑 Ожидание БД
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

# 2. 🔑 Запускаем официальный entrypoint (БЕЗ фона! Пусть выполнится полностью)
echo "[INFO] Starting WordPress initialization..."
/usr/local/bin/docker-entrypoint.sh "$@" &
OFFICIAL_PID=$!

# 3. 🔑 Копируем файлы (в фоне, чтобы не блокировать)
copy_custom_files &

# 4. 🔑 Ждём завершения официального entrypoint (он запустит Apache)
wait $OFFICIAL_PID

# 5. 🔑 ФИКСИРУЕМ URL в wp-config.php (после того, как всё установлено)
echo "[INFO] Ensuring WordPress URLs are correct..."
fix_wp_config_urls

# 6. 🔑 Apache уже запущен официальным entrypoint, просто держим процесс
# (если нужно, можно добавить healthcheck или логирование)
echo "[INFO] WordPress is running. URLs fixed."
wait  # Ждём завершения всех фоновых процессов