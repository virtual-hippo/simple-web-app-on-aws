import { Tags } from "aws-cdk-lib";
import { CfnWebACL } from "aws-cdk-lib/aws-wafv2";
import { Construct } from "constructs";

export interface CommonWebAclProps {
  scope: "REGIONAL" | "CLOUDFRONT";
  name: string;
}

export class CommonWebAcl extends Construct {
  public readonly webAclArn: string;

  constructor(scope: Construct, id: string, props: CommonWebAclProps) {
    super(scope, id);

    const webAcl = new CfnWebACL(this, `WebAcl${id}`, {
      defaultAction: { block: {} },
      name: props.name,
      scope: props.scope,
      visibilityConfig: {
        cloudWatchMetricsEnabled: true,
        sampledRequestsEnabled: true,
        metricName: `WebAcl${id}`,
      },
      rules: [
        {
          priority: 1,
          overrideAction: { count: {} },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: "AWS-AWSManagedRulesCommonRuleSet",
          },
          name: "AWSManagedRulesCommonRuleSet",
          statement: {
            managedRuleGroupStatement: {
              vendorName: "AWS",
              name: "AWSManagedRulesCommonRuleSet",
            },
          },
        },
        {
          priority: 2,
          overrideAction: { count: {} },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: "AWS-AWSManagedRulesKnownBadInputsRuleSet",
          },
          name: "AWSManagedRulesKnownBadInputsRuleSet",
          statement: {
            managedRuleGroupStatement: {
              vendorName: "AWS",
              name: "AWSManagedRulesKnownBadInputsRuleSet",
            },
          },
        },
        {
          priority: 3,
          overrideAction: { count: {} },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: "AWS-AWSManagedRulesAmazonIpReputationList",
          },
          name: "AWSManagedRulesAmazonIpReputationList",
          statement: {
            managedRuleGroupStatement: {
              vendorName: "AWS",
              name: "AWSManagedRulesAmazonIpReputationList",
            },
          },
        },
        {
          priority: 4,
          overrideAction: { count: {} },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: "AWS-AWSManagedRulesLinuxRuleSet",
          },
          name: "AWSManagedRulesLinuxRuleSet",
          statement: {
            managedRuleGroupStatement: {
              vendorName: "AWS",
              name: "AWSManagedRulesLinuxRuleSet",
            },
          },
        },
        {
          priority: 5,
          overrideAction: { count: {} },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: "AWS-AWSManagedRulesSQLiRuleSet",
          },
          name: "AWSManagedRulesSQLiRuleSet",
          statement: {
            managedRuleGroupStatement: {
              vendorName: "AWS",
              name: "AWSManagedRulesSQLiRuleSet",
            },
          },
        },
        {
          priority: 6,
          name: `GeoMatchSetRule${id}`,
          action: { allow: {} },
          visibilityConfig: {
            cloudWatchMetricsEnabled: true,
            metricName: `Customor-GeoMatchSetRule${id}`,
            sampledRequestsEnabled: true,
          },
          statement: {
            geoMatchStatement: {
              countryCodes: ["JP"],
            },
          },
        },
      ],
    });

    this.webAclArn = webAcl.attrArn;
  }
}
