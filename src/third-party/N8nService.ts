import axios from 'axios';
import { LessonRequest } from 'entity/LessonRequest';
import { LessonRequestRepository } from '../repository/LessonRequestRepository';

export class N8nService {
  static async triggerGoogleMeetWebhook(lessonRequest: LessonRequest) {
    try {
      const n8nResponse = await axios.post(process.env.N8N_MEET_URL, lessonRequest);
      if (n8nResponse.data.hangoutLink) {
        await LessonRequestRepository.saveMeetUrl(lessonRequest.classId, n8nResponse.data.hangoutLink);
      }
    } catch (error) {
      return null;
    }
  }
}
