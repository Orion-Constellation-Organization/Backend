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
      { name: 'Lesson Request', description: 'Rotas relacionadas às solicitações de aula' }
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
        LessonRequest: {
          type: 'object',
          properties: {
            ClassId: { type: 'integer', example: 12 },
            reason: {
              type: 'array',
              items: { type: 'string' },
              example: ['reforço']
            },
            preferredDates: {
              type: 'array',
              items: { type: 'string', format: 'date-time' },
              example: ['2024-12-25T23:45:00Z']
            },
            status: { type: 'string', example: 'pendente' },
            additionalInfo: { type: 'string', example: 'Looking for a tutor with experience in calculus.' },
            subject: {
              type: 'object',
              properties: {
                subjectId: { type: 'integer', example: 1 },
                subjectName: { type: 'string', example: 'Biologia' }
              }
            },
            student: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 2 },
                username: { type: 'string', example: 'Jose123' },
                fullName: { type: 'string', example: 'Jose Silva' },
                birthDate: { type: 'string', format: 'date', example: '2001-03-19' },
                educationLevel: {
                  type: 'object',
                  properties: {
                    educationId: { type: 'integer', example: 1 },
                    levelType: { type: 'string', example: 'Fundamental' }
                  }
                }
              }
            }
          }
        },
        CreateLessonRequest: {
          type: 'object',
          properties: {
            reason: {
              type: 'array',
              items: { type: 'string', enum: ['reforço', 'prova ou trabalho', 'correção de exercício', 'outro'] },
              example: ['reforço']
            },
            preferredDates: {
              type: 'array',
              items: { type: 'string' },
              description: 'Preferred dates for the lesson',
              example: ['2024-12-22T10:00:00Z']
            },
            subjectId: { type: 'integer', description: 'ID of the subject', example: 1 },
            additionalInfo: {
              type: 'string',
              description: 'Additional information',
              maxLength: 200,
              example: 'Looking for a tutor with experience in calculus.'
            },
            studentId: { type: 'integer', description: 'ID of the student', example: 1 }
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
      },
      responses: {
        BadRequest: {
          description: 'Bad request, validation errors',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Dados inválidos fornecidos.' }
                }
              }
            }
          }
        },
        Unauthorized: {
          description: 'Unauthorized, missing or invalid token',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Token inválido.' }
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
                  message: { type: 'string', example: 'Erro interno do servidor.' }
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
  apis: ['src/controller/*.ts', 'src/docs/*.ts']
};
