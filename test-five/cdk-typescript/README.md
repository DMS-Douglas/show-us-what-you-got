# Welcome to your CDK TypeScript project

You should explore the contents of this project. It demonstrates a CDK app with an instance of a stack (`CdkTypescriptStack`)
which contains a simple static react app that is being deployed to S3 and served via CloudFront distribution.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## To start working on this project I suggest
* Ensure aws cli is installed and on the latest version
* Ensure nodejs is installed and on the latest version
* Ensure aws cdk is installed and on the latest version
* To test, change directory on the terminal: cd .\test-five\cdk-typescript\react-app
** And run `npm install && npm run build` -> this will build the local react app
* Now change back to the cdk-typescript directory: cd..
** And run `npm install -g typescript`
** And run `npm install`
** And run `npm run build`
** And run `npm run cdk-diff`


## Useful commands

* `npm run build`       compile typescript to js
* `npm run watch`       watch for changes and compile
* `npm run test`        perform the jest unit tests
* `cdk run cdk-deploy`  deploy this stack to your default AWS account/region
* `cdk run cdk-diff`    compare deployed stack with current state
* `cdk run cdk-synth`   emits the synthesized CloudFormation template
### NPM was configured to build and call cdk commands for simplicity sake


## This project was created via:
* Following instructions on https://cdkworkshop.com/15-prerequisites.html to setup (AWS CLI, NodeJS, NPM CDK client)
* Following instructions on https://cdkworkshop.com/20-typescript.html to setup a new typescript project from a sample app
* AWS credentials are configured via defaul profile externally but this can be changed to a named profile and the aws cli commands will need the --profile option
* Also used this resource though it was using cdk v1 libraries instead of v2: https://paulallies.medium.com/deploy-your-static-react-app-to-aws-cloudfront-using-cdk-e53287e0052e

## Documenting work done to complete this task
* As a start I am reading up on some AWS docs related to resiliency: https://aws.amazon.com/blogs/architecture/understand-resiliency-patterns-and-trade-offs-to-architect-efficiently-in-the-cloud/
* Now I am thinking about some of the options, Multi-AZ lambdas would provide the best elasticity but might become expensive very quickly (though CloudFront would probably prevent that...)
* Found another insteresting AWS write up related to react on lambda: https://aws.amazon.com/blogs/compute/building-server-side-rendering-for-react-in-aws-lambda/
* In the end, decided not to prematurely optimize and went for a simpler CloudFront + S3 upstream which should give enough availability and reliability at a low cost

## Other notes and trade-off comments
* For a larger project I would consider AWS Fargate with a target tracking autoscaling
* Depending on the project I would consider adding a separate target group or upstream to handle quicker scaling (this would depend on how quickly the original setup can scale, more of a contingency plan for unpredictable scenarios, this would require good testing in place, during a proof of concept and continuosly)
* AWS CloudFront can do used with multiple upstreams to increase availability though it is hard to beat S3, might be useful when we need to add dynamic processing shifting traffic to other upstreams that may use the extra redundancy (upstram groups)
* Global Accelerator is worth mentioning though I don't think the use case here asks for it:
** https://aws.amazon.com/global-accelerator/faqs/#:~:text=A%3A%20AWS%20Global%20Accelerator%20and,acceleration%20and%20dynamic%20site%20delivery).
**https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_globalaccelerator-readme.html

## Final Notes
* At this stage I have been able to plan the resources and things look ok but I havent attempted to deploy yet.
* After attempting to deploy most likely there will be issues that I would address as they come
* If Moshtix can provide me with a limited access credentials that can call cdk bootstrap and deploy resources to S3, CloudFront and Route53 I am happy to continue on, otherwise I believe the contents on this projects are enough to understand my thought process and how I would go about implementing solutions (please note that this one was done under serious constraints, I was able to work on it for about 4 hours max, but with many breaks so not continueous effort)