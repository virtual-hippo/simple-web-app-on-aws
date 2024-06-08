import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as iam from "aws-cdk-lib/aws-iam";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as cloudfront_origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as waf from "aws-cdk-lib/aws-wafv2";

import { NodejsBuild } from "deploy-time-build";

export interface WebProps {
  sysName: string;
  envName: string;
}

// referred to the following article
// https://zenn.dev/funteractiveinc/articles/153581a53ef0fa
export class Web extends Construct {
  public readonly distribution: cloudfront.Distribution;

  constructor(scope: Construct, id: string, props: WebProps) {
    super(scope, id);

    /**
     * source bucket
     */
    const sourceBucket = new s3.Bucket(this, "S3WebAssetsBucket", {
      bucketName: `${props.sysName}-${props.envName}-web-assets`,
      encryption: s3.BucketEncryption.S3_MANAGED,
      versioned: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      autoDeleteObjects: true,
    });

    /**
     * logging bucket
     */
    const cloudfrontLoggingBucket = new s3.Bucket(
      this,
      "CloudfrontLoggingBucket",
      {
        bucketName: `${props.sysName}-${props.envName}-cloudfront-access-log`,
        encryption: s3.BucketEncryption.S3_MANAGED,
        versioned: false,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_PREFERRED,
        enforceSSL: true,
        autoDeleteObjects: true,
      }
    );

    /**
     * OAC
     */
    const originAccessControl = new cloudfront.CfnOriginAccessControl(
      this,
      "CloudFrontOAC",
      {
        originAccessControlConfig: {
          name: `${props.sysName}-${props.envName}-oac-for-web-assets-bucket`,
          originAccessControlOriginType: "s3",
          signingBehavior: "always",
          signingProtocol: "sigv4",
          description: "Origin access control provisioned by aws-cloudfront-s3",
        },
      }
    );

    /**
     * response headers policy
     */
    const responseHeadersPolicy = new cloudfront.ResponseHeadersPolicy(
      this,
      "ResponseHeadersPolicy",
      {
        securityHeadersBehavior: {
          contentTypeOptions: { override: true },
          frameOptions: {
            frameOption: cloudfront.HeadersFrameOption.DENY,
            override: true,
          },
          referrerPolicy: {
            referrerPolicy: cloudfront.HeadersReferrerPolicy.SAME_ORIGIN,
            override: true,
          },
          strictTransportSecurity: {
            accessControlMaxAge: cdk.Duration.seconds(63072000),
            includeSubdomains: true,
            preload: true,
            override: true,
          },
          xssProtection: {
            protection: true,
            modeBlock: true,
            override: true,
          },
        },
        customHeadersBehavior: {
          customHeaders: [
            {
              header: "Cache-Control",
              value: "no-cache",
              override: true,
            },
            {
              header: "pragma",
              value: "no-cache",
              override: true,
            },
            {
              header: "server",
              value: "",
              override: true,
            },
          ],
        },
      }
    );

    /**
     * Distribution
     */
    const distribution = new cloudfront.Distribution(this, "DistributionId", {
      defaultRootObject: "index.html",
      defaultBehavior: {
        origin: new cloudfront_origins.S3Origin(sourceBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        responseHeadersPolicy,
      },
      enableLogging: true,
      logBucket: cloudfrontLoggingBucket,
      logFilePrefix: "distribution-access-log/",
      logIncludesCookies: true,
    });

    const cfnDistribution = distribution.node
      .defaultChild as cloudfront.CfnDistribution;

    cfnDistribution.addPropertyOverride(
      "DistributionConfig.Origins.0.OriginAccessControlId",
      originAccessControl.getAtt("Id")
    );
    cfnDistribution.addPropertyOverride(
      "DistributionConfig.Origins.0.DomainName",
      sourceBucket.bucketRegionalDomainName
    );
    cfnDistribution.addOverride(
      "Properties.DistributionConfig.Origins.0.S3OriginConfig.OriginAccessIdentity",
      ""
    );
    cfnDistribution.addPropertyDeletionOverride(
      "DistributionConfig.Origins.0.CustomOriginConfig"
    );

    /**
     * bucket policy
     */
    const bucketPolicyStatement = new iam.PolicyStatement({
      actions: ["s3:GetObject"],
      effect: iam.Effect.ALLOW,
      principals: [new iam.ServicePrincipal("cloudfront.amazonaws.com")],
      resources: [`${sourceBucket.bucketArn}/*`],
      conditions: {
        StringEquals: {
          "AWS:SourceArn": `arn:aws:cloudfront::${cdk.Aws.ACCOUNT_ID}:distribution/${distribution.distributionId}`,
        },
      },
    });
    sourceBucket.addToResourcePolicy(bucketPolicyStatement);

    // TODO: add WAF

    new NodejsBuild(this, "Web", {
      assets: [
        {
          path: "../../",
          exclude: [
            ".env",
            ".git",
            ".gitignore",
            ".npmrc",
            ".tool-versions",
            ".vscode",
            "LICENCE",
            "*.md",
            "docs",
            "imgs",
            "node_modules",
            "apps/cdk",
            "apps/web/dist",
            "apps/web/node_modules",
          ],
        },
      ],
      destinationBucket: sourceBucket,
      distribution: distribution,
      outputSourceDirectory: "./packages/web/dist",
      buildCommands: [
        "npm i -g pnpm@9.0.0",
        "pnpm i",
        "pnpm -F web install",
        "pnpm -F web build",
      ],
      buildEnvironment: {},
    });

    this.distribution = distribution;
  }
}
