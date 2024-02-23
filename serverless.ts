import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  app: 'app',
  service: '${self:app}-api',

  frameworkVersion: '3',
  configValidationMode: 'error',

  provider: {
    name: 'aws',
    runtime: 'nodejs20.x',
    architecture: 'arm64',
    memorySize: 512,
    timeout: 29, // the maximum api gateway timeout is 29s
    tags: {
      developer: 'ian',
      project: '${self:app}',
      service: '${self:service}',
    },
    logRetentionInDays: 60,
    environment: {
      STAGE: '${sls:stage}',
      NODE_OPTIONS: '--enable-source-maps',
    },
    iam: {
      role: {
        statements: [],
      },
    },
    httpApi: {
      cors: true,
    },
  },

  functions: {
    api: {
      handler: 'src/lambda.handler',
      // url: {
      //   cors: { allowCredentials: true },
      // },
      events: [
        {
          httpApi: '*',
        },
      ],
    },
  },

  package: {
    individually: true,
  },

  // https://github.com/floydspace/serverless-esbuild
  plugins: ['serverless-esbuild', 'serverless-offline'],

  custom: {
    esbuild: {
      minify: true,
      sourcemap: true,
      packager: 'pnpm',
      exclude: [],
    },
  },
};

const functions = serverlessConfiguration.functions;
for (const name in functions) {
  if (Object.prototype.hasOwnProperty.call(functions, name)) {
    const fn = functions[name];
    if (fn.name === undefined) {
      fn.name = `\${self:app}-\${sls:stage}-${name}`;
    }
  }
}

module.exports = serverlessConfiguration;
