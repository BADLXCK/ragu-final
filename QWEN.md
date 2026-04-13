# QWEN.md — Проект «Рагу» (Restoran Ragu)

## Обзор проекта

Это **Next.js 15** приложение (App Router) для ресторана «Рагу», использующее **WordPress** как headless CMS для управления контентом. Проект построен на основе примера `cms-wordpress` от Vercel и адаптирован под нужды ресторана.

### Основные технологии

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Стили**: SCSS Modules, CSS
- **CMS**: WordPress 6.9.4 (headless)
- **API**: WPGraphQL для получения данных из WordPress
- **Типизация GraphQL**: GraphQL Codegen
- **Контейнеризация**: Docker, Docker Compose
- **Продакшен**: Traefik (reverse proxy, SSL)

### Ключевые возможности

- Динамические страницы меню ресторана (zakuski, osnovnye-blyuda и т.д.)
- Страницы: банкет, афиша, галерея, контакты, отзывы, бронирование
- Интеграция с WordPress через GraphQL (категории, продукты, события, галереи)
- Автоматическая генерация TypeScript типов из WordPress схемы
- Кэширование с тегами и он-деманд ревалидация
- Поддержка черновиков/превью через Draft Mode
- Yandex Maps интеграция
- WooCommerce для продуктов (меню ресторана)

---

## Структура проекта

```
ragu-final/
├── src/
│   ├── api/            # GraphQL клиент, запросы, типы
│   │   ├── gql/        # Автогенерированные типы из GraphQL Codegen
│   │   ├── queries/    # GraphQL запросы (getCategories, getProducts, etc.)
│   │   ├── client.ts   # GraphQL клиент
│   │   └── products.api.ts
│   ├── app/            # Next.js App Router страницы
│   │   ├── menu/[category]/[product]/  # Динамические страницы меню
│   │   ├── banquet/    # Страницы банкетов
│   │   ├── gallery/    # Галерея
│   │   ├── contacts/   # Контакты
│   │   ├── reviews/    # Отзывы
│   │   ├── reserve/    # Бронирование
│   │   ├── afisha/     # Афиша
│   │   └── layout.tsx  # Корневой layout
│   ├── components/     # React компоненты
│   ├── layouts/        # Layout компоненты
│   ├── routes/         # Роуты/страницы
│   ├── hooks/          # Кастомные хуки
│   ├── utils/          # Утилиты
│   └── middleware.ts   # Next.js middleware
├── wp-content/themes/ragu/  # Кастомная тема WordPress
├── docker-compose.yml      # Локальная разработка
├── docker-compose.prod.yml # Продакшен конфигурация
├── wp-init.sh              # Скрипт инициализации WordPress
└── codegen.ts              # GraphQL Codegen конфигурация
```

---

## Команды

### Разработка

```bash
# Установка зависимостей
npm install

# Запуск dev сервера (генерация типов + next dev)
npm run dev

# Build
npm run build

# Запуск production сервера
npm run start

# Линтинг
npm run lint

# Генерация GraphQL типов
npm run codegen

# Поиск неиспользуемого кода
npm run find-deadcode
npm run knip
```

### Docker

```bash
# Запуск локальной среды (WordPress + MySQL)
npm run docker:up

# Остановка
npm run docker:down

# Первичная настройка (WordPress установка + плагины)
npm run docker:setup
```

---

## Переменные окружения

Создайте `.env` файл на основе `.env.example`:

