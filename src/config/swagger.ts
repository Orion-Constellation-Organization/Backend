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
      { name: 'Subject', description: 'Rotas relacionadas a matérias' }
    ,
      { name: 'Student', description: 'Rotas relacionadas a estudantes' },
      { name: 'Student Lessons', description: 'Rotas relacionadas às aulas dos estudantes' },
      { name: 'Lesson Request', description: 'Rotas relacionadas às solicitações de aulas' }
    ],
    components: {
      schemas: {
        Student: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            fullName: { type: 'string', example: 'Nome do Estudante' },
            username: { type: 'string', example: 'nome_estudante' },
            birthDate: { type: 'string', format: 'date', example: '2000-01-01' },
            email: { type: 'string', example: 'email@exemplo.com' },
            educationLevel: {
              type: 'object',
              properties: {
                educationId: { type: 'integer', example: 1 },
                levelType: { type: 'string', example: 'Fundamental' }
              }
            }
          }
        },
        LessonRequest: {
          type: 'object',
          properties: {
            ClassId: { type: 'integer', example: 1 },
            reason: { type: 'array', items: { type: 'string' }, example: ['reforço'] },
            preferredDates: {
              type: 'array',
              items: { type: 'string', format: 'date-time' },
              example: ['2025-12-14T22:30']
            },
            status: { type: 'string', example: 'pendente' },
            additionalInfo: { type: 'string', example: 'Looking for a tutor with experience in calculus.' }
          }
        }
      },
      responses: {
        Unauthorized: {
          description: 'Unauthorized, missing or invalid token',
          content: {
            'application/json': {
              schema: { type: 'object', properties: { message: { type: 'string', example: 'Token inválido.' } } }
            }
          }
        },
        InternalServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: { type: 'object', properties: { message: { type: 'string', example: 'Erro interno do servidor.' } } }
            }
          }
        },
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: { type: 'object', properties: { message: { type: 'string', example: 'Não encontrado.' } } }
            }
          }
        }
      }
    },
    security: [{ BearerAuth: [] }]
  },
  apis: ['src/controller/*.ts']
};
