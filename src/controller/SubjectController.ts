import { Request, Response } from 'express';
import { SubjectService } from '../service/SubjectService';
import { handleError } from '../utils/ErrorHandler';
import { EnumSuccessMessages } from '../enum/EnumSuccessMessages';
import { HttpRoute, NoAuthRoute } from '../decorators/HttpRoute';
import { authMiddleware } from '../middleware/AuthMiddleware';

export class SubjectController {
  /**
   * @swagger
   * /api/subject:
   *   post:
   *     summary: Create a new subject
   *     tags: [Subject]
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               subjectName:
   *                 type: string
   *                 description: Name of the subject
   *                 example: "Matemática"
   *     responses:
   *       '201':
   *         description: Subject created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Matéria criada com sucesso!"
   *       '400':
   *         description: Subject name is required
   *       '401':
   *         description: Unauthorized, missing or invalid token
   *       '500':
   *         description: Internal server error
   */
  @HttpRoute({
    path: '/api/register/subject/protected',
    method: 'post',
    middlewares: [authMiddleware()]
  })
  async create(req: Request, res: Response) {
    try {
      const { subjectName } = req.body;
      await SubjectService.createSubject(subjectName);
      return res.status(201).json({ message: EnumSuccessMessages.SUBJECT_CREATED });
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ message });
    }
  }

  /**
   * @swagger
   * /api/subject:
   *   get:
   *     summary: Get all subjects
   *     tags: [Subject]
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       '200':
   *         description: List of subjects retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   subjectId:
   *                     type: integer
   *                     example: 1
   *                   subjectName:
   *                     type: string
   *                     example: "Matemática"
   *       '401':
   *         description: Unauthorized, missing or invalid token
   *       '500':
   *         description: Internal server error
   */
  @NoAuthRoute({ path: '/api/get/subject/public', method: 'get' })
  async getAll(req: Request, res: Response) {
    try {
      const subjects = await SubjectService.getAllSubjects();
      return res.status(200).json(subjects);
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ message });
    }
  }
}
