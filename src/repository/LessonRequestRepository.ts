import { EnumStatusName } from '../enum/EnumStatusName';
import { MysqlDataSource } from '../config/database';
import { LessonRequest } from '../entity/LessonRequest';
import { PaginationParams } from '../interface/PaginationParams';

export class LessonRequestRepository {
  static async saveLessonRequest(lessonRequest: LessonRequest): Promise<LessonRequest> {
    const repository = MysqlDataSource.getRepository(LessonRequest);
    return repository.save(lessonRequest);
  }

  static async findByPreferredDate(preferredDate: string, studentId: number): Promise<LessonRequest | null> {
    const repository = MysqlDataSource.getRepository(LessonRequest);
    return repository.findOne({
      where: { preferredDates: preferredDate, student: { id: studentId } }
    });
  }

  static async listLessonRequests(params: PaginationParams): Promise<LessonRequest[]> {
    const repository = MysqlDataSource.getRepository(LessonRequest);
    const skip = (params.page - 1) * params.size;

    return repository
      .createQueryBuilder('lessonRequest')
      .leftJoinAndSelect('lessonRequest.lessonRequestTutors', 'lessonRequestTutor')
      .leftJoinAndSelect('lessonRequestTutor.tutor', 'tutor')
      .leftJoinAndSelect('lessonRequest.subject', 'subject')
      .leftJoinAndSelect('lessonRequest.student', 'student')
      .orderBy(`lessonRequest.${params.orderBy}`, params.order)
      .skip(skip)
      .take(params.size)
      .getMany();
  }
  static async getLessonRequestById(id: number): Promise<LessonRequest | null> {
    return MysqlDataSource.getRepository(LessonRequest)
      .createQueryBuilder('lessonRequest')
      .leftJoinAndSelect('lessonRequest.lessonRequestTutors', 'lessonRequestTutor')
      .leftJoinAndSelect('lessonRequestTutor.tutor', 'tutor')
      .leftJoinAndSelect('lessonRequest.subject', 'subject')
      .leftJoinAndSelect('lessonRequest.student', 'student')
      .leftJoinAndSelect('tutor.subjects', 'subjects')
      .addSelect('tutor.email')
      .addSelect('student.email')
      .addSelect('tutor.fullName')
      .addSelect('student.fullName')
      .where('lessonRequest.classId = :id', { id })
      .getOne();
  }

  static async findByClassId(classId: number): Promise<LessonRequest[]> {
    const repository = MysqlDataSource.getRepository(LessonRequest);
    return repository.find({ where: { classId } });
  }

  static async deleteByClassId(classId: number): Promise<void> {
    const repository = MysqlDataSource.getRepository(LessonRequest);
    await repository.delete({ classId });
  }

  static async getFilteredRequests(tutorId: number, status: EnumStatusName, params: PaginationParams): Promise<LessonRequest[]> {
    const repository = await MysqlDataSource.getRepository(LessonRequest);
    const skip = (params.page - 1) * params.size;
    return repository
      .createQueryBuilder('lessonRequest')
      .leftJoinAndSelect('lessonRequest.lessonRequestTutors', 'lessonRequestTutor')
      .leftJoinAndSelect('lessonRequestTutor.tutor', 'tutor')
      .leftJoinAndSelect('lessonRequest.subject', 'subject')
      .leftJoinAndSelect('lessonRequest.student', 'student')
      .leftJoinAndSelect('student.educationLevel', 'educationLevel')
      .where('lessonRequest.status = :status', { status })
      .andWhere('educationLevel.educationId IN (SELECT educationLevelId FROM tutor_education_levels WHERE tutorId = :tutorId)', { tutorId })
      .andWhere('subject.subjectId IN (SELECT subjectId FROM tutor_subjects_subject WHERE tutorId = :tutorId)', { tutorId })
      .orderBy(`lessonRequest.${params.orderBy}`, params.order)
      .skip(skip)
      .take(params.size)
      .getMany();
  }

  static async saveMeetUrl(classId: number, hangoutLink: string): Promise<void> {
    const repository = MysqlDataSource.getRepository(LessonRequest);
    await repository.update({ classId }, { urlMeet: hangoutLink });
  }
}
