const emptyHeader = {
    'Access-Control-Allow-Origin': '*'
}

const defaultHeaders = {
    'Content-Type': 'application/json',
    ... emptyHeader
}

function response(statusCode: number, data: any, headers: any) {
    return {
        statusCode,
        body: typeof data === 'string' ? data : JSON.stringify(data),
        headers
    }
}

export function ok (data: any) { return response(200, data, defaultHeaders) }

export function created (data: any, path: string) { return response(201, data, {'Location': path, ... defaultHeaders}) }

export function noContent () { return response (204, '', emptyHeader) }

export function badRequest (message?: string) { return response (400, message || 'Bad Request', defaultHeaders) }

export function notFound (message?: string) { return response (404, message || 'Not Found', defaultHeaders) }

export function serverError () { return response (500, 'Server Error', defaultHeaders) }