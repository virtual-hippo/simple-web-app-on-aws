import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { lambdaFunctions, Web } from "../constructs";

export interface SimpleWebAppStackProps extends cdk.StackProps {
  sysName: string;
  envName: string;
}

export class SimpleWebAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: SimpleWebAppStackProps) {
    super(scope, id, props);

    new lambdaFunctions.HelloWorldFunc(this, "HelloWorldFunc");

    const web = new Web(this, "Web", {
      sysName: props.sysName,
      envName: props.envName,
    });
  }
}
