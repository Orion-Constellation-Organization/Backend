import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerConfig: swaggerJSDoc.OAS3Options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Orion Constellation API',
      description: 'Documentação da API do projeto Orion.',
      version: '1.0.0'
    },
    servers: [
      {
        url: 'http://localhost:4444',
        description: 'Servidor Local'
      }
    ],
    tags: [
      
      { name: 'Auth', description: 'Rotas relacionadas à autenticação' },
      { name: 'Education Level', description: 'Rotas relacionadas aos níveis de ensino' }
    ,
      { name: 'Subject', description: 'Rotas relacionadas a matérias' }
    ],
    components: {
      schemas: {
        EducationLevel: {
          type: 'object',
          properties: {
            educationId: {
              type: 'integer',
              example: 1
            },
            levelType: {
              type: 'string',
              enum: ['fundamental', 'medio', 'pre-vestibular'],
              example: 'Fundamental'
            }
          }
        },
        EducationLevelList: {
          type: 'array',
          items: {
            $ref: '#/components/schemas/EducationLevel'
          }
        }
      },
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      responses: {
        Unauthorized: {
          description: 'Unauthorized, missing or invalid token',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'Token inválido.'
                  }
                }
              }
            }
          }
        },
        BadRequest: {
          description: 'Bad request, invalid or missing parameters',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'Nível de ensino é obrigatório.'
                  }
                }
              }
            }
          }
        },
        InternalServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'Erro interno do servidor.'
                  }
                }
              }
            }
          }
        }
      }
    },
    security: [
      {
        BearerAuth: []
      }
    ]
  },
  apis: ['src/controller/*.ts']
};
