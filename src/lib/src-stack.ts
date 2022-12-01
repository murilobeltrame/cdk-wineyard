import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { WineApiStack } from './wine-apis-stack';

export class SrcStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new WineApiStack(this, 'WineApiStack')
  }
}
