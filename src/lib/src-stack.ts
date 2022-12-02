import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { GrapeApiStack } from './grape-apis-stack';
import { WineApiStack } from './wine-apis-stack';

export class SrcStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new GrapeApiStack(this, 'GrapeApiStack')
    new WineApiStack(this, 'WineApiStack')
  }
}