```env
# WordPress
NEXT_PUBLIC_WORDPRESS_API_URL=http://localhost:8080
NEXT_PUBLIC_WORDPRESS_API_HOSTNAME=localhost:8080
SCHEMA_URL=http://localhost:8080/graphql

# Frontend
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# База данных
DATABASE_NAME=wordpress
DATABASE_USER=admin
DATABASE_PASSWORD=password
DATABASE_ROOT_PASSWORD=root_password

# Администратор WordPress
WORDPRESS_ADMIN_EMAIL=your@email.com

---

## Архитектура

### Frontend (Next.js)

- **App Router** с динамическими роутами для меню (`/menu/[category]/[product]`)
- **GraphQL Codegen** автоматически генерирует TypeScript типы из WordPress схемы
- **Кэширование**: GraphQL запросы кэшируются с тегом `wordpress`, ревалидация при изменениях в CMS
- **Стилизация**: CSS Modules + SCSS с миксинами и переменными

### Backend (WordPress)

- **WPGraphQL** — GraphQL API для WordPress
- **WooCommerce** — управление продуктами (меню ресторана)
- **ACF Pro** — гибкое управление контентом
- **Yoast SEO** — SEO оптимизация
- **UpdraftPlus** — бэкапы в Google Drive через rclone
- **FileBird** — организация медиа файлов
- **Redirection** — управление редиректами

### Docker

- **Локальная среда** (`docker-compose.yml`):
    - MySQL 8.0
    - WordPress 6.9.4 (PHP 8.2)
    - WP-CLI контейнер для инициализации

- **Продакшен** (`docker-compose.prod.yml`):
    - Traefik (reverse proxy + SSL через Let's Encrypt)
    - MySQL 8.0
    - WordPress
    - Next.js frontend (из GitHub Container Registry)
    - phpMyAdmin (порт 8081)

---

## Конвенции разработки

### TypeScript

- Строгий режим (`strict: true`)
- Пути через `@/*` → `./src/*`
- Автогенерация типов из GraphQL в `src/api/gql/`

### GraphQL

- Запросы хранятся в `src/api/queries/`
- Типы генерируются автоматически через `codegen.ts`
- Для автодополнения установите расширение Apollo GraphQL и создайте `apollo.config.js`

### Стилизация

- CSS Modules (`.module.scss`)
- SCSS переменные в `src/app/styles/_variables.scss`
- Миксины в `src/app/styles/_mixins.scss`
- Breakpoints в `src/app/styles/_breakpoints.scss`

### Форматирование

- Prettier с конфигурацией:
    - Tab width: 4
    - Single quotes: true
    - Trailing comma: all
    - Semi: true

### Линтинг

- ESLint с `next/core-web-vitals` и `next/typescript`
- Отключены: `no-require-imports`, `no-explicit-any`, `ban-ts-comment`

---

## Важные файлы

| Файл                      | Описание                                                       |
| ------------------------- | -------------------------------------------------------------- |
| `codegen.ts`              | Конфигурация GraphQL Codegen для генерации типов               |
| `wp-init.sh`              | Скрипт установки и настройки WordPress (тема, плагины, бэкапы) |
| `docker-compose.yml`      | Локальная Docker среда                                         |
| `docker-compose.prod.yml` | Продакшен Docker среда с Traefik                               |
| `next.config.ts`          | Next.js конфигурация (редиректы, images)                       |
| `Dockerfile.wpcli`        | WP-CLI контейнер с rclone                                      |
| `Dockerfile.frontend`     | Frontend контейнер                                             |

---

## Развертывание

### Локально

1. Скопируйте `.env.example` → `.env` и заполните переменные
2. Запустите `npm run docker:setup` для первичной настройки WordPress
3. Запустите `npm run docker:up` для запуска WordPress
4. Запустите `npm run dev` для запуска Next.js

### Продакшен

1. Соберите и запуште образ frontend в GitHub Container Registry
2. Настройте `.env` для продакшена
3. Запустите `docker compose -f docker-compose.prod.yml up -d`
4. Traefik автоматически настроит SSL

Домены:

- Frontend: `next.restoranragu.ru`
- WordPress Admin: `wordpress.restoranragu.ru`
- phpMyAdmin: `:8081`

---

## Заметки

- **Бэкапы**: Скрипт `wp-init.sh` загружает бэкапы из Google Drive через rclone и восстанавливает через UpdraftPlus
- **Ревалидация кэша**: При обновлении поста в WordPress автоматически отправляется запрос на `/api/revalidate` для сброса кэша
- **Превью/Черновики**: Работает через Draft Mode Next.js + WPGraphQL JWT Authentication
- **WooCommerce**: Продукты WooCommerce используются как меню ресторана
```
