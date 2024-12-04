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
      { name: 'Education Level', description: 'Rotas relacionadas aos níveis de ensino' },
      { name: 'Subject', description: 'Rotas relacionadas a matérias' },
      { name: 'Student', description: 'Rotas relacionadas a estudantes' },
      { name: 'Student Lessons', description: 'Rotas relacionadas às aulas dos estudantes' },
      { name: 'Lesson Request', description: 'Rotas relacionadas às solicitações de aulas' }

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
          in: 'header',
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
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
