import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerConfig: swaggerJSDoc.OAS3Options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'orion-constellation-api',
      description: 'Documentação da API do projeto Orion.',
      version: '1.0.0'
    },
    host: 'localhost:4444',
    components: {
      securitySchemes: {
        BearerAuth: {
          in: 'header',
          type: 'http',
          scheme: 'bearer'
        }
      },
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Erro interno do servidor.' }
          }
        },
        EducationLevel: {
          type: 'object',
          properties: {
            educationId: { type: 'integer', example: 1 },
            levelType: { type: 'string', example: 'Fundamental' }
          }
        },
        LessonRequest: {
          type: 'object',
          properties: {
            reason: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['reforço', 'prova ou trabalho', 'correção de exercício', 'outro']
              },
              example: ['reforço']
            },
            preferredDates: {
              type: 'array',
              items: { type: 'string' },
              description: 'Preferred dates for the lesson',
              example: ['22/12/2024 às 10:00']
            },
            additionalInfo: {
              type: 'string',
              maxLength: 200,
              example: 'Looking for a tutor with experience in calculus.'
            },
            studentId: { type: 'integer', example: 1 }
          }
        },
        Subject: {
          type: 'object',
          properties: {
            subjectId: { type: 'integer', example: 1 },
            subjectName: { type: 'string', example: 'Matemática' }
          }
        },
        Student: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            username: { type: 'string', example: 'student123' },
            fullName: { type: 'string', example: 'Nome Estudante' },
            birthDate: { type: 'string', example: '2001-03-19' },
            educationLevel: { $ref: '#/components/schemas/EducationLevel' }
          }
        },
        Tutor: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            username: { type: 'string', example: 'tutor123' },
            fullName: { type: 'string', example: 'Nome Tutor' },
            expertise: { type: 'string', example: 'Matemática' },
            photoUrl: {
              type: 'string',
              example: 'https://example.com/photo.jpg'
            }
          }
        }
      }
    }
  },
  apis: ['src/controller/*.ts']
};
