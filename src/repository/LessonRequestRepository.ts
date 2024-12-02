import { EnumStatusName } from '../enum/EnumStatusName';
import { MysqlDataSource } from '../config/database';
import { LessonRequest } from '../entity/LessonRequest';

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

  static async listLessonRequests(
    page: number,
    size: number,
    order: 'ASC' | 'DESC',
    orderBy: string,
    tutorId?: number
  ): Promise<LessonRequest[]> {
    const repository = MysqlDataSource.getRepository(LessonRequest);
    const skip = (page - 1) * size;

    const query = repository
      .createQueryBuilder('lessonRequest')
      .leftJoinAndSelect('lessonRequest.lessonRequestTutors', 'lessonRequestTutor')
      .leftJoinAndSelect('lessonRequestTutor.tutor', 'tutor')
      .leftJoinAndSelect('lessonRequest.subject', 'subject')
      .leftJoinAndSelect('lessonRequest.student', 'student');

    if (tutorId) {
      query.where(
        'lessonRequest.ClassId NOT IN (SELECT lessonRequestId FROM lesson_request_tutor WHERE tutorId = :tutorId AND status = :status)',
        { tutorId, status: 'RECUSADO' }
      );
    }

    query.orderBy(`lessonRequest.${orderBy}`, order).skip(skip).take(size);

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
      .where('lessonRequest.ClassId = :id', { id })
      .getOne();
  }

  static async findByClassId(ClassId: number): Promise<LessonRequest[]> {
    const repository = MysqlDataSource.getRepository(LessonRequest);
    return repository.find({ where: { ClassId } });
  }

  static async deleteByClassId(ClassId: number): Promise<void> {
    const repository = MysqlDataSource.getRepository(LessonRequest);
    await repository.delete({ ClassId });
  }

  static async getFilteredRequests(
    tutorId: number,
    page: number,
    size: number,
    order: 'ASC' | 'DESC',
    orderBy: string
  ): Promise<LessonRequest[]> {
    const repository = await MysqlDataSource.getRepository(LessonRequest);
    const skip = (page - 1) * size;

    const query = repository
      .createQueryBuilder('lessonRequest')
      .leftJoinAndSelect('lessonRequest.lessonRequestTutors', 'lessonRequestTutor')
      .leftJoinAndSelect('lessonRequest.subject', 'subject')
      .leftJoinAndSelect('lessonRequest.student', 'student')
      .leftJoinAndSelect('student.educationLevel', 'educationLevel')
      .leftJoinAndSelect('lessonRequestTutor.tutor', 'tutor')
      .where('lessonRequest.status = :status', { status: EnumStatusName.PENDENTE })
      .andWhere('educationLevel.educationId IN (SELECT educationLevelId FROM tutor_education_levels WHERE tutorId = :tutorId)', { tutorId })
      .andWhere('subject.subjectId IN (SELECT subjectId FROM tutor_subjects_subject WHERE tutorId = :tutorId)', { tutorId })
      .andWhere(
        `(lessonRequestTutor.tutorId IS NULL OR lessonRequestTutor.tutorId != :tutorId OR lessonRequestTutor.status != :enumRecusado)`,
        { tutorId, enumRecusado: EnumStatusName.RECUSADO }
      );

    query.orderBy(`lessonRequest.${orderBy}`, order).skip(skip).take(size);

    return query.getMany();
  }
}
