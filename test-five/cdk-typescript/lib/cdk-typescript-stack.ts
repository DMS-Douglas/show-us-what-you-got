import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib/core';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as deploy from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';

//TODO externalize this as stack parameters or environment variables...
// Maybe use dotenv -> https://dev.to/asjadanis/parsing-env-with-typescript-3jjm
const STACK_AWS_REGION_ACM = "us-east-1"
const WEB_APP_DOMAIN_BASE = "dev.cloud.tutis.com.au"
const WEB_APP_DOMAIN = "test-opensearch" + "." + WEB_APP_DOMAIN_BASE

export class CdkTypescriptStack extends Stack {

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    //Get The Hosted Zone
    const zone = route53.HostedZone.fromLookup(this, "Zone", {
      domainName: WEB_APP_DOMAIN_BASE,
    });
    console.log(zone.zoneName);

    //Create S3 Bucket for our website
    const siteBucket = new s3.Bucket(this, "test-static-s3-website-s3-assets", {
      bucketName: WEB_APP_DOMAIN,
      websiteIndexDocument: "index.html",
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    })

    //Create Certificate
    const siteCertificateArn = new acm.DnsValidatedCertificate(this, "SiteCertificate", {
      domainName: WEB_APP_DOMAIN,
      hostedZone: zone,
      region: STACK_AWS_REGION_ACM
    }).certificateArn;

    //Create CloudFront Distribution
    const siteDistribution = new cloudfront.CloudFrontWebDistribution(this, "SiteDistribution", {
      originConfigs: [{
        customOriginSource: {
          domainName: siteBucket.bucketWebsiteDomainName,
          originProtocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY
        },
        behaviors: [{
          isDefaultBehavior: true
        }]
      }]
    });

    //Create A Record Custom Domain to CloudFront CDN
    new route53.ARecord(this, "SiteRecord", {
      recordName: WEB_APP_DOMAIN,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(siteDistribution)),
      zone
    });

    //Deploy site to s3
    new deploy.BucketDeployment(this, "s3-bucket-deployment-process", {
      sources: [deploy.Source.asset("./react-app/public")],
      destinationBucket: siteBucket,
      distribution: siteDistribution,
      distributionPaths: ["/*"]
    });

  }
}
