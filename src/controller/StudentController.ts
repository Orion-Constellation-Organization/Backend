import { StudentValidator } from './../validator/StudentValidator';
import { Request, Response } from 'express';
import { StudentService } from '../service/StudentService';
import { handleError } from '../utils/ErrorHandler';
import { EnumSuccessMessages } from '../enum/EnumSuccessMessages';
import { EnumStatusName } from '../enum/EnumStatusName';
import { HttpRoute } from '../decorators/HttpRoute';
import { authMiddleware } from '../middleware/AuthMiddleware';
import { sanitizePaginationParams } from '../validator/PaginationParamsValidator';
import { N8nService } from '../third-party/N8nService';

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
    path: '/api/student',
    method: 'post',
    middlewares: StudentValidator.createStudent()
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
   *     parameters:
   *       - name: page
   *         in: query
   *         required: true
   *         description: Page number for pagination
   *         schema:
   *           type: integer
   *           example: 1
   *       - name: size
   *         in: query
   *         required: true
   *         description: Number of items per page
   *         schema:
   *           type: integer
   *           example: 10
   *       - name: order
   *         in: query
   *         required: true
   *         description: Sorting order (ASC or DESC)
   *         schema:
   *           type: string
   *           example: ASC
   *       - name: orderBy
   *         in: query
   *         required: true
   *         description: Field to order the results by
   *         schema:
   *           type: string
   *           example: id
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
    path: '/api/student/',
    method: 'get',
    middlewares: [authMiddleware()]
  })
  async getAll(req: Request, res: Response) {
    try {
      const params = sanitizePaginationParams(req.query);
      const students = await StudentService.getAllStudents(params);
      return res.status(200).json(students);
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
   *       - name: page
   *         in: query
   *         required: true
   *         description: Page number for pagination
   *         schema:
   *           type: integer
   *           example: 1
   *       - name: size
   *         in: query
   *         required: true
   *         description: Number of items per page
   *         schema:
   *           type: integer
   *           example: 10
   *       - name: order
   *         in: query
   *         required: true
   *         description: Sorting order (ASC or DESC)
   *         schema:
   *           type: string
   *           example: ASC
   *       - name: orderBy
   *         in: query
   *         required: true
   *         description: Field to order the results by
   *         schema:
   *           type: string
   *           example: id
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
    path: '/api/student-lesson-status/',
    method: 'get',
    middlewares: [authMiddleware('student', true)]
  })
  async getStudentLessons(req: Request, res: Response) {
    try {
      const { id, status } = req.query;
      const params = sanitizePaginationParams(req.query);
      const lessons = await StudentService.getStudentLessonsByStatus(Number(id), status as EnumStatusName, params);
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
   *               lessonId:
   *                 type: integer
   *                 example: 10
   *               tutorId:
   *                 type: integer
   *                 example: 5
   *     responses:
   *       '200':
   *         description: Lesson confirmed
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: 'Aula confirmada com sucesso!'
   *                 lessonRequest:
   *                   $ref: '#/components/schemas/LessonRequest'
   *       '400':
   *         $ref: '#/components/responses/BadRequest'
   *       '401':
   *         $ref: '#/components/responses/Unauthorized'
   *       '404':
   *         $ref: '#/components/responses/NotFound'
   *       '500':
   *         $ref: '#/components/responses/InternalServerError'
   */
  @HttpRoute({
    path: '/api/student-confirm-lesson/',
    method: 'post',
    middlewares: [authMiddleware()]
  })
  async confirmLessonRequest(req: Request, res: Response) {
    try {
      const { lessonId, id } = req.body;

      const lessonRequest = await StudentService.confirmLessonRequest(lessonId, Number(id));
      await N8nService.triggerGoogleMeetWebhook(lessonRequest);
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
  @HttpRoute({
    path: '/api/student/:id',
    method: 'get',
    middlewares: [authMiddleware('student', true)]
  })
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
