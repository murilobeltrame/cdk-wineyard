import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ok } from "../shared/responses";

export async function handler (_event: APIGatewayProxyEvent, _context: any): Promise<APIGatewayProxyResult> {
    return ok({
        name: 'Marselan',
        color: 'Noir',
        origin: 'France',
        vivc: 16383
    })
}