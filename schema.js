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

        name: {
            type: 'string',
            minLength: 6,
            maxLength: 30
        },

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

export const dateSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: 'object',
    properties: {
        date: {
            type: 'string',
            format: 'date-time',
            minimum: new Date().toISOString()
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
            minimum: 24,
            maximum: 24
        },
        ...dateSchema.properties,
        ...nameSchema.properties
    },
    required: ['spotId', 'date', 'name'],
    additionalProperties: true
}

export const userSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: 'object',
    properties: {
        username: { ...nameSchema }, // TODO: ha ez így nem jó, akkor nameSchema type: string
        displayName: { ...nameSchema}
    },
    required: ['username', 'displayName'],
    additionalProperties: true
}