import { Request, Response } from 'express';
import { LessonRequestController } from '../../controller/LessonRequestController';
import { LessonRequestService } from '../../service/LessonRequestService';

jest.mock('../../service/LessonRequestService');

describe('LessonRequestController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let controller: LessonRequestController;

  beforeEach(() => {
    req = { params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      end: jest.fn()
    };
    controller = new LessonRequestController();
    jest.clearAllMocks();
  });

  describe('cancelTutorLessonRequest', () => {
    it('deve retornar 400 se os parâmetros classId ou tutorId forem inválidos', async () => {
      req.query = { classId: 'invalid', tutorId: 'invalid' };

      await controller.cancelTutorLessonRequest(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Parâmetro inválido' });
    });

    it('deve retornar 200 se o cancelamento for bem-sucedido', async () => {
      req.query = { classId: '1', tutorId: '2' };

      jest.spyOn(LessonRequestService, 'cancelTutorLessonRequestById').mockResolvedValueOnce();

      await controller.cancelTutorLessonRequest(req as Request, res as Response);

      expect(LessonRequestService.cancelTutorLessonRequestById).toHaveBeenCalledWith(1, 2);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Aula cancelada com sucesso!'
      });
    });

    it('deve retornar 500 se ocorrer um erro durante o cancelamento', async () => {
      req.query = { classId: '1', tutorId: '2' };

      jest.spyOn(LessonRequestService, 'cancelTutorLessonRequestById').mockRejectedValueOnce(new Error('Erro interno do servidor'));

      await controller.cancelTutorLessonRequest(req as Request, res as Response);

      expect(LessonRequestService.cancelTutorLessonRequestById).toHaveBeenCalledWith(1, 2);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Erro interno do servidor.'
      });
    });
  });
});
