import { NestedStack, NestedStackProps } from "aws-cdk-lib";
import { LambdaIntegration, MethodLoggingLevel, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Runtime, Tracing } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction, NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as path from 'path';

export class WineApiStack extends NestedStack {
    constructor(scope: Construct, id: string, props?: NestedStackProps){
        super(scope, id, props)

        const propsFor = (fileName: string): NodejsFunctionProps => {
            return {
                entry: path.join(__dirname, `../functions/wines/${fileName}.ts`),
                handler: 'handler',
                runtime: Runtime.NODEJS_18_X,
                tracing: Tracing.ACTIVE
            }
        }

        const fetchFunction = new NodejsFunction(this, 'WineFetch', propsFor('fetch'))

        const getFunction = new NodejsFunction(this, 'WineGet', propsFor('get'))

        const createFunction = new NodejsFunction(this, 'WineCreate', propsFor('create'))

        const updateFunction = new NodejsFunction(this, 'WineUpdate', propsFor('update'))

        const deleteFunction = new NodejsFunction(this, 'WineDelete', propsFor('delete'))

        const api = new RestApi(this, 'WineApi', {
            restApiName: 'WineApi',
            deployOptions: {
                metricsEnabled: true,
                loggingLevel: MethodLoggingLevel.INFO,
                dataTraceEnabled: true,
                tracingEnabled: true
            }
        })
        api.root.addCorsPreflight({
            allowOrigins: ['*'],
            allowMethods: ['GET', 'POST']
        })
        api.root.addMethod('GET', new LambdaIntegration(fetchFunction))
        api.root.addMethod('POST', new LambdaIntegration(createFunction))
        const apiItem = api.root.addResource('{id}')
        apiItem.addCorsPreflight({
            allowOrigins: ['*'],
            allowMethods: ['GET', 'PATCH', 'DELETE']
        })
        apiItem.addMethod('GET', new LambdaIntegration(getFunction))
        apiItem.addMethod('PATCH', new LambdaIntegration(updateFunction))
        apiItem.addMethod('DELETE', new LambdaIntegration(deleteFunction))
    }
}