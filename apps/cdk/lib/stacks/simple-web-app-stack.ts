import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambdaFunc from "../constructs/lambda-func";

export class SimpleWebAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new lambdaFunc.HelloWorldFunc(this, "HelloWorldFunc");
  }
}
