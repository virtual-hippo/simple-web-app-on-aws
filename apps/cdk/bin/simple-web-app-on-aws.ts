#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { SimpleWebAppPipelineStack } from "../lib/stacks/simple-web-app-pipeline-stack";
import { appParameters, devPipelineParameter } from "../parameter";

const app = new cdk.App();
const pipelineStack = new SimpleWebAppPipelineStack(
  app,
  "SimpleWebAppPipelineStack",
  {
    env: {
      account:
        devPipelineParameter.env.account || process.env.CDK_DEFAULT_ACCOUNT,
      region: devPipelineParameter.env.region || process.env.CDK_DEFAULT_REGION,
    },
    tags: {
      SysName: devPipelineParameter.sysName,
      Env: devPipelineParameter.envName,
    },
    targetParameters: appParameters,
    sourceRepository: devPipelineParameter.sourceRepository,
    sourceBranch: devPipelineParameter.sourceBranch,
  }
);
