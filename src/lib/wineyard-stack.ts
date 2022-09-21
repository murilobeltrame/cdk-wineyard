import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { GrapesApi } from './grapes-api';

export class WineyardStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new GrapesApi(this, 'grapesapi', {});
  }
}
