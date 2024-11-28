import { LessonRequest } from '../entity/LessonRequest';
import { LessonRequestRepository } from '../repository/LessonRequestRepository';
import { EnumStatusName } from '../enum/EnumStatusName';
import { SubjectRepository } from '../repository/SubjectRepository';
import { StudentRepository } from '../repository/StudentRepository';
import { AppError } from '../error/AppError';
import { EnumErrorMessages } from '../enum/EnumErrorMessages';
import { StudentService } from './StudentService';
import { TutorService } from './TutorService';

export class LessonRequestService {
  static formatLessonRequest(lessonRequest: LessonRequest) {
    return {
      ClassId: lessonRequest.ClassId,
      reason: lessonRequest.reason,
      preferredDates: lessonRequest.preferredDates,
      status: lessonRequest.status,
      additionalInfo: lessonRequest.additionalInfo,
      subject: lessonRequest.subject,
      student: lessonRequest.student
        ? StudentService.formatStudent(lessonRequest.student)
        : null,
      tutor: lessonRequest.tutor
        ? TutorService.formatTutor(lessonRequest.tutor)
        : null,
      subjectId: lessonRequest.student ? lessonRequest.student.subjects : null
    };
  }

  static async createLessonRequest(lessonRequestData) {
    try {
      const { reason, preferredDates, subjectId, additionalInfo, studentId } =
        lessonRequestData;

      const lessonRequest = new LessonRequest();
      lessonRequest.reason = reason;
      lessonRequest.preferredDates = preferredDates;
      lessonRequest.additionalInfo = additionalInfo;
      lessonRequest.status = EnumStatusName.PENDENTE;

      const [foundSubject, foundStudent] = await Promise.all([
        SubjectRepository.findSubjectById(subjectId),
        StudentRepository.findStudentById(studentId)
      ]);

      if (!foundSubject) {
        throw new AppError(EnumErrorMessages.SUBJECT_NOT_FOUND, 404);
      }
      if (!foundStudent) {
        throw new AppError(EnumErrorMessages.STUDENT_NOT_FOUND, 404);
      }

      lessonRequest.subject = foundSubject;
      lessonRequest.student = foundStudent;

      return await LessonRequestRepository.saveLessonRequest(lessonRequest);
    } catch (error) {
      throw new AppError(EnumErrorMessages.INTERNAL_SERVER, 500);
    }
  }

  static async getLessonRequestById(id: number) {
    try {
      const lessonRequest = await LessonRequestRepository.getLessonRequestById(
        Number(id)
      );

      if (!lessonRequest) {
        throw new AppError(EnumErrorMessages.LESSON_REQUEST_NOT_FOUND, 404);
      }
      return LessonRequestService.formatLessonRequest(lessonRequest);
    } catch (error) {
      throw new AppError(EnumErrorMessages.INTERNAL_SERVER, 500);
    }
  }

  static async deleteLessonRequestById(classId: number) {
    try {
      const lessonRequest =
        await LessonRequestRepository.getLessonRequestById(classId);

      if (!lessonRequest) {
        throw new AppError(EnumErrorMessages.LESSON_REQUEST_NOT_FOUND, 404);
      }

      await LessonRequestRepository.deleteByClassId(classId);
    } catch (error) {
      throw new AppError(EnumErrorMessages.INTERNAL_SERVER, 500);
    }
  }

  static async getFilteredRequests(
    tutorId: number,
    page: number,
    size: number,
    order: string,
    orderBy: string
  ): Promise<LessonRequest[]> {
    const tutor = await TutorService.getTutorById(Number(tutorId));
    if (!tutor.subjects || tutor.subjects.length === 0) {
      throw new AppError(EnumErrorMessages.TUTOR_SUBJECT_NOT_FOUNT, 404);
    }
    const lessonRequests = await LessonRequestRepository.getFilteredRequests(
      tutor.subjects,
      tutor.educationLevels,
      page,
      size,
      order as 'ASC' | 'DESC',
      orderBy
    );
    return lessonRequests;
  }
}
