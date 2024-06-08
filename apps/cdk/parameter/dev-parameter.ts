import { AppParameter } from "./app-parameter";
import { PipelineParameter } from "./pipeline-parameter";

const sysName = "simple-web-app-on-aws";

// Parameters for Dev Account
export const devParameter: AppParameter = {
  env: {
    region: "ap-northeast-1",
  },
  envName: "dev",
  sysName: sysName,
};

// Parameters for Pipeline Account
export const devPipelineParameter: PipelineParameter = {
  env: {
    region: "ap-northeast-1",
  },
  envName: "dev",
  sysName: sysName,
  sourceRepository: "virtual-hippo/simple-web-app-on-aws",
  sourceBranch: "dev",
};
