import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { SimpleWebAppStack } from "../stacks/simple-web-app-stack";

interface AppParameter {
  env?: cdk.Environment;
}

export class SimpleWebAppStage extends cdk.Stage {
  constructor(scope: Construct, id: string, props: AppParameter) {
    super(scope, id, props);

    const simpleWebAppStack = new SimpleWebAppStack(this, "SimpleWebApp", {
      env: {
        account: props.env?.account || process.env.CDK_DEFAULT_ACCOUNT,
        region: props.env?.region || process.env.CDK_DEFAULT_REGION,
      },
    });

    cdk.Tags.of(simpleWebAppStack).add("SysName", "simple-web-app-on-aws");
  }
}
