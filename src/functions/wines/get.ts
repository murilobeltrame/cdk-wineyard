import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ok } from "../shared/responses";

export async function handler (_event: APIGatewayProxyEvent, _context: any): Promise<APIGatewayProxyResult> {
    return ok({
        wineryName: 'Erns Loosen',
        label: 'Dornfelder',
        country: 'Germany',
        region: 'Pfalz',
        grapes: ['Dornfelder'],
        year: '2018'
    })
}