import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { badRequest, created } from "../shared/responses";

export async function handler (event: APIGatewayProxyEvent, _context: any): Promise<APIGatewayProxyResult> {
    const grape = event.body
    if (!grape) return badRequest()
    return created(grape, 'somewhere')
}