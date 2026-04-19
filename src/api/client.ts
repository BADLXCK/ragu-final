import { GraphQLClient } from 'graphql-request';

const SCHEMA_URL = process.env.SCHEMA_URL || 'http://localhost:8080/graphql';

export const client = new GraphQLClient(SCHEMA_URL);
