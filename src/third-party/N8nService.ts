import axios from 'axios';
import { LessonRequest } from 'entity/LessonRequest';
import { AppError } from '../error/AppError';
import { handleError } from '../utils/ErrorHandler';
import { LessonRequestRepository } from '../repository/LessonRequestRepository';

export class N8nService {
  static async triggerGoogleMeetWebhook(lessonRequest: LessonRequest) {
    try {
      const n8nResponse = await axios.post(`http://n8n:5678/webhook/google-meet`, lessonRequest);
      if (n8nResponse.data.hangoutLink) {
        await LessonRequestRepository.saveMeetUrl(lessonRequest.classId, n8nResponse.data.hangoutLink);
      }
      return n8nResponse.data;
    } catch (error) {
      const { statusCode, message } = handleError(error);
      throw new AppError(message, statusCode);
    }
  }
}
