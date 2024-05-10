export class NotFoundError extends Error {
    constructor(message) {
        super(message)
        this.name = this.constructor.name
        if (Error.captureStackTrace) { // ha létezik a függvény
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

function mapErrorToStatusCode(err) {
    switch (err.name) {
        case 'NotAuthorized' : return 401
        case 'NotFoundError' : return 404
        default: return 500
    }
}

export function errorHandler(err, req, res, next) {
    console.log('Hiba tortent: ', err)
    const code = mapErrorToStatusCode(err)
    res.status(code).send(err.message)
}

export class NotAuthorired extends Error {
    constructor(message) {
        super(message)
        this.name = this.constructor.name
        if (Error.captureStackTrace) { // ha létezik a függvény
            Error.captureStackTrace(this, this.constructor)
        }
    }
}