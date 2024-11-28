import { Request, Response } from 'express';
import { LessonRequestService } from '../service/LessonRequestService';
import { handleError } from '../utils/ErrorHandler';
import { EnumSuccessMessages } from '../enum/EnumSuccessMessages';

export class LessonRequestController {
  /**
   * @swagger
   * /api/lessonrequest:
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
   *             $ref: '#/components/schemas/CreateLessonRequest'
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
   *         $ref: '#/components/responses/BadRequest'
   *       '401':
   *         $ref: '#/components/responses/Unauthorized'
   *       '500':
   *         $ref: '#/components/responses/InternalServerError'
   */
  async create(req: Request, res: Response) {
    try {
      const lessonRequest = await LessonRequestService.createLessonRequest(req.body);
      return res.status(201).json({
        message: EnumSuccessMessages.LESSON_REQUEST_CREATED,
        lessonRequest
      });
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ message });
    }
  }

  /**
   * @swagger
   * /api/lessonrequest:
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
   *         $ref: '#/components/responses/Unauthorized'
   *       '500':
   *         $ref: '#/components/responses/InternalServerError'
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
   * /api/lessonrequest/{id}:
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
   *         $ref: '#/components/responses/Unauthorized'
   *       '404':
   *         description: Lesson request not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/responses/NotFound'
   *       '500':
   *         $ref: '#/components/responses/InternalServerError'
   */
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const lessonRequest = await LessonRequestService.getLessonRequestById(Number(id));
      if (!lessonRequest) {
        return res.status(404).json({ message: 'Aula não encontrada.' });
      }
      return res.status(200).json(lessonRequest);
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ message });
    }
  }

  /**
   * @swagger
   * /api/lessonrequest-cancel:
   *   delete:
   *     summary: Cancel a tutor's lesson request relationship by classId and tutorId
   *     tags: [Lesson Request]
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - name: classId
   *         in: query
   *         required: true
   *         description: ID of the lesson request to cancel
   *         schema:
   *           type: integer
   *           example: 21
   *       - name: tutorId
   *         in: query
   *         required: true
   *         description: ID of the tutor whose lesson request is to be cancelled
   *         schema:
   *           type: integer
   *           example: 1
   *     responses:
   *       '200':
   *         description: Lesson request relationship canceled successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Aula cancelada com sucesso!"
   *       '400':
   *         $ref: '#/components/responses/BadRequest'
   *       '401':
   *         $ref: '#/components/responses/Unauthorized'
   *       '404':
   *         $ref: '#/components/responses/NotFound'
   *       '500':
   *         $ref: '#/components/responses/InternalServerError'
   */
  async cancelTutorLessonRequest(req: Request, res: Response) {
    try {
      const { classId, tutorId } = req.query;
      await LessonRequestService.cancelTutorLessonRequestById(Number(classId), Number(tutorId));
      return res.status(200).json({ message: EnumSuccessMessages.LESSON_REQUEST_CANCELED });
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ message });
    }
  }

  /**
   * @swagger
   * /api/lessonrequest/{lessonId}:
   *   patch:
   *     summary: Update lesson request by ID
   *     tags: [Lesson Request]
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - name: lessonId
   *         in: path
   *         required: true
   *         description: ID of the lesson request to update
   *         schema:
   *           type: integer
   *           example: 1
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateLessonRequest'
   *     responses:
   *       '200':
   *         description: Lesson request updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Aula atualizada com sucesso!"
   *       '400':
   *         $ref: '#/components/responses/BadRequest'
   *       '401':
   *         $ref: '#/components/responses/Unauthorized'
   *       '404':
   *         $ref: '#/components/responses/NotFound'
   *       '500':
   *         $ref: '#/components/responses/InternalServerError'
   */
  async updateLesson(req: Request, res: Response) {
    try {
      const { lessonId } = req.params;
      const { subjectId, reason, additionalInfo, preferredDates } = req.body;

      await LessonRequestService.updateLessonRequest(Number(lessonId), subjectId, reason, additionalInfo, preferredDates);

      return res.status(200).json({ message: EnumSuccessMessages.LESSON_REQUEST_UPDATED });
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ message });
    }
  }
}
