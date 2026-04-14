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
│   │   │   ├── graphql.ts      # Основные типы
│   │   │   ├── gql.ts          # Хелперы для запросов
│   │   │   ├── fragment-masking.ts
│   │   │   └── index.ts
│   │   ├── queries/    # GraphQL запросы (getCategories, getProducts, etc.)
│   │   ├── client.ts   # GraphQL клиент
│   │   ├── products.api.ts
│   │   └── bot.ts
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
│   ├── hooks/          # Кастомные хуки
│   └── utils/          # Утилиты
├── wp-content/
│   ├── themes/ragu/                    # Кастомная тема WordPress
│   │   └── functions.php               # Функции темы (меню, поля WooCommerce, GraphQL)
│   └── plugins/        # Плагины WordPress
├── docker-compose.yml                  # Development конфигурация
├── docker-compose.prod.yml             # Production конфигурация
├── .env.example                        # Шаблон переменных
├── wp-init.sh                          # Скрипт инициализации WordPress
└── codegen.ts                          # GraphQL Codegen конфигурация
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
# === Development ===

# Запуск: БД + WordPress + Frontend + WP-CLI init
npm run docker:up

# Остановка
npm run docker:down

# === Production ===

# Запуск всего (включая Next.js)
npm run docker:prod:up

# Остановка
npm run docker:prod:down
```

---

## Переменные окружения

### `.env` — локальная разработка

```env
# База данных
DATABASE_NAME=wordpress
DATABASE_USER=admin
DATABASE_PASSWORD=password
DATABASE_ROOT_PASSWORD=root_password

# WordPress
WORDPRESS_URL=http://localhost:8080
WORDPRESS_ADMIN_EMAIL=admin@example.com
SCHEMA_URL=http://localhost:8080/graphql
```

---

## GraphQL

WPGraphQL Public Introspection **выключен по умолчанию**. Включите вручную:

1. WPGraphQL → Settings в WordPress admin
2. Поставьте галочку **Enable Public Introspection**
3. Сохраните

Для обновления типов после изменений в WordPress:

```bash
npm run codegen
```

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
- **UpdraftPlus** — бэкапы (восстановление вручную)
- **FileBird** — организация медиа файлов
- **Redirection** — управление редиректами
- **Next.js Status Monitor** — плагин мониторинга статуса

### Docker

- **Development** (`docker-compose.yml`):
    - MySQL 8.0
    - WordPress 6.9.4 (PHP 8.2) — порт `8080`
    - Next.js frontend (hot reload, bind mount) — порт `3000`
    - WP-CLI контейнер для инициализации
    - Frontend в "спящем" режиме — запускается через контроллер

- **Production** (`docker-compose.prod.yml`):
    - Traefik v2.11 (reverse proxy + SSL Let's Encrypt)
    - HTTP → HTTPS редирект
    - MySQL 8.0 (без открытых портов)
    - WordPress 6.9.4 (через Traefik, `wp.${DOMAIN}`)
    - Next.js frontend (через Traefik, `${DOMAIN}`)
    - Traefik Dashboard с Basic Auth (`traefik.${DOMAIN}`)

---

## Конвенции разработки

### TypeScript

- Строгий режим (`strict: true`)
- Пути через `@/*` → `./src/*`
- Автогенерация типов из GraphQL в `src/api/gql/`

### GraphQL

- Запросы хранятся в `src/api/queries/`
- Типы генерируются автоматически через `codegen.ts`

### Стилизация

- CSS Modules (`.module.scss`)
- SCSS переменные в `src/app/styles/_variables.scss`
- Миксины в `src/app/styles/_mixins.scss`
- Breakpoints в `src/app/styles/_breakpoints.scss`

### Форматирование

- Prettier: tab width 4, single quotes, trailing comma, semi
- ESLint: `next/core-web-vitals` + `next/typescript`

---

## Важные файлы

| Файл                      | Описание                                   |
| ------------------------- | ------------------------------------------ |
| `codegen.ts`              | Конфигурация GraphQL Codegen               |
| `wp-init.sh`              | Скрипт установки WordPress (тема, плагины) |
| `docker-compose.yml`      | Локальная Docker среда                     |
| `docker-compose.prod.yml` | Продакшен Docker среда с Traefik           |
| `next.config.ts`          | Next.js конфигурация (редиректы, images)   |

---

## Развертывание

### Development

1. Скопируйте `.env.example` → `.env` и заполните переменные
2. В **первом терминале**: `npm run controller`
3. Во **втором терминале**: `npm run docker:up`
4. В WordPress admin bar нажмите **▶️ Запустить Next.js**
5. Frontend доступен на `http://localhost:3000`, WordPress Admin на `http://localhost:8080`
6. Включите **Public Introspection** в WPGraphQL → Settings для работы codegen

### Production

1. Соберите и запуште образ frontend в GitHub Container Registry
2. Настройте GitHub Actions Secrets
3. Запустите `npm run docker:prod:up` — всё запускается автоматически

Домены:

- Frontend: `${DOMAIN}` (например `restoranragu.ru`)
- WordPress Admin: `wp.${DOMAIN}`
- Traefik Dashboard: `traefik.${DOMAIN}` (Basic Auth)

> **Безопасность**: В production нет открытых портов кроме `80`/`443` (Traefik).
> phpMyAdmin удалён — используйте прямое подключение к БД или SSH-туннель.

---

## Заметки

- **UpdraftPlus**: Бэкапы хранятся в Google Drive. При разворачивании контейнера с нуля — восстановите бэкап вручную
- **Ревалидация кэша**: При обновлении поста в WordPress автоматически отправляется запрос на `/api/revalidate` для сброса кэша
- **Превью/Черновики**: Работает через Draft Mode Next.js
- **WooCommerce**: Продукты WooCommerce используются как меню ресторана
