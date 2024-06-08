import { Environment } from "aws-cdk-lib";

// Parameters for Application
export interface AppParameter {
  env?: Environment;
  envName: string;
  sysName: string;
}
