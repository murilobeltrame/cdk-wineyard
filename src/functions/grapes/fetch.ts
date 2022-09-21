import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { ok, serverError } from "../shared/responses";

const AWS = require('aws-sdk')
const dynamo: DocumentClient = new AWS.DynamoDB.DocumentClient()
const TableName: string = process.env.TABLE_NAME as string

export async function handler(_event: APIGatewayProxyEvent, _context: any): Promise<APIGatewayProxyResult> {
    const query = {TableName}
    try {
        const result = await dynamo.scan(query).promise()
        return ok(result?.Items || [])
    } catch (error) {
        console.error(error)
        return serverError()
    }
}