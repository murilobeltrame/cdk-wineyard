import { NestedStack, NestedStackProps, RemovalPolicy } from "aws-cdk-lib";
import { LambdaIntegration, MethodLoggingLevel, RestApi } from "aws-cdk-lib/aws-apigateway";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { Runtime, Tracing } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as path from 'path';

export class GrapesApi extends NestedStack {
    api: RestApi

    constructor(scope: Construct, id: string, props: NestedStackProps) {
        super(scope, id, props);
        
        const entityName = 'grapes'

        const table = new Table(this, `${entityName}table`, {
            partitionKey: {
                name: 'name',
                type: AttributeType.STRING
            },
            tableName: entityName,
            removalPolicy: RemovalPolicy.DESTROY,
            billingMode: BillingMode.PAY_PER_REQUEST
        })

        const environment = { TABLE_NAME: table.tableName }
        const propsFor = (fileName: string) => {
            return {
                entry: path.join(__dirname, `../functions/grapes/${fileName}.ts`),
                handler: 'handler',
                runtime: Runtime.NODEJS_16_X,
                environment,
                tracing: Tracing.ACTIVE
            }
        }

        const fetchFunction = new NodejsFunction(this, `${entityName}fetchapi`, propsFor('fetch'))
        table.grantReadData(fetchFunction)

        const getFunction = new NodejsFunction(this, `${entityName}getapi`, propsFor('get'))
        table.grantReadData(getFunction)

        const createFunction = new NodejsFunction(this, `${entityName}createapi`, propsFor('create'))
        table.grantWriteData(createFunction)

        const updateFunction = new NodejsFunction(this, `${entityName}updateapi`, propsFor('update'))
        table.grantReadWriteData(updateFunction)

        const deleteFunction = new NodejsFunction(this, `${entityName}deleteapi`, propsFor('delete'))
        table.grantReadWriteData(deleteFunction)

        this.api = new RestApi(this, `${entityName}restapi`, {
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