const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
}

// OKs
export function ok(data: any) {
    return {
        statusCode: 200,
        body: typeof data === 'string'? data : JSON.stringify(data),
        headers
    }
}

export function created(data: any) {
    return {
        statusCode: 201,
        body: JSON.stringify(data),
        headers
    }
}

export function noContent() {
    return {
        statusCode: 204,
        body: '',
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    }
}

// Client Error
export function badRequest(message?: string) {
    return {
        statusCode: 400,
        body: message || 'Bad Request'
    }
}

export function notFound(message?: string) {
    return {
        statusCode: 404,
        body: message || 'Not Found'
    }
}

// Server Error
export function serverError() {
    return {
        statusCode: 500,
        body: 'Server Error'
    }
}