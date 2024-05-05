import { Environment, Stage } from "aws-cdk-lib";
import { Construct } from "constructs";
import { SimpleWebAppStack } from "../stacks/simple-web-app-stack";

interface AppParameter {
  env?: Environment;
}

export class SimpleWebAppStage extends Stage {
  constructor(scope: Construct, id: string, props: AppParameter) {
    super(scope, id, props);

    const simpleWebApp = new SimpleWebAppStack(this, "SimpleWebApp", {
      env: {
        account: props.env?.account || process.env.CDK_DEFAULT_ACCOUNT,
        region: props.env?.region || process.env.CDK_DEFAULT_REGION,
      },
      tags: {
        SysName: "simple-web-app-on-aws",
      },
    });
  }
}