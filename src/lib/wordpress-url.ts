export function getWordPressUrl(): string {
	// Изображения оптимизируются сервером Next.js, который должен иметь
	// доступ к WordPress по внутреннему URL (docker-compose). Для локального
	// dev (без Docker) используется NEXT_PUBLIC_WORDPRESS_URL или localhost.
	return (
		process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
		process.env.NEXT_PUBLIC_WORDPRESS_URL ||
		'http://localhost:8080'
	);
}
