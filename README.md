# Ресторан «Рагу» — Next.js + WordPress

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![WordPress](https://img.shields.io/badge/WordPress-6.9.4-21759B)](https://wordpress.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6)](https://www.typescriptlang.org/)

Современный сайт ресторана «Рагу» построенный на **Next.js 15** (App Router) с использованием **WordPress** как Headless CMS для управления контентом.

## ✨ Возможности

- 🍽️ **Динамическое меню ресторана** — страницы блюд с категориями из WooCommerce
- 📅 **Афиша событий** — актуальные мероприятия ресторана
- 🎉 **Банкеты** — информация о банкетах и мероприятиях
- 🖼️ **Галерея** — фотогалерея с интеграцией Yandex Maps
- ⭐ **Отзывы** — страница отзывов клиентов
- 📞 **Контакты** — контактная информация с картой
- 📝 **Бронирование** — форма бронирования столиков
- 🔄 **Кэширование с ревалидацией** — автоматическое обновление кэша при изменении в CMS
- 👁️ **Превью черновиков** — просмотр черновиков через Draft Mode Next.js
- 🎨 **TypeScript из коробки** — автоматическая генерация типов из GraphQL схемы WordPress

## 🛠️ Технологии

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

## 📁 Структура проекта

```
ragu-final/
├── src/
│   ├── api/            # GraphQL клиент и запросы
│   │   ├── gql/        # Автогенерированные типы
│   │   ├── queries/    # GraphQL запросы
│   │   └── client.ts   # GraphQL клиент
│   ├── app/            # Next.js страницы
│   │   ├── menu/       # Страницы меню ресторана
│   │   ├── banquet/    # Банкеты
│   │   ├── gallery/    # Галерея
│   │   ├── contacts/   # Контакты
│   │   ├── reviews/    # Отзывы
│   │   ├── reserve/    # Бронирование
│   │   └── afisha/     # Афиша
│   ├── components/     # React компоненты
│   ├── layouts/        # Layout компоненты
│   ├── hooks/          # Кастомные хуки
│   └── utils/          # Утилиты
├── wp-content/
│   ├── themes/ragu/    # Кастомная тема WordPress
│   └── plugins/        # Плагины WordPress
├── docker-compose.yml       # Development конфигурация
├── docker-compose.prod.yml  # Production конфигурация
└── codegen.ts               # GraphQL Codegen конфигурация
```

## 🚀 Быстрый старт

### Требования

- **Node.js 22+**
- **Docker & Docker Compose**
- **npm**

### Установка

1. **Клонируйте репозиторий**

```bash
git clone <repository-url>
cd ragu-final
```

2. **Установите зависимости**

```bash
npm install
```

3. **Настройте окружение**

```bash
cp .env.example .env
# Отредактируйте .env файл с вашими значениями
```

4. **Запустите Docker контейнеры**

```bash
npm run docker:up
```

5. **Откройте сайт**

- Frontend: [http://localhost:3000](http://localhost:3000)
- WordPress Admin: [http://localhost:8080](http://localhost:8080)

### Важные команды

```bash
# Разработка
npm run dev     # Запуск Next.js dev сервера
npm run build   # Сборка проекта
npm run start   # Запуск production сервера
npm run lint    # Проверка линтером
npm run codegen # Генерация GraphQL типов

# Docker (Development)
npm run docker:up      # Запуск контейнеров
npm run docker:down    # Остановка контейнеров
npm run docker:restart # Перезапуск контейнеров

# Docker (Production)
npm run docker:prod:up   # Запуск production
npm run docker:prod:down # Остановка production

# Анализ кода
npm run find-deadcode # Поиск неиспользуемого кода
npm run knip          # Проверка неиспользуемых зависимостей
```

## ⚙️ Конфигурация

### Переменные окружения

См. файл `.env.example` для полного списка переменных.

**Ключевые переменные:**

| Переменная      | Описание                 | Пример                          |
| --------------- | ------------------------ | ------------------------------- |
| `DATABASE_NAME` | Имя БД WordPress         | `wordpress`                     |
| `WORDPRESS_URL` | URL WordPress админки    | `http://localhost:8080`         |
| `SCHEMA_URL`    | URL GraphQL эндпоинта    | `http://localhost:8080/graphql` |
| `DOMAIN`        | Домен сайта (production) | `restoranragu.ru`               |

### WordPress плагины

Проект использует следующие плагины:

- **WPGraphQL** — GraphQL API
- **WooCommerce** — управление продуктами
- **ACF Pro** — кастомные поля
- **WordPress SEO (Yoast)** — SEO оптимизация
- **FileBird** — организация медиа
- **UpdraftPlus** — бэкапы
- **Redirection** — управление редиректами

### GraphQL

WPGraphQL Public Introspection **выключен по умолчанию**. Включите вручную:

1. Откройте WPGraphQL → Settings в WordPress admin
2. Поставьте галочку **Enable Public Introspection**
3. Сохраните изменения

После изменений в WordPress обновите типы:

```bash
npm run codegen
```

## 🏗️ Архитектура

### Development

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js Dev   │    │   WordPress      │    │   MySQL 8.0     │
│   (порт 3000)   │◄──►│   (порт 8080)    │◄──►│   (internal)    │
│                 │    │   + WPGraphQL    │    │                 │
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
        │  Next.js    │ │ WP     │ │   MySQL     │
        │  (порт 3000)│ │ Admin  │ │  (internal) │
        │             │ │        │ │             │
        └─────────────┘ └────────┘ └─────────────┘
```

## 📝 Развертывание

### Development

1. Скопируйте `.env.example` → `.env`
2. Запустите `npm run docker:up`

### Production

1. Соберите Docker образ и запуште в GitHub Container Registry
2. Настройте GitHub Actions Secrets
3. Запустите `npm run docker:prod:up`

**Домены в production:**

- Frontend: `${DOMAIN}` (например `restoranragu.ru`)
- WordPress Admin: `wp.${DOMAIN}`
- Traefik Dashboard: `traefik.${DOMAIN}` (Basic Auth)

> **Безопасность**: В production открыты только порты `80`/`443` (Traefik). База данных недоступна извне.

## 🔧 Разработка

### TypeScript

- Строгий режим (`strict: true`)
- Пути через `@/*` → `./src/*`
- Автоматическая генерация типов из GraphQL схемы

### Стилизация

- CSS Modules (`.module.scss`)
- SCSS переменные в `src/app/styles/_variables.scss`
- Миксины в `src/app/styles/_mixins.scss`

### Форматирование

- **Prettier**: tab width 4, single quotes, trailing comma, semicolons
- **ESLint**: `next/core-web-vitals` + `next/typescript`

## 📚 Документация

- [Next.js Documentation](https://nextjs.org/docs)
- [WordPress Codex](https://codex.wordpress.org/)
- [WPGraphQL Documentation](https://www.wpgraphql.com/docs/introduction)
- [GraphQL Codegen](https://www.graphql-code-generator.com/)

## 🤝 Поддержка

По вопросам поддержки и развития проекта обращайтесь к команде разработки.

---

© 2026 Ресторан «Рагу». Все права защищены.
