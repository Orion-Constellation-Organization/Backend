import { Request, Response } from 'express';
import { TutorService } from '../service/TutorService';
import { handleError } from '../utils/ErrorHandler';
import { EnumSuccessMessages } from '../enum/EnumSuccessMessages';

export class TutorController {
  /**
   * @swagger
   * /api/tutor:
   *   post:
   *     summary: Creation of a new tutor
   *     tags: [Tutor]
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Tutor'
   *     responses:
   *       '201':
   *         description: Tutor successfully created
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/TutorResponse'
   *       '400':
   *         $ref: '#/components/schemas/ErrorResponse'
   *       '404':
   *         $ref: '#/components/schemas/ErrorResponse'
   *       '500':
   *         $ref: '#/components/schemas/ErrorResponse'
   */
  async create(req: Request, res: Response) {
    try {
      const { user: savedTutor, token } = await TutorService.createTutor(req.body);

      return res.status(201).json({
        message: EnumSuccessMessages.TUTOR_CREATED,
        tutorId: savedTutor.id,
        token: token
      });
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ message });
    }
  }

  /**
   * @swagger
   * /api/tutor:
   *   get:
   *     summary: Get all tutors
   *     tags: [Tutor]
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       '200':
   *         description: List of tutors retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/TutorResponse'
   *       '401':
   *         $ref: '#/components/schemas/ErrorResponse'
   *       '500':
   *         $ref: '#/components/schemas/ErrorResponse'
   */
  async getAll(req: Request, res: Response) {
    try {
      const tutors = await TutorService.getAllTutors();
      return res.status(200).json(tutors);
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ message });
    }
  }

  /**
   * @swagger
   * /api/tutor:
   *   patch:
   *     summary: Update tutor personal data
   *     tags: [Tutor]
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/TutorUpdate'
   *     responses:
   *       '200':
   *         description: Tutor updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SuccessResponse'
   *       '401':
   *         $ref: '#/components/schemas/ErrorResponse'
   *       '404':
   *         $ref: '#/components/schemas/ErrorResponse'
   *       '500':
   *         $ref: '#/components/schemas/ErrorResponse'
   */
  async updatePersonalData(req: Request, res: Response) {
    try {
      const { id, expertise, projectReason, subject: subjectIds } = req.body;

      const tutor = await TutorService.getTutorById(id);

      await TutorService.updateTutorPersonalData(tutor, expertise, projectReason, subjectIds);

      return res.status(200).json({ message: EnumSuccessMessages.TUTOR_UPDATED });
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ message });
    }
  }

  /**
   * @swagger
   * /api/update/photo:
   *   patch:
   *     summary: Update tutor photo
   *     tags: [Tutor]
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               id:
   *                 type: integer
   *                 description: ID of the tutor
   *                 example: 1
   *               photo:
   *                 type: string
   *                 format: binary
   *                 description: Photo file to upload
   *     responses:
   *       '200':
   *         description: Photo updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Photo updated successfully."
   *       '400':
   *         $ref: '#/components/schemas/ErrorResponse'
   *       '401':
   *         $ref: '#/components/schemas/ErrorResponse'
   *       '404':
   *         $ref: '#/components/schemas/ErrorResponse'
   *       '500':
   *         $ref: '#/components/schemas/ErrorResponse'
   */
  async updatePhoto(req: Request, res: Response) {
    try {
      const { id } = req.body;
      const file = req.file; // Arquivo enviado pelo multer
      if (!file) {
        return res.status(400).json({ message: 'Photo file is required.' });
      }

      const tutor = await TutorService.getTutorById(id);
      if (!tutor) {
        return res.status(404).json({ message: 'Tutor not found.' });
      }

      const updatedTutor = await TutorService.updateTutorPhoto(tutor, file.path);

      return res.status(200).json({
        message: EnumSuccessMessages.PHOTO_UPDATED,
        tutor: updatedTutor
      });
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ message });
    }
  }

  /**
   * @swagger
   * /api/tutor/{id}:
   *   get:
   *     summary: Get tutor by ID
   *     tags: [Tutor]
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: ID of the tutor
   *         schema:
   *           type: integer
   *           example: 1
   *     responses:
   *       '200':
   *         description: Tutor data retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/TutorResponse'
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
      const tutor = await TutorService.getTutorById(Number(id));
      return res.status(200).json(tutor);
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ message });
    }
  }

  /**
   * @swagger
   * /api/lesson-request/accept:
   *   patch:
   *     summary: Accept a lesson request
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
   *                 example: 1
   *               tutorId:
   *                 type: integer
   *                 description: ID of the tutor accepting the lesson request
   *                 example: 2
   *               chosenDate:
   *                 type: string
   *                 format: date-time
   *                 description: The date chosen for the lesson
   *                 example: "2025-06-07T22:45"
   *     responses:
   *       '200':
   *         description: Lesson request accepted successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/TutorResponse'
   *       '401':
   *         $ref: '#/components/schemas/ErrorResponse'
   *       '404':
   *         $ref: '#/components/schemas/ErrorResponse'
   *       '500':
   *         $ref: '#/components/schemas/ErrorResponse'
   */
  async acceptLessonRequest(req: Request, res: Response) {
    try {
      const { lessonId, tutorId, chosenDate } = req.body;

      await TutorService.acceptLessonRequest(lessonId, tutorId, chosenDate);

      return res.status(200).json({ message: EnumSuccessMessages.LESSON_REQUEST_ACCEPTED });
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ message });
    }
  }

  /**
   * @swagger
   * /api/lesson-request/accept:
   *   patch:
   *     summary: Accept a lesson request
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
   *                 example: 1
   *               tutorId:
   *                 type: integer
   *                 description: ID of the tutor accepting the lesson request
   *                 example: 2
   *               chosenDate:
   *                 type: string
   *                 format: date-time
   *                 description: The date chosen for the lesson
   *                 example: "2025-06-07T22:45"
   *     responses:
   *       '200':
   *         description: Lesson request accepted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Aula aceita com sucesso!"
   *       '400':
   *         description: Bad request due to invalid data or conditions
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   enum:
   *                     - "O status do pedido de aula deve estar como pendente ou como aceito."
   *                     - "O tutor já está na lista de tutores do pedido de aula."
   *                     - "Data inválida. Verifique se a data existe."
   *       '401':
   *         description: Unauthorized access, missing or invalid token
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   enum:
   *                     - "Token inválido."
   *                     - "Acesso negado. Token não fornecido."
   *       '404':
   *         description: Lesson request or tutor not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   enum:
   *                     - "Aula não encontrada."
   *                     - "Tutor não encontrado."
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
  async acceptLessonRequest(req: Request, res: Response) {
    try {
      const { lessonId, tutorId, chosenDate } = req.body;

      await TutorService.acceptLessonRequest(lessonId, tutorId, chosenDate);

      return res.status(200).json({ message: EnumSuccessMessages.LESSON_REQUEST_ACCEPTED });
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ message });
    }
  }
}
