import { AppParameter } from "./app-parameter";
import { PipelineParameter } from "./pipeline-parameter";

// Parameters for Dev Account
export const devParameter: AppParameter = {
  env: {
    region: "ap-northeast-1",
  },
  envName: "Development",
  sysName: "simple-web-app-on-aws",
};

// Parameters for Pipeline Account
export const devPipelineParameter: PipelineParameter = {
  env: {
    region: "ap-northeast-1",
  },
  envName: "Development",
  sysName: "simple-web-app-on-aws-pipeline",
  sourceRepository: "virtual-hippo/simple-web-app-on-aws",
  sourceBranch: "dev",
};
