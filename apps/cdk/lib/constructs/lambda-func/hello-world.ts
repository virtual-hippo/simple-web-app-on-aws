import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime } from "aws-cdk-lib/aws-lambda";

export interface HelloWorldFuncProps {}

export class HelloWorldFunc extends Construct {
  constructor(scope: Construct, id: string, props?: HelloWorldFuncProps) {
    super(scope, id);

    const helloWorldFunc = new lambda.NodejsFunction(this, "HelloWorldFunc", {
      runtime: Runtime.NODEJS_20_X,
      entry: "./lambda/hello-world.ts",
      timeout: cdk.Duration.minutes(1),
      environment: {},
    });
  }
}
