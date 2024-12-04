import { MysqlDataSource } from '../config/database';
import { Student } from '../entity/Student';
import { UserRepository } from './UserRepository';
import { EnumStatusName } from '../enum/EnumStatusName';
import { PaginationParams } from '../interface/PaginationParams';

export class StudentRepository extends UserRepository {
  static async saveStudent(student: Student): Promise<Student> {
    const repository = MysqlDataSource.getRepository(Student);
    return repository.save(student);
  }

  static async findAllStudents(params: PaginationParams) {
    const repository = await MysqlDataSource.getRepository(Student);
    const skip = (params.page - 1) * params.size;
    const student = await repository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.educationLevel', 'educationLevel')
      .leftJoinAndSelect('student.lessonRequests', 'lessonRequest')
      .leftJoinAndSelect('lessonRequest.subject', 'subject')
      .leftJoinAndSelect('lessonRequest.lessonRequestTutors', 'lessonRequestTutor')
      .leftJoinAndSelect('lessonRequestTutor.tutor', 'tutor')
      .leftJoinAndSelect('tutor.subjects', 'subjects')
      .orderBy(`student.${params.orderBy}`, params.order)
      .skip(skip)
      .take(params.size)
      .getMany();

    return student;
  }

  static async findStudentById(id: number): Promise<Student> {
    const repository = MysqlDataSource.getRepository(Student);
    const student = await repository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.educationLevel', 'educationLevel')
      .leftJoinAndSelect('student.lessonRequests', 'lessonRequest')
      .leftJoinAndSelect('lessonRequest.subject', 'subject')
      .leftJoinAndSelect('lessonRequest.lessonRequestTutors', 'lessonRequestTutor')
      .leftJoinAndSelect('lessonRequestTutor.tutor', 'tutor')
      .leftJoinAndSelect('tutor.subjects', 'subjects')
      .where('student.id = :id', { id })
      .addSelect('student.birthDate')
      .getOne();

    return student;
  }

  static async findStudentLessonsByStatus(studentId: number, status: EnumStatusName, params: PaginationParams): Promise<Student[]> {
    const repository = MysqlDataSource.getRepository(Student);
    const skip = (params.page - 1) * params.size;

    const results = await repository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.educationLevel', 'educationLevel')
      .leftJoinAndSelect('student.lessonRequests', 'lessonRequest')
      .leftJoinAndSelect('lessonRequest.subject', 'subject')
      .leftJoinAndSelect('lessonRequest.lessonRequestTutors', 'lessonRequestTutor')
      .leftJoinAndSelect('lessonRequestTutor.tutor', 'tutor')
      .leftJoinAndSelect('tutor.subjects', 'subjects')
      .where('student.id = :id', { id: studentId })
      .andWhere('lessonRequest.status = :status', { status })
      .orderBy(`student.${params.orderBy}`, params.order)
      .skip(skip)
      .take(params.size)
      .getMany();

    return results;
  }
}
