#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkTypescriptStack } from '../lib/cdk-typescript-stack';

const app = new cdk.App();
const envAU  = { account: '952096752874', region: 'ap-southeast-2' };

new CdkTypescriptStack(app, 'first-stack-au', { env: envAU });

