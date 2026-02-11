import type { CodegenConfig } from '@graphql-codegen/cli';
import { loadEnvConfig } from '@next/env';

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const config: CodegenConfig = {
	overwrite: true,
	schema: {
		[`${process.env.SCHEMA_URL}`]: {
			headers: {
				'User-Agent': 'Codegen',
			},
		},
	},
	generates: {
		'src/api/gql/': {
			preset: 'client',
		},
		'src/api/gql/schema.gql': {
			plugins: ['schema-ast'],
		},
	},
};

export default config;
