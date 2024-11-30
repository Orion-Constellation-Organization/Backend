import { Request, Response } from 'express';
import { EducationLevelService } from '../service/EducationLevelService';
import { handleError } from '../utils/ErrorHandler';
import { EnumSuccessMessages } from '../enum/EnumSuccessMessages';

export class EducationLevelController {
  /**
   * @swagger
   * /api/educationlevel:
   *   post:
   *     summary: Create a new education level
   *     tags: [Education Level]
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               levelType:
   *                 $ref: '#/components/schemas/EducationLevel/properties/levelType'
   *     responses:
   *       '201':
   *         description: Education level created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 educationLevel:
   *                   $ref: '#/components/schemas/EducationLevel'
   *                 message:
   *                   type: string
   *                   example: "Nível de ensino criado com sucesso!"
   *       '400':
   *         $ref: '#/components/responses/BadRequest'
   *       '401':
   *         $ref: '#/components/responses/Unauthorized'
   *       '500':
   *         $ref: '#/components/responses/InternalServerError'
   */
  async create(req: Request, res: Response) {
    const { levelType } = req.body;

    try {
      const educationLevel = await EducationLevelService.createEducationLevel(levelType);
      return res.status(201).json({
        educationLevel,
        message: EnumSuccessMessages.EDUCATION_LEVEL_CREATED
      });
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ message });
    }
  }

  /**
   * @swagger
   * /api/educationlevel:
   *   get:
   *     summary: Get all education levels
   *     tags: [Education Level]
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       '200':
   *         description: List of education levels retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/EducationLevelList'
   *       '401':
   *         $ref: '#/components/responses/Unauthorized'
   *       '500':
   *         $ref: '#/components/responses/InternalServerError'
   */
  async getAll(req: Request, res: Response) {
    try {
      const educationLevels = await EducationLevelService.getAllEducationLevels();
      return res.status(200).json(educationLevels);
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ message });
    }
  }
}
