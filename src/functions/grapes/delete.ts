import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { badRequest, noContent, notFound, serverError } from "../shared/responses";

const AWS = require('aws-sdk');
const dynamo: DocumentClient = new AWS.DynamoDB.DocumentClient();
const TableName: string = process.env.TABLE_NAME as string;

export async function handler(event: APIGatewayProxyEvent, _context: any): Promise<APIGatewayProxyResult> {
    if (!event.pathParameters || !event.pathParameters.name) return badRequest('Empty parameter');
    const name = event.pathParameters.name;

    try {
        const query = {TableName, Key: {name}};
        const result = await dynamo.get(query).promise();
        if (!result) return notFound();
        await dynamo.delete(query).promise();
        return noContent();
    } catch (error) {
        console.error(error);
        return serverError();
    }
}