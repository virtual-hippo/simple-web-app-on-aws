#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { SimpleWebAppStack } from "../lib/stacks/simple-web-app-stack";

const app = new cdk.App();
const stack = new SimpleWebAppStack(app, "SimpleWebAppStack", {});

cdk.Tags.of(stack).add("SysName", "simple-web-app-on-aws");
