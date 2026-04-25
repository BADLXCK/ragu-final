#!/bin/bash
set -e

# 🔑 Ждём базу данных
echo "[INFO] Waiting for database at $WORDPRESS_DB_HOST..."
until mysql -h "$WORDPRESS_DB_HOST" \
            -u "$WORDPRESS_DB_USER" \
            -p"$WORDPRESS_DB_PASSWORD" \
            --skip-ssl \
            --connect-timeout=5 \
            -e "SELECT 1;" >/dev/null 2>&1; do
  echo "[INFO] Waiting for database..."
  sleep 3
done
echo "[SUCCESS] Database is ready"

# 🔑 Запускаем официальный entrypoint — он создаст wp-config.php и файлы
# НЕ в фоне! Пусть выполнится полностью перед нашим кодом
echo "[INFO] Running official WordPress entrypoint..."
/usr/local/bin/docker-entrypoint.sh "$@" &
OFFICIAL_PID=$!

# 🔑 Ждём, пока WordPress не будет полностью готов (файлы + БД)
echo "[INFO] Waiting for WordPress files to be ready..."
until [ -f /var/www/html/wp-config.php ] && [ -d /var/www/html/wp-content/plugins ]; do
    sleep 1
done
echo "[SUCCESS] WordPress files are ready"

# 🔑 Запускаем нашу настройку (тема, плагины, бэкапы) — ПОСЛЕ того, как всё готово
echo "[INFO] Running custom setup..."
if [ ! -f /tmp/wordpress-setup-complete ]; then
    /usr/local/bin/setup-wordpress.sh
    touch /tmp/wordpress-setup-complete
fi

# 🔑 Ждём завершения официального entrypoint (он запустит Apache)
wait $OFFICIAL_PID