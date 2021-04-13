import * as cdk from '@aws-cdk/core';
import {  NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import { LambdaProxyIntegration } from '@aws-cdk/aws-apigatewayv2-integrations';
import { HttpApi } from '@aws-cdk/aws-apigatewayv2';
import { Function as LambdaFunction, Runtime, Code, LayerVersion, DockerImageFunction, DockerImageCode } from '@aws-cdk/aws-lambda'
import * as ecr from '@aws-cdk/aws-ecr';

export class HellocdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    const lambdaWithLayers = new NodejsFunction(this, 'lambda-with-layers', {
      entry: './src/lambda-in-layer/handler.ts',
      handler: 'handle',
      functionName: 'WellHelloCDK1'
    });

    const expressAppLayers = new NodejsFunction(this, 'express-with-layers', {
      entry: './src/express-in-layer/lambda-server.ts',
      handler: 'handle',
      functionName: 'ExpressHelloCDK'
    });

    const lambdaIntegration = new LambdaProxyIntegration({
      handler: expressAppLayers
    });

    const httpApi = new HttpApi(this, 'http-api', {
      defaultIntegration: lambdaIntegration
    })

    const expressAppLayers2 = new LambdaFunction(this, 'lambda-fn', {
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset('./src/express-in-layer'),
      handler: 'lambda-server.handle',
      functionName: 'ExpressHelloCDKWithLayers',      
    });


    const nodemodulesLayer = new LayerVersion(this, 'nodemodules', {
      code: Code.fromAsset('./src/dependency-layer'),
      compatibleRuntimes: [Runtime.NODEJS_14_X],
    })

    const expressAppLayers3 = new LambdaFunction(this, 'lambda-fn-stripped', {
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset('./src/express-in-layer', {
        exclude: ['node_modules']
      }),
      handler: 'lambda-server.handle',
      functionName: 'ExpressHelloCDKWithLayersSlim',
      layers: [nodemodulesLayer]
    });


    const appRepo = ecr.Repository.fromRepositoryName(this, 'express-in-lambda-repo', 'express-in-lambda');

    const webApp = new DockerImageFunction(this, 'ExpressInLambdaInDocker', {
      code: DockerImageCode.fromEcr(appRepo, {
        tag: 'latest',
      }),
      memorySize: 1000,
    })    

  }
}
