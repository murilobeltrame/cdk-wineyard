import { NestedStack, NestedStackProps } from "aws-cdk-lib";
import { SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

export class VpcStack extends NestedStack {
    readonly vpc: Vpc
    constructor(scope: Construct, id: string, props?: NestedStackProps) {
        super(scope, id, props);
        this.vpc = new Vpc(this, 'WineyardVpc', {
            maxAzs: 1,
            cidr: '10.10.0.0/24',
            natGateways: 1,
            subnetConfiguration: [{
                name: 'WineyardPublicSubnet',
                subnetType: SubnetType.PUBLIC
            }, {
                name: 'WineyardPrivateSubnet',
                subnetType: SubnetType.PRIVATE_ISOLATED
            }]
        })
    }
}