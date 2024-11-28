import { Request, Response } from 'express';
import { AuthService } from '../service/AuthService';
import { handleError } from '../utils/ErrorHandler';
import { EnumSuccessMessages } from '../enum/EnumSuccessMessages';

export class AuthController {
  /**
   * @swagger
   * /api/login:
   *   post:
   *     summary: Login for Tutor or Student
   *     tags: [Auth]
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 example: "usuario_tutor@exemplo.com"
   *               password:
   *                 type: string
   *                 example: "senhA@123"
   *               role:
   *                 type: string
   *                 enum: [tutor, student]
   *                 example: "tutor"
   *     responses:
   *       '200':
   *         description: Login successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Login realizado com sucesso!"
   *                 userId:
   *                   type: integer
   *                   example: 1
   *                 token:
   *                   type: string
   *                   description: JWT token
   *       '400':
   *         $ref: '#/components/schemas/ErrorResponse'
   */
  public login = async (req: Request, res: Response): Promise<Response> => {
    const { email, password, role } = req.body;

    try {
      const { userId, token } = await AuthService.login(email, password, role);

      return res.status(200).json({
        message: EnumSuccessMessages.LOGIN_SUCCESS,
        userId,
        token
      });
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ message });
    }
  };
}
