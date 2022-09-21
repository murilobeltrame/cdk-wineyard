import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

const AWS = require('aws-sdk')
const dynamo: DocumentClient = new AWS.DynamoDB.DocumentClient()
const TableName: string = process.env.TABLE_NAME as string

export async function handler(event: APIGatewayProxyEvent, _context: any): Promise<APIGatewayProxyResult> {
    return {
        statusCode: 500,
        body: 'Server Error'
    }
}