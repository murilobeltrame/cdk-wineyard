import { NestedStack, NestedStackProps } from "aws-cdk-lib";
import { LambdaIntegration, MethodLoggingLevel, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Runtime, Tracing } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction, NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as path from 'path';

export class GrapeApiStack extends NestedStack {
    constructor(scope: Construct, id: string, props?: NestedStackProps) {
        super(scope, id, props);
        
        const propsFor = (fileName: string): NodejsFunctionProps => {
            return {
                entry: path.join(__dirname, `../functions/grapes/${fileName}.ts`),
                handler: 'handler',
                runtime: Runtime.NODEJS_18_X,
                tracing: Tracing.ACTIVE
            }
        }

        const fetchFunction = new NodejsFunction(this, 'GrapesFetch', propsFor('fetch'))

        const getFunction = new NodejsFunction(this, 'GrapeGet', propsFor('get'))

        const createFunction = new NodejsFunction(this, 'GrapeCreate', propsFor('create'))

        const updateFunction = new NodejsFunction(this, 'GrapeUpdate', propsFor('update'))

        const deleteFunction = new NodejsFunction(this, 'GrapeDelete', propsFor('delete'))

        const api = new RestApi(this, 'GrapeApi', {
            restApiName: 'GrapeApi',
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