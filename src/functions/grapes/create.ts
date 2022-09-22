import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { badRequest, created, serverError } from "../shared/responses";
import { Grape } from "./interfaces";
import { createClient } from "@redis/client";

const XRay = require('aws-xray-sdk');
const AWS = XRay.captureAWS(require('aws-sdk'));
const dynamo: DocumentClient = new AWS.DynamoDB.DocumentClient();
const TableName: string = process.env.TABLE_NAME as string;
const url: string = process.env.CACHE_URL as string;
const cache = createClient({url});

cache.on('error', (error) => console.error(error));
cache.connect()

export async function handler(event: APIGatewayProxyEvent, _context: any): Promise<APIGatewayProxyResult> {
    if (!event.body) return badRequest('Empty body');
    let request: Grape;

    try {
        request = JSON.parse(event.body);
    } catch (error) {
        console.error(error);
        return badRequest('Malformed payload');
    }

    try {
        const Item = Object.assign(request, {createdAt: new Date().getTime()});
        await cache.del('grapes')
        await cache.del(`grapes/${Item.name}`.toLowerCase())
        await dynamo.put({ TableName, Item }).promise();
        return created(Item);
    } catch (error) {
        console.error(error);
        return serverError();
    }
}