#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { SimpleWebAppPipelineStack } from "../lib/stacks/simple-web-app-pipeline-stack";

const app = new cdk.App();
const stack = new SimpleWebAppPipelineStack(app, "SimpleWebAppPipelineStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  tags: {
    SysName: "simple-web-app-on-aws",
  },
});
