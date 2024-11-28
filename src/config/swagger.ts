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
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
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
              example: 'Fundamental',
              description: 'Tipo do nível de ensino (fundamental, médio, pré-vestibular)'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Erro interno do servidor.'
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
  apis: ['src/controller/*.ts', 'src/docs/*.ts']
};
