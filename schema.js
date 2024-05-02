export const addSpotSchema = {
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
    required : ['lattitude', 'longitude', 'name'],
    additionalProperties: true
}