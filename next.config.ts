import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
};

module.exports = nextConfig;
