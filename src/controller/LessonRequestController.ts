import { Request, Response } from 'express';
import { LessonRequestService } from '../service/LessonRequestService';
import { handleError } from '../utils/ErrorHandler';
import { EnumSuccessMessages } from '../enum/EnumSuccessMessages';

export class LessonRequestController {
  /**
   * @swagger
   * /api/register/lessonrequest:
   *   post:
   *     summary: Create a new lesson request
   *     tags: [Lesson Request]
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LessonRequest'
   *     responses:
   *       '201':
   *         description: Lesson request created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Aula criada com sucesso!"
   *                 lessonRequest:
   *                   $ref: '#/components/schemas/LessonRequest'
   *       '400':
   *         $ref: '#/components/schemas/ErrorResponse'
   *       '401':
   *         $ref: '#/components/schemas/ErrorResponse'
   *       '404':
   *         $ref: '#/components/schemas/ErrorResponse'
   *       '500':
   *         $ref: '#/components/schemas/ErrorResponse'
   */
  async create(req: Request, res: Response) {
    try {
      const lessonRequest = await LessonRequestService.createLessonRequest(req.body);
      return res.status(201).json({
        message: EnumSuccessMessages.LESSON_REQUEST_CREATED,
        lessonRequest,
      });
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ message });
    }
  }

  /**
   * @swagger
   * /api/get/lessonrequest:
   *   get:
   *     summary: Retrieve all lesson requests
   *     tags: [Lesson Request]
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       '200':
   *         description: List of lesson requests retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/LessonRequest'
   *       '401':
   *         $ref: '#/components/schemas/ErrorResponse'
   *       '500':
   *         $ref: '#/components/schemas/ErrorResponse'
   */
  async getAll(req: Request, res: Response) {
    try {
      const lessonRequests = await LessonRequestService.getAllLessonRequests();
      return res.status(200).json(lessonRequests);
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ message });
    }
  }

  /**
   * @swagger
   * /api/get/lessonrequest/{id}:
   *   get:
   *     summary: Get lesson request by ID
   *     tags: [Lesson Request]
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: ID of the lesson request
   *         schema:
   *           type: integer
   *           example: 1
   *     responses:
   *       '200':
   *         description: Lesson request retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/LessonRequest'
   *       '401':
   *         $ref: '#/components/schemas/ErrorResponse'
   *       '404':
   *         $ref: '#/components/schemas/ErrorResponse'
   *       '500':
   *         $ref: '#/components/schemas/ErrorResponse'
   */
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const lesson = await LessonRequestService.getLessonRequestById(
        Number(id)
      );

      return res.status(200).json(lesson);
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ message });
    }
  }

  /**
   * @swagger
   * /api/delete/lessonrequest/{id}:
   *   delete:
   *     summary: Delete a lesson request by ID
   *     tags: [Lesson Request]
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: ID of the lesson request to delete
   *         schema:
   *           type: integer
   *           example: 1
   *     responses:
   *       '204':
   *         description: Lesson request deleted successfully
   *       '400':
   *         $ref: '#/components/schemas/ErrorResponse'
   *       '404':
   *         $ref: '#/components/schemas/ErrorResponse'
   *       '500':
   *         $ref: '#/components/schemas/ErrorResponse'
   */
  async deleteById(req: Request, res: Response) {
    const classId = Number(req.params.id);

    if (isNaN(classId) || classId <= 0) {
      return res.status(400).json({ message: 'Parâmetro inválido' });
    }

    try {
      await LessonRequestService.deleteLessonRequestById(classId);
      return res.status(204).end();
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ message });
    }
  }
}
