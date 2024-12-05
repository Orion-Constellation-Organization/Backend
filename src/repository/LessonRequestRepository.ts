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

    const query = repository
      .createQueryBuilder('lessonRequest')
      .leftJoinAndSelect('lessonRequest.lessonRequestTutors', 'lessonRequestTutor')
      .leftJoinAndSelect('lessonRequestTutor.tutor', 'tutor')
      .leftJoinAndSelect('lessonRequest.subject', 'subject')
      .leftJoinAndSelect('lessonRequest.student', 'student');

    query.orderBy(`lessonRequest.${params.orderBy}`, params.order).skip(skip).take(params.size);

    return query.getMany();
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

  static async getFilteredRequests(tutorId: number | null, status: EnumStatusName, params: PaginationParams): Promise<LessonRequest[]> {
    const repository = MysqlDataSource.getRepository(LessonRequest);
    const skip = (params.page - 1) * params.size;

    const query = repository
      .createQueryBuilder('lessonRequest')
      .leftJoinAndSelect('lessonRequest.lessonRequestTutors', 'lessonRequestTutor')
      .leftJoinAndSelect('lessonRequest.subject', 'subject')
      .leftJoinAndSelect('lessonRequest.student', 'student')
      .leftJoinAndSelect('student.educationLevel', 'educationLevel')
      .leftJoinAndSelect('lessonRequestTutor.tutor', 'tutor');

    if (status === 'pendente') {
      query.where('lessonRequest.status = :status', { status: 'pendente' }).andWhere(
        `(lessonRequest.classId NOT IN (
            SELECT lrt.lessonRequestId 
            FROM lesson_request_tutor lrt 
            WHERE lrt.tutorId = :tutorId AND lrt.status = :refusedStatus
          ))`,
        { tutorId, refusedStatus: 'recusado' }
      );
    } else {
      query.where('lessonRequest.status = :status', { status }).andWhere(
        `(lessonRequest.classId NOT IN (
            SELECT lrt.lessonRequestId 
            FROM lesson_request_tutor lrt 
            WHERE lrt.tutorId = :tutorId AND lrt.status = :refusedStatus
          ))`,
        { tutorId, refusedStatus: 'recusado' }
      );
    }

    return query.orderBy(`lessonRequest.${params.orderBy}`, params.order).skip(skip).take(params.size).getMany();
  }

  static async saveMeetUrl(classId: number, hangoutLink: string): Promise<void> {
    const repository = MysqlDataSource.getRepository(LessonRequest);
    await repository.update({ classId }, { urlMeet: hangoutLink });
  }
}
