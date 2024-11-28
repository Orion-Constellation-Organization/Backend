import { Request, Response } from 'express';
import { StudentService } from '../service/StudentService';
import { handleError } from '../utils/ErrorHandler';
import { EnumSuccessMessages } from '../enum/EnumSuccessMessages';

export class StudentController {
  /**
   * @swagger
   * /api/register/student:
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
   * /api/get/student:
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
   * /api/get/student/{id}:
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
   *               $ref: '#/components/schemas/Student'
   *       '404':
   *         $ref: '#/components/schemas/ErrorResponse'
   *       '500':
   *         $ref: '#/components/schemas/ErrorResponse'
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
}
