#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { SimpleWebAppPipelineStack } from "../lib/stacks/simple-web-app-pipeline-stack";

const app = new cdk.App();
const stack = new SimpleWebAppPipelineStack(
  app,
  "SimpleWebAppPipelineStack",
  {}
);

cdk.Tags.of(stack).add("SysName", "simple-web-app-on-aws");
