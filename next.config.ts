import type { NextConfig } from 'next';

const remotePatterns: NonNullable<NextConfig['images']>['remotePatterns'] = [
	{ protocol: 'http', hostname: 'wordpress' },
	{ protocol: 'http', hostname: 'localhost', port: '8080' },
];

if (process.env.DOMAIN) {
	remotePatterns?.push({
		protocol: 'https',
		hostname: `wordpress.${process.env.DOMAIN}`,
	});
}

const nextConfig: NextConfig = {
	output: 'standalone',
	async redirects() {
		return [
			{
				source: '/menu',
				destination: '/menu/zakuski',
				permanent: true,
			},
		];
	},
	images: {
		remotePatterns,
		// WordPress работает в приватной Docker-сети (IP 172.x.x.x),
		// поэтому Next 16 блокирует загрузку оригиналов без этого флага
		dangerouslyAllowLocalIP: true,
		qualities: [75, 100],
	},
	experimental: {
		viewTransition: true,
	},
};

export default nextConfig;
