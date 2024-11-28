import { EnumStatusName } from '../enum/EnumStatusName';
import { MysqlDataSource } from '../config/database';
import { LessonRequest } from '../entity/LessonRequest';
import { Subject } from '../entity/Subject';
import { EducationLevel } from '../entity/EducationLevel';
import { In } from 'typeorm';

export class LessonRequestRepository {
  private static relations = ['subject', 'student', 'tutor'];

  static async saveLessonRequest(
    lessonRequest: LessonRequest
  ): Promise<LessonRequest> {
    const repository = MysqlDataSource.getRepository(LessonRequest);
    return repository.save(lessonRequest);
  }

  static async findByPreferredDate(
    preferredDate: string,
    studentId: number
  ): Promise<LessonRequest | null> {
    const repository = MysqlDataSource.getRepository(LessonRequest);
    return repository.findOne({
      where: { preferredDates: preferredDate, student: { id: studentId } }
    });
  }

  static async listLessonRequests(
    page: number,
    size: number,
    order: 'ASC' | 'DESC',
    orderBy: string
  ): Promise<LessonRequest[]> {
    const repository = MysqlDataSource.getRepository(LessonRequest);
    const skip = (page - 1) * size;
    return repository.find({
      relations: this.relations,
      take: size,
      skip: skip,
      order: {
        [orderBy]: order
      }
    });
  }

  static async getLessonRequestById(id: number): Promise<LessonRequest | null> {
    return MysqlDataSource.getRepository(LessonRequest).findOne({
      where: { ClassId: id },
      relations: this.relations
    });
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
    tutorSubjects: Subject[],
    tutorEducationLevels: EducationLevel[],
    page: number,
    size: number,
    order: 'ASC' | 'DESC',
    orderBy: string
  ): Promise<LessonRequest[]> {
    const repository = MysqlDataSource.getRepository(LessonRequest);

    const skip = (page - 1) * size;

    return repository.find({
      where: {
        subject: In(tutorSubjects.map((subject) => subject.subjectId)),
        status: EnumStatusName.PENDENTE,
        student: {
          educationLevel: In(
            tutorEducationLevels.map((level) => level.educationId)
          )
        }
      },
      relations: ['student', 'subject'],
      take: size,
      skip: skip,
      order: {
        [orderBy]: order
      }
    });
  }
}
