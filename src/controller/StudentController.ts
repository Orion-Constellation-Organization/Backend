import { StudentValidator } from './../validator/StudentValidator';
import { Request, Response } from 'express';
import { StudentService } from '../service/StudentService';
import { handleError } from '../utils/ErrorHandler';
import { EnumSuccessMessages } from '../enum/EnumSuccessMessages';
import { EnumStatusName } from '../enum/EnumStatusName';
import { HttpRoute } from '../decorators/HttpRoute';
import { authMiddleware } from '../middleware/AuthMiddleware';

export class StudentController {
  /**
   * @swagger
   * /api/student:
   *   post:
   *     summary: Create a new student
   *     tags: [Student]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               fullName: { type: 'string', example: 'Nome do Estudante' }
   *               username: { type: 'string', example: 'nome_estudante' }
   *               birthDate: { type: 'string', example: '2000-01-01' }
   *               email: { type: 'string', example: 'email@exemplo.com' }
   *               educationLevelId: { type: 'array', items: { type: 'integer' }, example: [1] }
   *               password: { type: 'string', example: 'senha@123' }
   *               confirmPassword: { type: 'string', example: 'senha@123' }
   *     responses:
   *       '201':
   *         description: Student created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id: { type: 'integer', example: 1 }
   *                 token: { type: 'string', example: 'jwt_token_aqui' }
   *       '400': { $ref: '#/components/responses/BadRequest' }
   *       '401': { $ref: '#/components/responses/Unauthorized' }
   *       '500': { $ref: '#/components/responses/InternalServerError' }
   */
  @HttpRoute({
    path: '/api/register/student',
    method: 'post',
    middlewares: [...StudentValidator.createStudent()]
  })
  async create(req: Request, res: Response) {
    try {
      const { user: savedStudent, token } = await StudentService.createStudent(req.body);

      return res.status(201).json({
        message: EnumSuccessMessages.STUDENT_CREATED,
        id: savedStudent.id,
        token
      });
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ message });
    }
  }

  /**
   * @swagger
   * /api/student:
   *   get:
   *     summary: Retrieve a list of all students
   *     tags: [Student]
   *     responses:
   *       '200':
   *         description: List of students
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Student'
   *       '401': { $ref: '#/components/responses/Unauthorized' }
   *       '500': { $ref: '#/components/responses/InternalServerError' }
   */
  @HttpRoute({
    path: '/api/student',
    method: 'get',
    middlewares: [authMiddleware()]
  })
  async getAll(req: Request, res: Response) {
    try {
      const students = await StudentService.getAllStudents();
      return res.status(200).json(students);
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ message });
    }
  }

  /**
   * @swagger
   * /api/student/{id}:
   *   get:
   *     summary: Retrieve a student by ID
   *     tags: [Student]
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: ID of the student to retrieve
   *         schema:
   *           type: integer
   *           example: 1
   *     responses:
   *       '200':
   *         description: Successfully retrieved the student by ID
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                   example: 1
   *                 username:
   *                   type: string
   *                   example: "alunoTESTE11"
   *                 birthDate:
   *                   type: string
   *                   format: date
   *                   example: "2024-11-09"
   *                 educationLevel:
   *                   type: object
   *                   properties:
   *                     educationId:
   *                       type: integer
   *                       example: 1
   *                     levelType:
   *                       type: string
   *                       example: "Fundamental"
   *                 lessonRequests:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       ClassId:
   *                         type: integer
   *                         example: 1
   *                       reason:
   *                         type: array
   *                         items:
   *                           type: string
   *                           example: "reforço"
   *                       preferredDates:
   *                         type: array
   *                         items:
   *                           type: string
   *                           format: date-time
   *                           example: "2025-12-15T22:00"
   *                       status:
   *                         type: string
   *                         example: "pendente"
   *                       additionalInfo:
   *                         type: string
   *                         example: "Looking for a tutor with experience in calculus."
   *                       subject:
   *                         type: object
   *                         properties:
   *                           subjectId:
   *                             type: integer
   *                             example: 1
   *                           subjectName:
   *                             type: string
   *                             example: "Biologia"
   *                       lessonRequestTutors:
   *                         type: array
   *                         items:
   *                           type: object
   *                           properties:
   *                             id:
   *                               type: integer
   *                               example: 2
   *                             chosenDate:
   *                               type: string
   *                               format: date-time
   *                               example: "2025-12-15T22:00"
   *                             status:
   *                               type: string
   *                               example: "confirmado"
   *                             tutor:
   *                               type: object
   *                               nullable: true
   *                               properties:
   *                                 id:
   *                                   type: integer
   *                                   example: 2
   *                                 username:
   *                                   type: string
   *                                   example: "tutorTeste02"
   *                                 expertise:
   *                                   type: string
   *                                   example: "Matemática"
   *                                 projectReason:
   *                                   type: string
   *                                   example: "I love studying"
   *                                 subjects:
   *                                   type: array
   *                                   items:
   *                                     type: object
   *                                     properties:
   *                                       subjectId:
   *                                         type: integer
   *                                         example: 2
   *                                       subjectName:
   *                                         type: string
   *                                         example: "Sociologia"
   *       '401':
   *         description: Unauthorized, missing or invalid token
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Token inválido."
   *       '404':
   *         description: Student not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Estudante não encontrado."
   *       '500':
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Erro interno do servidor."
   */
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const student = await StudentService.getStudentById(Number(id));

      const formattedStudent = {
        id: student.id,
        username: student.username,
        fullName: student.fullName,
        birthDate: student.birthDate,
        educationLevel: student.educationLevel,
        lessonRequests: student.lessonRequests
      };

      return res.status(200).json(formattedStudent);
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ message });
    }
  }

  /**
   * @swagger
   * /api/student-lesson-status:
   *   get:
   *     summary: Retrieve pending lessons for a student
   *     tags: [Student Lessons]
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: query
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID of the student
   *         example: 1
   *       - in: query
   *         name: status
   *         required: true
   *         schema:
   *           type: string
   *           enum: [pendente, aceito, confirmado, finalizado, cancelado]
   *         description: Lesson status
   *         example: pendente
   *     responses:
   *       '200':
   *         description: List of lessons
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/LessonRequest'
   *       '400': { $ref: '#/components/responses/BadRequest' }
   *       '401': { $ref: '#/components/responses/Unauthorized' }
   *       '404': { $ref: '#/components/responses/NotFound' }
   *       '500': { $ref: '#/components/responses/InternalServerError' }
   */
  @HttpRoute({
    path: '/api/student-lesson-status',
    method: 'get',
    middlewares: [authMiddleware()]
  })
  async getStudentLessons(req: Request, res: Response) {
    try {
      const { id, status } = req.query;
      const lessons = await StudentService.getStudentLessonsByStatus(Number(id), status as EnumStatusName);
      return res.status(200).json(lessons);
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ message });
    }
  }

  /**
   * @swagger
   * /api/student-confirm-lesson:
   *   patch:
   *     summary: Confirms a lesson request for a specific tutor
   *     tags: [Student Lessons]
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               lessonId: { type: 'integer', example: 10 }
   *               tutorId: { type: 'integer', example: 5 }
   *     responses:
   *       '200':
   *         description: Lesson confirmed
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message: { type: 'string', example: 'Aula confirmada com sucesso!' }
   *                 lessonRequest: { $ref: '#/components/schemas/LessonRequest' }
   *       '400': { $ref: '#/components/responses/BadRequest' }
   *       '401': { $ref: '#/components/responses/Unauthorized' }
   *       '404': { $ref: '#/components/responses/NotFound' }
   *       '500': { $ref: '#/components/responses/InternalServerError' }
   */
  @HttpRoute({
    path: '/api/confirm-lesson-request',
    method: 'post',
    middlewares: [authMiddleware()]
  })
  async confirmLessonRequest(req: Request, res: Response) {
    try {
      const { lessonId, tutorId } = req.body;

      const lessonRequest = await StudentService.confirmLessonRequest(lessonId, tutorId);

      return res.status(200).json({
        message: 'Aula confirmada com sucesso!',
        lessonRequest
      });
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ message });
    }
  }

  /**
   * @swagger
   * /api/student/{id}:
   *   get:
   *     summary: Retrieve a student by ID
   *     tags: [Student]
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: integer
   *           example: 1
   *     responses:
   *       '200':
   *         description: Student retrieved
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Student'
   *       '401': { $ref: '#/components/responses/Unauthorized' }
   *       '404': { $ref: '#/components/responses/NotFound' }
   *       '500': { $ref: '#/components/responses/InternalServerError' }
   */
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const student = await StudentService.getStudentById(Number(id));
      return res.status(200).json(student);
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ message });
    }
  }
}
