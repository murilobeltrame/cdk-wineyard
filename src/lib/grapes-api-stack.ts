import { NestedStack, NestedStackProps, RemovalPolicy } from "aws-cdk-lib";
import { LambdaIntegration, MethodLoggingLevel, RestApi } from "aws-cdk-lib/aws-apigateway";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { Port, SecurityGroup, SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";
import { CfnCacheCluster } from "aws-cdk-lib/aws-elasticache";
import { ManagedPolicy, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { Runtime, Tracing } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction, NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import { LambdaToDynamoDB } from '@aws-solutions-constructs/aws-lambda-dynamodb';
import { Construct } from "constructs";
import * as path from 'path';

interface GrapesApiProps extends NestedStackProps {
    cache: {
        server: CfnCacheCluster
        securityGroup: SecurityGroup
    }
    vpc: Vpc
}

export class GrapesApiStack extends NestedStack {
    api: RestApi

    constructor(scope: Construct, id: string, props: GrapesApiProps) {
        super(scope, id, props);
        
        const entityName = 'Grapes'

        const table = new Table(this, `WineYard${entityName}Table`, {
            partitionKey: {
                name: 'name',
                type: AttributeType.STRING
            },
            tableName: entityName,
            removalPolicy: RemovalPolicy.DESTROY,
            billingMode: BillingMode.PAY_PER_REQUEST
        })

        const securityGroup = new SecurityGroup(this, `Wineyard${entityName}FunctionsSG`, {
            vpc: props.vpc,
            allowAllOutbound: true,
            description: `Security group for ${entityName} Lambda Functions`
        })
        securityGroup.connections.allowTo(props.cache.securityGroup, Port.tcp(6379), 'Allow Lambdas to connect to the Redis cache')

        const role = new Role(this, `Wineyard${entityName}FunctionsRole`, { assumedBy: new ServicePrincipal('lambda.amazonaws.com')})
        role.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonElastiCacheFullAccess'))
        role.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaENIManagementAccess'))

        const environment = { 
            TABLE_NAME: table.tableName, 
            CACHE_URL:  `redis://${props.cache.server.attrRedisEndpointAddress}:${props.cache.server.attrRedisEndpointPort}`
        }

        const propsFor = (fileName: string): NodejsFunctionProps => {
            return {
                entry: path.join(__dirname, `../functions/grapes/${fileName}.ts`),
                handler: 'handler',
                runtime: Runtime.NODEJS_16_X,
                tracing: Tracing.ACTIVE,
                vpc: props.vpc,
                securityGroups: [securityGroup],
                vpcSubnets: { subnetType: SubnetType.PRIVATE_ISOLATED },
                role,
                environment
            }
        }

        const fetchFunction = new NodejsFunction(this, `Wineyard${entityName}FetchApi`, propsFor('fetch'))
        new LambdaToDynamoDB(this, `Wineyard${entityName}FetchApiToDynamo`, {
            existingLambdaObj: fetchFunction,
            existingTableObj: table,
            existingVpc: props.vpc,
            tablePermissions: 'Read',
            tableEnvironmentVariableName: 'TABLE_NAME'
        })

        const getFunction = new NodejsFunction(this, `Wineyard${entityName}GetApi`, propsFor('get'))
        new LambdaToDynamoDB(this, `Wineyard${entityName}GetApiToDynamo`, {
            existingLambdaObj: getFunction,
            existingTableObj: table,
            existingVpc: props.vpc,
            tablePermissions: 'Read',
            tableEnvironmentVariableName: 'TABLE_NAME'
        })

        const createFunction = new NodejsFunction(this, `Wineyard${entityName}CreateApi`, propsFor('create'))
        new LambdaToDynamoDB(this, `Wineyard${entityName}CreateApiToDynamo`, {
            existingLambdaObj: createFunction,
            existingTableObj: table,
            existingVpc: props.vpc,
            tablePermissions: 'Write',
            tableEnvironmentVariableName: 'TABLE_NAME'
        })

        const updateFunction = new NodejsFunction(this, `Wineyard${entityName}UpdateApi`, propsFor('update'))
        new LambdaToDynamoDB(this, `Wineyard${entityName}UpdateApiToDynamo`, {
            existingLambdaObj: updateFunction,
            existingTableObj: table,
            existingVpc: props.vpc,
            tablePermissions: 'ReadWrite',
            tableEnvironmentVariableName: 'TABLE_NAME'
        })

        const deleteFunction = new NodejsFunction(this, `Wineyard${entityName}DeleteApi`, propsFor('delete'))
        new LambdaToDynamoDB(this, `Wineyard${entityName}DeleteApiToDynamo`, {
            existingLambdaObj: deleteFunction,
            existingTableObj: table,
            existingVpc: props.vpc,
            tablePermissions: 'ReadWrite',
            tableEnvironmentVariableName: 'TABLE_NAME'
        })

        this.api = new RestApi(this, `Wineyard${entityName}RestApi`, {
            restApiName: entityName,
            deployOptions: {
                metricsEnabled: true,
                loggingLevel: MethodLoggingLevel.INFO,
                dataTraceEnabled: true,
                tracingEnabled: true
            }
        })
        this.api.root.addCorsPreflight({
            allowOrigins:['*'],
            allowMethods:['GET', 'POST']
        })
        this.api.root.addMethod('GET', new LambdaIntegration(fetchFunction))
        this.api.root.addMethod('POST', new LambdaIntegration(createFunction))
        const itemResource = this.api.root.addResource('{name}')
        itemResource.addCorsPreflight({
            allowOrigins:['*'],
            allowMethods:['GET','PUT', 'DELETE']
        })
        itemResource.addMethod('GET', new LambdaIntegration(getFunction))
        itemResource.addMethod('PUT', new LambdaIntegration(updateFunction))
        itemResource.addMethod('DELETE', new LambdaIntegration(deleteFunction))
    }
}