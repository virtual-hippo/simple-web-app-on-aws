import { AppParameter } from "./app-parameter";
import { devParameter } from "./dev-parameter";

export type AppParameters = Record<string, AppParameter>;
export const appParameters: AppParameters = {
  Dev: devParameter,
};
