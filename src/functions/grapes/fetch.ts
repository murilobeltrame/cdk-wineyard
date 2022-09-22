import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { ok, serverError } from "../shared/responses";
import { createClient } from "@redis/client";

const XRay = require('aws-xray-sdk');
const AWS = XRay.captureAWS(require('aws-sdk'));
const dynamo: DocumentClient = new AWS.DynamoDB.DocumentClient();
const TableName: string = process.env.TABLE_NAME as string;
const url: string = process.env.CACHE_URL as string;
const cache = createClient({url});

cache.on('error', (error) => console.error(error));
cache.connect()

export async function handler(_event: APIGatewayProxyEvent, _context: any): Promise<APIGatewayProxyResult> {
    const key = 'grapes'
    const query = {TableName};

    try {
        const response = await cache.get(key)
        if (response) {
            return ok(response)
        }
        const result = await dynamo.scan(query).promise();
        if (result?.Items) {
            await cache.set(key, JSON.stringify(result.Items))
            return ok(result.Items)
        }
        return ok([]);
    } catch (error) {
        console.error(error)
        return serverError()
    }
}