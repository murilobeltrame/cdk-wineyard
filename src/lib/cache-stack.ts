import { NestedStack, NestedStackProps } from "aws-cdk-lib";
import { SecurityGroup, Vpc } from "aws-cdk-lib/aws-ec2";
import { CfnCacheCluster, CfnSubnetGroup } from "aws-cdk-lib/aws-elasticache";
import { Construct } from "constructs";

interface CacheStackProps extends NestedStackProps {
    vpc: Vpc
}

export class CacheStack extends NestedStack {
    readonly server: CfnCacheCluster;
    readonly securityGroup: SecurityGroup;

    constructor(scope: Construct, id: string, props: CacheStackProps) {
        super(scope, id, props);

        const subnetGroup = new CfnSubnetGroup(this, 'wineyardRedisSubnetGroup', {
            description: 'Subnet group for Redis Cluster',
            subnetIds: props.vpc.publicSubnets.map((ps) => ps.subnetId),
            cacheSubnetGroupName: 'wineyardRedisSubnetGroup'
        });

        this.securityGroup = new SecurityGroup(this, 'wineyardRedisSecurityGroup', {
            description: 'Security group for Redis Cluster',
            vpc: props.vpc,
            allowAllOutbound: true
        });

        this.server = new CfnCacheCluster(this, 'wineyardRedisCache', {
            engine: "redis",
            cacheNodeType: "cache.t3.micro",
            numCacheNodes: 1,
            clusterName: 'wineyardRedisCache',
            vpcSecurityGroupIds: [this.securityGroup.securityGroupId],
            cacheSubnetGroupName: subnetGroup.ref
        });
        this.server.addDependsOn(subnetGroup);
    }
}