import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { CloudFrontWafStack } from "../stacks/cloud-front-waf-stack";
import { SimpleWebAppStack } from "../stacks/simple-web-app-stack";
import { AppParameter } from "../../parameter";

export class SimpleWebAppStage extends cdk.Stage {
  constructor(scope: Construct, id: string, props: AppParameter) {
    super(scope, id, props);

    let cloudFrontWafStack;
    if (props.isWafEnabled) {
      cloudFrontWafStack = new CloudFrontWafStack(this, "CloudFrontWafStack", {
        env: {
          account: props.env?.account || process.env.CDK_DEFAULT_ACCOUNT,
          region: "us-east-1",
        },
        tags: {
          SysName: props.sysName,
          Env: props.envName,
        },
        crossRegionReferences: true,
        sysName: props.sysName,
        envName: props.envName,
      });
    }

    const simpleWebAppStack = new SimpleWebAppStack(this, "SimpleWebApp", {
      env: {
        account: props.env?.account || process.env.CDK_DEFAULT_ACCOUNT,
        region: props.env?.region || process.env.CDK_DEFAULT_REGION,
      },
      tags: {
        SysName: props.sysName,
        Env: props.envName,
      },
      crossRegionReferences: props.isWafEnabled && true,
      sysName: props.sysName,
      envName: props.envName,
      cloudFrontWebAclArn: cloudFrontWafStack && cloudFrontWafStack.webAclArn,
    });

    if (cloudFrontWafStack) {
      simpleWebAppStack.addDependency(cloudFrontWafStack);
    }
  }
}
