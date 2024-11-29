import { EnumStatusName } from '../enum/EnumStatusName';
import { MysqlDataSource } from '../config/database';
import { LessonRequest } from '../entity/LessonRequest';
import { Subject } from '../entity/Subject';
import { EducationLevel } from '../entity/EducationLevel';
import { In } from 'typeorm';

export class LessonRequestRepository {
  private static relations = ['subject', 'student', 'tutor'];

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

  static async listLessonRequests(page: number, size: number, order: 'ASC' | 'DESC', orderBy: string): Promise<LessonRequest[]> {
    const repository = MysqlDataSource.getRepository(LessonRequest);
    const skip = (page - 1) * size;

    return repository
      .createQueryBuilder('lessonRequest')
      .leftJoinAndSelect('lessonRequest.lessonRequestTutors', 'lessonRequestTutor')
      .leftJoinAndSelect('lessonRequestTutor.tutor', 'tutor')
      .leftJoinAndSelect('lessonRequest.subject', 'subject')
      .leftJoinAndSelect('lessonRequest.student', 'student')
      .orderBy(`lessonRequest.${orderBy}`, order)
      .skip(skip)
      .take(size)
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
    const repository = MysqlDataSource.getRepository(LessonRequest);
    const skip = (page - 1) * size;

    return repository
      .createQueryBuilder('lessonRequest')
      .leftJoinAndSelect('lessonRequest.lessonRequestTutors', 'lessonRequestTutor')
      .leftJoinAndSelect('lessonRequestTutor.tutor', 'tutor')
      .innerJoinAndSelect('lessonRequest.subject', 'subject')
      .innerJoinAndSelect('lessonRequest.student', 'student')
      .innerJoinAndSelect('student.educationLevel', 'studentEducationLevel')
      .innerJoin(
        'tutor_education_levels',
        'tutorEducationLevels',
        'tutorEducationLevels.educationLevelId = studentEducationLevel.educationId'
      )
      .where('lessonRequest.status = :status', { status: 'pendente' })
      .andWhere('tutorEducationLevels.tutorId = :tutorId', { tutorId })
      .andWhere('subject.subjectId IN (SELECT ts.subjectId FROM tutor_subjects ts WHERE ts.tutorId = :tutorId)', { tutorId })
      .orderBy(`lessonRequest.${orderBy}`, order)
      .skip(skip)
      .take(size)
      .getMany();
  }
}
