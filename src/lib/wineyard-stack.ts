import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CacheStack } from './cache-stack';
import { GrapesApiStack } from './grapes-api-stack';
import { VpcStack } from './vpc-stack';

export class WineyardStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new VpcStack(this, 'WineyardVpcStack').vpc;
    const cache = new CacheStack(this, 'WineyardCacheStack', {vpc});

    new GrapesApiStack(this, 'WineyardGrapesApiStack', {cache, vpc});
  }
}
