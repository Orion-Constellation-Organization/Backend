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
    return await repository.save(lessonRequest);
  }

  static async findByPreferredDate(
    preferredDate: string,
    studentId: number
  ): Promise<LessonRequest | null> {
    const repository = MysqlDataSource.getRepository(LessonRequest);
    return await repository.findOne({
      where: { preferredDates: preferredDate, student: { id: studentId } }
    });
  }

  static async getAllLessonRequests(): Promise<LessonRequest[]> {
    const repository = MysqlDataSource.getRepository(LessonRequest);
    return await repository.find({
      relations: this.relations
    });
  }

  static async getLessonRequestById(id: number): Promise<LessonRequest | null> {
    return await MysqlDataSource.getRepository(LessonRequest).findOne({
      where: { ClassId: id },
      relations: this.relations
    });
  }

  static async getFilteredRequests(
    tutorSubjects: Subject[],
    tutorEducationLevels: EducationLevel[]
  ) {
    const repository = MysqlDataSource.getRepository(LessonRequest);
    return await repository.find({
      where: {
        subject: In(tutorSubjects.map((subject) => subject.subjectId)),
        status: EnumStatusName.PENDENTE,
        student: {
          educationLevel: In(
            tutorEducationLevels.map((level) => level.educationId)
          )
        }
      },
      relations: ['student']
    });
  }
}
