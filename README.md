# Ресторан «Рагу» — Next.js + WordPress

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![WordPress](https://img.shields.io/badge/WordPress-6.9.4-21759B)](https://wordpress.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6)](https://www.typescriptlang.org/)

Современный сайт ресторана «Рагу» построенный на **Next.js 15** (App Router) с использованием **WordPress** как Headless CMS для управления контентом.

## Возможности

- Динамическое меню ресторана — страницы блюд с категориями из WooCommerce
- Афиша событий — актуальные мероприятия ресторана
- Банкеты — информация о банкетах и мероприятиях
- Галерея — фотогалерея с интеграцией Yandex Maps
- Отзывы — страница отзывов клиентов
- Контакты — контактная информация с картой
- Бронирование — форма бронирования столиков
- Кэширование с ревалидацией — автоматическое обновление кэша при изменении в CMS
- Превью черновиков — просмотр черновиков через Draft Mode Next.js
- TypeScript — автоматическая генерация типов из GraphQL схемы WordPress

## Технологии

### Frontend

- **Next.js 15** — React фреймворк с App Router
- **React 19** — библиотека для создания UI
- **TypeScript 5.9** — типизация JavaScript
- **GraphQL Codegen** — автоматическая генерация типов из WordPress
- **SCSS Modules** — модульные стили с CSS Modules
- **Yandex Maps** — интеграция карт

### Backend (CMS)

- **WordPress 6.9.4** — Headless CMS
- **WPGraphQL** — GraphQL API для WordPress
- **WooCommerce** — управление продуктами (меню ресторана)
- **ACF Pro** — Advanced Custom Fields
- **Yoast SEO** — SEO оптимизация

### DevOps

- **Docker & Docker Compose** — контейнеризация
- **Traefik** — reverse proxy + SSL (production)
- **MySQL 8.0** — база данных

## Структура проекта

```
ragu-final/
├── src/
│   ├── api/            # GraphQL клиент и запросы
│   │   ├── gql/        # Автогенерированные типы
│   │   ├── queries/    # GraphQL запросы
│   │   └── client.ts   # GraphQL клиент
│   ├── app/            # Next.js страницы
│   ├── components/     # React компоненты
│   ├── layouts/        # Layout компоненты
│   ├── hooks/          # Кастомные хуки
│   └── utils/          # Утилиты
├── wp-content/
│   └── themes/ragu/    # Кастомная тема WordPress
├── wordpress/
│   ├── themes/         # Темы для сборки в образ
│   ├── setup.sh        # Скрипт инициализации WP
│   └── entrypoint.sh   # Entrypoint для Docker
├── .github/
│   └── workflows/
│       ├── docker-wordpress.yml  # CI/CD для WordPress образа
│       ├── docker-frontend.yml  # CI/CD для Frontend образа
│       └── deploy.yml            # Деплой на сервер
├── Dockerfile.wordpress     # WordPress образ
├── Dockerfile.frontend      # Frontend образ
├── docker-compose.yml       # Development конфигурация
├── docker-compose.prod.yml  # Production конфигурация
└── codegen.ts               # GraphQL Codegen конфигурация
```

## Быстрый старт

### Требования

- Node.js 22+
- Docker & Docker Compose
- npm

### Установка

1. Клонируйте репозиторий

```bash
git clone <repository-url>
cd ragu-final
```

2. Установите зависимости

```bash
npm install
```

3. Настройте окружение

```bash
cp .env.example .env
# Отредактируйте .env файл с вашими значениями
```

4. Запустите Docker контейнеры

```bash
npm run docker:up
```

5. Откройте сайт

- Frontend: http://localhost:3000
- WordPress Admin: http://localhost:8080

### Команды

```bash
# Разработка
npm run dev     # Запуск Next.js dev сервера
npm run build   # Сборка проекта
npm run lint    # Проверка линтером
npm run codegen # Генерация GraphQL типов

# Docker
npm run docker:up      # Запуск контейнеров
npm run docker:down    # Остановка контейнеров
npm run docker:restart # Перезапуск контейнеров

# Анализ кода
npm run find-deadcode # Поиск неиспользуемого кода
npm run knip          # Проверка неиспользуемых зависимостей
```

## Конфигурация

### Переменные окружения

См. файл `.env.example` для полного списка переменных.

### WordPress плагины

- WPGraphQL — GraphQL API
- WooCommerce — управление продуктами
- ACF Pro — кастомные поля
- WordPress SEO (Yoast) — SEO оптимизация
- FileBird — организация медиа
- UpdraftPlus — бэкапы
- Redirection — управление редиректами

### GraphQL

WPGraphQL Public Introspection выключен по умолчанию. Включите вручную в WPGraphQL → Settings.

После изменений в WordPress обновите типы:

```bash
npm run codegen
```

## Архитектура

### Development

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js Dev   │    │   WordPress      │    │   MySQL 8.0     │
│   (порт 3000)   │◄──►│   (порт 8080)    │◄──►│   (internal)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Production

```
                    ┌──────────────────┐
                    │   Traefik        │
                    │   (80/443)       │
                    │   + SSL          │
                    └────────┬─────────┘
                             │
               ┌─────────────┼─────────────┐
               │             │             │
        ┌──────▼──────┐ ┌───▼────┐ ┌──────▼──────┐
        │  Frontend   │ │ WP     │ │   MySQL     │
        │  (port 3000)│ │ Admin  │ │  (internal) │
        └─────────────┘ └────────┘ └─────────────┘
```

## Развертывание

### Development

1. Скопируйте `.env.example` → `.env`
2. Запустите `npm run docker:up`

WordPress автоматически настроится при первом запуске (через `wp-init.sh`).

### Production

#### GitHub Actions

При пуше в `main`:
- `src/` + `Dockerfile.frontend` → автоматическая сборка `ragu-frontend`
- `wordpress/` + `wp-content/` + `Dockerfile.wordpress` → автоматическая сборка `ragu-wordpress`

Образы публикуются в GHCR: `ghcr.io/<owner>/ragu-*`

#### Ручная сборка

```bash
# Frontend
docker build -f Dockerfile.frontend -t ghcr.io/<owner>/ragu-frontend:latest .

# WordPress
docker build -f Dockerfile.wordpress -t ghcr.io/<owner>/ragu-wordpress:latest .

# Push
docker push ghcr.io/<owner>/ragu-frontend:latest
docker push ghcr.io/<owner>/ragu-wordpress:latest
```

#### Запуск на сервере

1. Настройте переменные окружения на сервере
2. Запустите `docker compose` с `docker-compose.prod.yml`

**Домены в production:**

- Frontend: `${DOMAIN}`
- WordPress Admin: `wp.${DOMAIN}`
- Traefik Dashboard: `traefik.${DOMAIN}` (Basic Auth)

## Разработка

### TypeScript

- Строгий режим (`strict: true`)
- Пути через `@/*` → `./src/*`
- Автоматическая генерация типов из GraphQL схемы

### Стилизация

- CSS Modules (`.module.scss`)
- SCSS переменные в `src/app/styles/_variables.scss`
- Миксины в `src/app/styles/_mixins.scss`

---

© 2026 Ресторан «Рагу».
