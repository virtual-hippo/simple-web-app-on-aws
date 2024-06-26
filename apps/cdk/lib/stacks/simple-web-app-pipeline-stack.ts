import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { pipelines, aws_iam as iam } from "aws-cdk-lib";
import { SimpleWebAppStage } from "../stages/simple-web-app-stage";
import { StringParameter } from "aws-cdk-lib/aws-ssm";
import { AppParameters } from "../../parameter";

export interface SimpleWebAppPipelineProps extends cdk.StackProps {
  targetParameters: AppParameters;
  env: cdk.Environment;
  sourceRepository: string;
  sourceBranch: string;
}

export class SimpleWebAppPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: SimpleWebAppPipelineProps) {
    super(scope, id, props);

    const deployRole = new iam.Role(this, "CodeBuildDeployRole", {
      assumedBy: new iam.ServicePrincipal("codebuild.amazonaws.com"),
      managedPolicies: [
        {
          managedPolicyArn: "arn:aws:iam::aws:policy/AdministratorAccess",
        },
      ],
    });

    const connectionArn = StringParameter.valueFromLookup(
      this,
      "/github/simple-web-app-on-aws/connectionArn"
    );

    const pipeline = new pipelines.CodePipeline(this, "Pipeline", {
      crossAccountKeys: true,
      synth: new pipelines.CodeBuildStep("SynthStep", {
        input: pipelines.CodePipelineSource.connection(
          props.sourceRepository,
          props.sourceBranch,
          {
            connectionArn: connectionArn,
          }
        ),
        installCommands: [
          "n stable",
          "node --version",
          "npm i -g pnpm@9.0.0",
          "pnpm --version",
        ],
        commands: ["pnpm i", "cd apps/cdk", "pnpm cdk synth"],
        role: deployRole,
        primaryOutputDirectory: "./apps/cdk/cdk.out",
      }),
    });

    Object.keys(props.targetParameters).forEach((envId) => {
      const deployment = pipeline.addStage(
        new SimpleWebAppStage(this, envId, props.targetParameters[envId])
      );
      // TODO: add test (https://github.com/virtual-hippo/simple-web-app-on-aws/issues/19)
      // deployment.addPost(..);
    });
  }
}
