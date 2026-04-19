import type { NextConfig } from 'next';

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
		remotePatterns: [
			{
				protocol: 'http',
				hostname: 'wordpress',
				port: '',
				pathname: '/**',
			},
		],
	},
	sassOptions: {
		silenceDeprecations: ['legacy-js-api'],
	},
	turbopack: {},
	webpack: (config) => {
		config.watchOptions = {
			poll: 1000,
			aggregateTimeout: 300,
		};
		return config;
	},
};

export default nextConfig;
