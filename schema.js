import { starToId } from "./star-to-index.js"

export const nameSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: 'object',
    properties: {
        name: {
            type: 'string',
            minLength: 6,
            maxLength: 30
        }
    },
    required: ['name']
}

export const spotSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    type : 'object',
    properties: {
        lattitude: {
            type: 'number',
            minimum: -90.0,
            maximum: 90.0
        },

        longitude: {
            type: 'number',
            minimum: -180.0,
            maximum: 180.0
        },

        ...nameSchema.properties,

        lightPollution: {
            type: 'number',
            minimum: 0.0
        }

    },
    required: ['lattitude', 'longitude', 'name'],
    additionalProperties: true
}

export const ratingSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    type : 'object',
    properties: {
        rating: {
            type: 'number',
            minimum: 0.0,
            maximum: 5.0
        }
    },
    required: ['rating']
}


export const dateSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: 'object',
    properties: {
        date: {
            type: 'integer',
            minimum: Date.now()
        }
    },
    required: ['date']
}

export const tripSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: 'object',
    properties: {
        spotId: {
            type: 'string',
            minLength: 24,
            minLength: 24
        },
        ...dateSchema.properties,
        ...nameSchema.properties
    },
    required: ['spotId', 'date', 'name'],
    additionalProperties: true
}

export const registerUserSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: 'object',
    properties: {
        username: {
            ...nameSchema.properties.name,
        },
        displayName: {
            ...nameSchema.properties.name
        },
        password: {
            type: 'string',
            minLength: 6,
            maxLength: 20,
            pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$"
        }
    },
    required: ['username', 'displayName', 'password'],
    additionalProperties: true,
}

export const usernameSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: 'object',
    properties: {
        newUsername: {
            ...nameSchema.properties.name
        }
    },
    required: ['newUsername'],
    additionalProperties: true
}

export const displayNameSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: 'object',
    properties: {
        newDisplayName: {
            ...nameSchema.properties.name
        }
    },
    required: ['newDisplayName'],
    additionalProperties: true
}

export const forecastSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    type : 'object',
    properties: {
        lattitude: {
            type: 'number',
            minimum: -90.0,
            maximum: 90.0
        },

        longitude: {
            type: 'number',
            minimum: -180.0,
            maximum: 180.0
        },

        stars: {
            type: 'array',
            items: {
                type: 'string',
                enum: Object.keys(starToId)
            }
        },

        timeZone: {
            type: 'string',
            enum: Intl.supportedValuesOf('timeZone')
        },

        threshold : {
            type: 'number',
            minimum: 0.0,
            maximum: 100.0
        }
    },
    required: ['lattitude', 'longitude', 'stars'],
    additionalProperties: true
}