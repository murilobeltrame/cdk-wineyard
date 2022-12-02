import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { noContent } from "../shared/responses";

export async function handler (_event: APIGatewayProxyEvent, _context: any): Promise<APIGatewayProxyResult> {
    return noContent();
}