import { Construct } from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3Dedploy from '@aws-cdk/aws-s3-deployment';

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    // S3 bucket as well as properties for configuration
    const bucket = new s3.Bucket(this, "TicketMasterReactAppCDK", {
      publicReadAccess: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      websiteIndexDocument: "index.html"
    });

    // Deployment to deploy S3 bucket
    const src = new s3Dedploy.BucketDeployment(this, "DeployTMRACDK", {
      sources: [s3Dedploy.Source.asset("../build")],
      destinationBucket: bucket
    });

    // Cloudfront as CDN to expose S3 URLs as well as caching
    const cf = new cloudfront.CloudFrontWebDistribution(this, "StaticDistributionTMRACDK", {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: bucket
          },
          behaviors: [{isDefaultBehavior: true}]
        }
      ]
    });
  }
}
