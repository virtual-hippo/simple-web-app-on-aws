import { Environment } from "aws-cdk-lib";

export interface PipelineParameter {
  env: Environment; // required
  envName: string;
  sysName: string;
  sourceRepository: string;
  sourceBranch: string;
}
