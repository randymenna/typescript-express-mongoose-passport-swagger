export const getExample = {
    tags: ['Example'],
    description: 'Returns all example records from the system that the user has access to',
    operationId: 'getExample',
    security: [
        {
            // @ts-ignore
            bearerAuth: []
        }
    ],
    responses: {
        '200': {
            description: 'A list of items.',
            'content': {
                'application/json': {
                    schema: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                name: {
                                    type: 'string',
                                    description: 'Name'
                                },
                                age: {
                                    type: 'string',
                                    description: 'Age'
                                },
                                groups: {
                                    type: 'array',
                                    items: {
                                        type: 'string'
                                    }
                                }
                            }
                        }
                    },
                    example: [{
                        name: 'user name',
                        age: 47,
                        groups: [1, 4, 9]
                    }]
                }
            }
        }
    }
};
