import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { pipelines } from "aws-cdk-lib";
import { SimpleWebAppStage } from "../stages/simple-web-app-stage";
import { StringParameter } from "aws-cdk-lib/aws-ssm";

export interface SimpleWebAppPipelineProps extends cdk.StackProps {}

export class SimpleWebAppPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: SimpleWebAppPipelineProps) {
    super(scope, id, props);

    const githubOwner = "virtual-hippo";
    const githubRepo = "simple-web-app-on-aws";
    const githubBranch = "master";
    const connectionArn = StringParameter.valueFromLookup(
      this,
      "/github/simple-web-app-on-aws/connectionArn"
    );

    const pipeline = new pipelines.CodePipeline(this, "Pipeline", {
      crossAccountKeys: true,
      synth: new pipelines.CodeBuildStep("SynthStep", {
        input: pipelines.CodePipelineSource.connection(
          `${githubOwner}/${githubRepo}`,
          githubBranch,
          {
            connectionArn: connectionArn,
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

    const deployment = pipeline.addStage(
      new SimpleWebAppStage(this, "Dev", {})
    );
    // TODO: add test (https://github.com/virtual-hippo/simple-web-app-on-aws/issues/19)
    // deployment.addPost(..);
  }
}
