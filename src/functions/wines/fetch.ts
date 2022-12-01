import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ok } from "../shared/responses";

export async function handler (_event: APIGatewayProxyEvent, _context: any): Promise<APIGatewayProxyResult> {
    return ok([
        {
            wineryName: 'Erns Loosen',
            label: 'Dornfelder',
            country: 'Germany',
            region: 'Pfalz',
            grapes: ['Dornfelder'],
            year: '2018'
        },
        {
            wineryName: 'Oxford Landing',
            label: 'Shiraz',
            country: 'Australia',
            region: 'South Australia',
            grapes: ['Shiraz'],
            year: '2019'
        },
        {
            wineryName: 'Domaine de Sahari',
            label: 'Guerrouane Rosé',
            country: 'Morrocco',
            region: 'Guerrouane',
            grapes: ['Grenache', 'Carignan', 'Cinsault'],
            year: '2018'
        },
    ])
}