#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { CdkStack } from "../lib/cdk-stack";

const app = new cdk.App();
const stack = new CdkStack(app, "CdkStack", {});

cdk.Tags.of(stack).add("SysName", "simple-web-app-on-aws");
