import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { CommonWebAcl } from "../constructs/common-web-acl";

interface CloudFrontWafStackProps extends StackProps {
  sysName: string;
  envName: string;
}

export class CloudFrontWafStack extends Stack {
  public readonly webAclArn: string;

  constructor(scope: Construct, id: string, props: CloudFrontWafStackProps) {
    super(scope, id, props);

    const webAcl = new CommonWebAcl(this, `WebAcl${id}`, {
      scope: "CLOUDFRONT",
      name: `${props.sysName}-${props.envName}-web-acl-cloudfront`,
    });

    new CfnOutput(this, "WebAclId", {
      value: webAcl.webAclArn,
    });

    this.webAclArn = webAcl.webAclArn;
  }
}
