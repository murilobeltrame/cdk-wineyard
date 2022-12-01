import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { badRequest, created } from "../shared/responses";

export async function handler (event: APIGatewayProxyEvent, _context: any): Promise<APIGatewayProxyResult> {
    const wine = event.body
    if (!wine) return badRequest()
    return created(wine, 'somewhere')
}