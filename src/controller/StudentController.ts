import { Request, Response } from 'express';
import { StudentService } from '../service/StudentService';
import { handleError } from '../utils/ErrorHandler';
import { EnumSuccessMessages } from '../enum/EnumSuccessMessages';
import { EnumStatusName } from '../enum/EnumStatusName';

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
