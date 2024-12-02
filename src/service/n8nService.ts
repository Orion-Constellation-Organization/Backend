import axios from 'axios';
import { LessonRequest } from 'entity/LessonRequest';
import { AppError } from '../error/AppError';
import { handleError } from '../utils/ErrorHandler';

export class N8nService {
  static async triggerGoogleMeetWebhook(lessonRequest: LessonRequest) {
    try {
      const n8nResponse = await axios.post(`${process.env.N8N_MEET_URL}`, lessonRequest);
      // Do que exatamente eu preciso em LessonRequest para enviar para o n8n?
      return n8nResponse.data;
    } catch (error) {
      const { statusCode, message } = handleError(error);
      throw new AppError(message, statusCode);
    }
  }
}
