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
   *     summary: Creation of a new student
   *     tags: [Student]
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Student'
   *     responses:
   *       '201':
   *         description: Student successfully created
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                   example: 123
   *                 token:
   *                   type: string
   *                   example: "JWT_TOKEN"
   *       '400':
   *         $ref: '#/components/schemas/ErrorResponse'
   *       '404':
   *         $ref: '#/components/schemas/ErrorResponse'
   *       '500':
   *         $ref: '#/components/schemas/ErrorResponse'
   */
  async create(req: Request, res: Response) {
    try {
      const { user: savedStudent, token } = await StudentService.createStudent(
        req.body
      );

      return res.status(201).json({
        message: EnumSuccessMessages.STUDENT_CREATED,
        id: savedStudent.id,
        token: token
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
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       '200':
   *         description: Successfully retrieved the list of students
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Student'
   *       '401':
   *         $ref: '#/components/schemas/ErrorResponse'
   *       '500':
   *         $ref: '#/components/schemas/ErrorResponse'
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
   *         description: Successfully retrieved the student by ID
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Student'
   *       '404':
   *         $ref: '#/components/schemas/ErrorResponse'
   *       '500':
   *         $ref: '#/components/schemas/ErrorResponse'
   */
  async confirmLessonRequest(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const student = await StudentService.getStudentById(Number(id));
      return res.status(200).json(student);
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
   *           enum:
   *             - pendente
   *             - aceito
   *             - confirmado
   *             - finalizado
   *             - cancelado
   *         description: Status name
   *         example: aceito
   *     responses:
   *       '200':
   *         description: List of pending lessons for the student
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   ClassId:
   *                     type: integer
   *                     example: 3
   *                   reason:
   *                     type: array
   *                     items:
   *                       type: string
   *                     example: ["reforço"]
   *                   preferredDates:
   *                     type: array
   *                     items:
   *                       type: string
   *                       format: date-time
   *                     example: ["2025-12-15 22:00", "2024-11-25 22:00"]
   *                   status:
   *                     type: string
   *                     example: "pendente"
   *                   additionalInfo:
   *                     type: string
   *                     example: "Looking for a tutor with experience in calculus."
   *                   subject:
   *                     type: object
   *                     properties:
   *                       subjectId:
   *                         type: integer
   *                         example: 1
   *                       subjectName:
   *                         type: string
   *                         example: "Biologia"
   *                   student:
   *                     type: object
   *                     nullable: true
   *                     example: null
   *                   tutors:
   *                     type: array
   *                     items:
   *                       type: object
   *                       example: []
   *       '400':
   *         description: Invalid request, status not valid
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "O status fornecido é inválido."
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
   *         description: Lessons not found for the provided status
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Aula não encontrada."
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
  async getStudentLessons(req: Request, res: Response) {
  /**
   * @swagger
   * /api/get/student/{id}/pending-lessons:
   *   get:
   *     summary: Get pending lessons for a student by ID
   *     tags: [Student]
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: ID of the student
   *         schema:
   *           type: integer
   *           example: 1
   *     responses:
   *       '200':
   *         description: List of pending lessons retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/LessonRequest'
   *       '404':
   *         $ref: '#/components/schemas/ErrorResponse'
   *       '500':
   *         $ref: '#/components/schemas/ErrorResponse'
   */
  async getPendingLessonByStudentId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const lessons = await StudentService.getPendingLessonByStudentId(
        Number(id)
      );
      return res.status(200).json(lessons);
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ message });
    }
  }

  /**
   * @swagger
   * /api/confirm-lesson-request:
   *   post:
   *     summary: Confirms a lesson request for a specific tutor
   *     tags: [Lesson Requests]
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
   *                 description: ID of the lesson request
   *                 example: 20
   *               tutorId:
   *                 type: integer
   *                 description: ID of the tutor confirming the lesson
   *                 example: 2
   *     responses:
   *       '200':
   *         description: Lesson request successfully confirmed
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Aula confirmada com sucesso!"
   *                 lessonRequest:
   *                   type: object
   *                   properties:
   *                     ClassId:
   *                       type: integer
   *                       example: 20
   *                     reason:
   *                       type: array
   *                       items:
   *                         type: string
   *                       example: ["reforço"]
   *                     preferredDates:
   *                       type: array
   *                       items:
   *                         type: string
   *                         format: date-time
   *                       example: ["2025-12-14 22:30"]
   *                     status:
   *                       type: string
   *                       example: "confirmado"
   *                     additionalInfo:
   *                       type: string
   *                       example: "Looking for a tutor with experience in calculus."
   *                     subject:
   *                       type: object
   *                       properties:
   *                         subjectId:
   *                           type: integer
   *                           example: 1
   *                         subjectName:
   *                           type: string
   *                           example: "Biologia"
   *                     student:
   *                       type: object
   *                       nullable: true
   *                       properties:
   *                         id:
   *                           type: integer
   *                           example: 1
   *                         username:
   *                           type: string
   *                           example: "alunoTESTE11"
   *                         lessonRequests:
   *                           type: array
   *                           items:
   *                             type: object
   *                           example: []
   *                     tutors:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           tutor:
   *                             type: object
   *                             properties:
   *                               id:
   *                                 type: integer
   *                                 example: 2
   *                               username:
   *                                 type: string
   *                                 example: "tutorTeste02"
   *                               expertise:
   *                                 type: string
   *                                 example: "Matemática"
   *                               projectReason:
   *                                 type: string
   *                                 example: "I love studying"
   *                               lessonRequestTutors:
   *                                 type: array
   *                                 items:
   *                                   type: object
   *                                 example: []
   *                               subjects:
   *                                 type: array
   *                                 items:
   *                                   type: object
   *                                   properties:
   *                                     id:
   *                                       type: integer
   *                                       example: 2
   *                                     name:
   *                                       type: string
   *                                       example: "Sociologia"
   *                           chosenDate:
   *                             type: string
   *                             format: date-time
   *                             example: "2025-12-14 22:30"
   *       '400':
   *         description: Invalid request due to incorrect data or status
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "A aula já foi confirmada, não é possível confirmar novamente."
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
   *         description: Lesson request or tutor not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Aula não encontrada."
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
  async confirmLessonRequest(req: Request, res: Response) {
    try {
      const { lessonId, tutorId } = req.body;

      const lessonRequest = await StudentService.confirmLessonRequest(
        lessonId,
        tutorId
      );

      return res.status(200).json({
        message: EnumSuccessMessages.LESSON_REQUEST_CONFIRMED,
        lessonRequest
      });
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ message });
    }
  }
}
