import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { pipelines } from "aws-cdk-lib";
import { SimpleWebAppStage } from "../stages/simple-web-app-stage";

export interface SimpleWebAppPipelineProps extends cdk.StackProps {}

export class SimpleWebAppPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: SimpleWebAppPipelineProps) {
    super(scope, id, props);

    const githubRepo = "simple-web-app-on-aws";
    const githubBranch = "master";

    const pipeline = new pipelines.CodePipeline(this, "Pipeline", {
      crossAccountKeys: true,
      synth: new pipelines.CodeBuildStep("SynthStep", {
        input: pipelines.CodePipelineSource.connection(
          githubRepo,
          githubBranch,
          {
            connectionArn:
              "arn:aws:codestar-connections:ap-northeast-1:000000000000:connection/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          }
        ),
        installCommands: [
          "n stable",
          "node --version",
          "npm i -g pnpm",
          "pnpm --version",
        ],
        commands: ["pnpm i", "pnpm cdk synth"],
        primaryOutputDirectory: "./apps/cdk/cdk.out",
      }),
    });

    pipeline.addStage(new SimpleWebAppStage(this, "Dev", {}));
  }
}
