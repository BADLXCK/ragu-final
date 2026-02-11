# Настройка лимитов загрузки файлов в WordPress

## Что было сделано:

### 1. Обновлен docker-compose.yml

-   Добавлены переменные окружения для PHP
-   Настроена конфигурация PHP через команду запуска
-   Добавлено монтирование файла wp-uploads.ini

### 2. Создан файл wp-uploads.ini

Содержит настройки PHP для увеличения лимитов:

-   upload_max_filesize = 10M
-   post_max_size = 10M
-   max_execution_time = 300
-   memory_limit = 256M
-   max_input_time = 300
-   file_uploads = On
-   max_file_uploads = 20

### 3. Обновлены настройки WordPress через WP-CLI

-   max_file_size = 10485760 (10MB)
-   upload_max_filesize = 10485760 (10MB)

## Как применить изменения:

### 1. Остановите контейнеры:

```bash
docker-compose down
```

### 2. Пересоздайте контейнеры:

```bash
docker-compose up -d --build
```

### 3. Проверьте настройки:

```bash
# Через PowerShell (Windows)
docker-compose exec wordpress wp eval "echo 'Upload Max: ' . ini_get('upload_max_filesize');" --allow-root

# Или запустите скрипт проверки
./check-upload-limits.sh
```

### 4. Проверьте в админке WordPress:

1. Зайдите в админку WordPress (http://localhost:8080/wp-admin)
2. Перейдите в "Медиафайлы" → "Добавить новый"
3. Попробуйте загрузить файл больше 2MB

## Дополнительные настройки:

### Если нужно увеличить лимит еще больше:

1. Отредактируйте файл `wp-uploads.ini`
2. Измените значения на нужные (например, 25M)
3. Перезапустите контейнеры

### Для проверки текущих лимитов:

```bash
docker-compose exec wordpress php -i | grep -E "(upload_max_filesize|post_max_size|memory_limit)"
```

## Возможные проблемы:

1. **Если лимиты не применились:**

    - Убедитесь, что контейнеры пересозданы с флагом --build
    - Проверьте, что файл wp-uploads.ini смонтирован

2. **Если загрузка все еще не работает:**

    - Проверьте права доступа к папке uploads
    - Убедитесь, что веб-сервер имеет права на запись

3. **Для очень больших файлов (>25MB):**
    - Рассмотрите использование облачного хранилища
    - Настройте nginx/apache для больших файлов
