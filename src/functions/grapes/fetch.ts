import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ok } from "../shared/responses";

export async function handler (_event: APIGatewayProxyEvent, _context: any): Promise<APIGatewayProxyResult> {
    return ok([
        {
            name: 'Agiorgitiko',
            color: 'Noir',
            origin: 'Greece',
            vivc: 102
        },
        {
            name: 'Kreaca',
            color: 'Blanc',
            origin: 'Serbia',
            vivc: 6501
        },
        {
            name: 'Primitivo',
            color: 'Noir',
            origin: 'Balkan',
            vivc: 9703
        },
    ])
}