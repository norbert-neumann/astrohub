export function errorHandler(err, req, res, next) {
    const code = mapErrorToStatusCode(err)
    res.status(code).send(err.message)
}

export class BadRequest extends Error {
    constructor(message) {
        super(message)
        this.name = this.constructor.name
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export class NotAuthorired extends Error {
    constructor(message) {
        super(message)
        this.name = this.constructor.name
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export class NotFound extends Error {
    constructor(message) {
        super(message)
        this.name = this.constructor.name
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

function mapErrorToStatusCode(err) {
    switch (err.name) {
        case 'BadRequest': return 400
        case 'NotAuthorized' : return 401
        case 'NotFound' : return 404
        default: return 500
    }
}