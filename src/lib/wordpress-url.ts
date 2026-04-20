export function getWordPressUrl(): string {
	// Всегда используем localhost, так как images.unoptimized = true
	// и изображения загружаются напрямую из браузера
	return process.env.NEXT_PUBLIC_WORDPRESS_URL || 'http://localhost:8080';
}
