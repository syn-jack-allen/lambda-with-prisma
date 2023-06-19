import { DockerImage, Stack, StackProps } from 'aws-cdk-lib';
import { Code, LayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class LambdaWithPrismaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bundledLayerVersion = new LayerVersion(this, 'BundledLayerVersion', {
      compatibleRuntimes: [Runtime.NODEJS_18_X],
      code: Code.fromAsset('src/prisma-layer', {
        bundling: {
          image: DockerImage.fromBuild('src/prisma-layer'),
          volumes: [
            {
              hostPath: join(__dirname, '../node_modules'),
              containerPath: '/asset-input/node_modules',
            },
          ],
          command: [
            'bash',
            '-c',
            [
              'esbuild ./client.ts --bundle --platform=node --outdir=/asset-output',
              'cp node_modules/.prisma/client/libquery_engine-rhel-openssl-1.0.x.so.node /asset-output',
              'cp node_modules/.prisma/client/schema.prisma /asset-output',
            ].join(' && '),
          ],
        },
      }),
    });

    const getUsersLambda = new NodejsFunction(this, 'GetUsers', {
      entry: 'src/lambda/getUsers.ts',
      handler: 'handler',
      runtime: Runtime.NODEJS_18_X,
      layers: [bundledLayerVersion],
      bundling: {
        externalModules: ['/opt/client'],
      },
    });
  }
}
