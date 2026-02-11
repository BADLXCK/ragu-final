#!/bin/bash

echo "Проверка лимитов загрузки в WordPress..."

# Проверка через WP-CLI
docker-compose exec wordpress wp eval "
echo 'PHP Upload Max Filesize: ' . ini_get('upload_max_filesize') . PHP_EOL;
echo 'PHP Post Max Size: ' . ini_get('post_max_size') . PHP_EOL;
echo 'PHP Max Execution Time: ' . ini_get('max_execution_time') . PHP_EOL;
echo 'PHP Memory Limit: ' . ini_get('memory_limit') . PHP_EOL;
echo 'PHP Max Input Time: ' . ini_get('max_input_time') . PHP_EOL;
echo 'PHP File Uploads: ' . (ini_get('file_uploads') ? 'On' : 'Off') . PHP_EOL;
echo 'PHP Max File Uploads: ' . ini_get('max_file_uploads') . PHP_EOL;
" --allow-root

echo ""
echo "Проверка настроек WordPress..."
docker-compose exec wordpress wp option get max_file_size --allow-root
docker-compose exec wordpress wp option get upload_max_filesize --allow-root

echo ""
echo "Проверка завершена!"
