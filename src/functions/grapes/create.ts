import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { badRequest, created, serverError } from "../shared/responses";
import { Grape } from "./interfaces";

const AWS = require('aws-sdk')
const dynamo: DocumentClient = new AWS.DynamoDB.DocumentClient()
const TableName: string = process.env.TABLE_NAME as string

export async function handler(event: APIGatewayProxyEvent, _context: any): Promise<APIGatewayProxyResult> {

    if (!event.body) return badRequest('Empty body')
    let request: Grape

    try {
        request = JSON.parse(event.body)
    } catch (error) {
        console.error(error)
        return badRequest('Malformed payload')
    }

    try {
        const Item = Object.assign(request, {createdAt: new Date().getTime()})
        await dynamo.put({ TableName, Item }).promise()
        return created(request)
    } catch (error) {
        console.error(error)
        return serverError()
    }
}