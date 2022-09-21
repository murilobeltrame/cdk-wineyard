import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { badRequest, notFound, ok, serverError } from "../shared/responses";

const XRay = require('aws-xray-sdk');
const AWS = XRay.captureAWS(require('aws-sdk'));
const dynamo: DocumentClient = new AWS.DynamoDB.DocumentClient();
const TableName: string = process.env.TABLE_NAME as string;

export async function handler(event: APIGatewayProxyEvent, _context: any): Promise<APIGatewayProxyResult> {
    if (!event.pathParameters || !event.pathParameters.name) return badRequest('Empty parameter');
    const name = event.pathParameters.name;

    try {
        const result = await dynamo.get({TableName, Key:{name}}).promise();
        if (result?.Item) {
            return ok(result.Item);
        }
        return notFound();
    } catch (error) {
        console.error(error);
        return serverError();
    }
}