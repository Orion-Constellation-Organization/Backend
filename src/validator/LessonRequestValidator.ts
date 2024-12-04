import { body, query } from 'express-validator';
import { EnumReasonName } from '../enum/EnumReasonName';
import { BaseValidator } from './BaseValidator';
import { LessonRequestRepository } from '../repository/LessonRequestRepository';
import { StudentRepository } from '../repository/StudentRepository';
import { SubjectRepository } from '../repository/SubjectRepository';
import { EnumErrorMessages } from '../enum/EnumErrorMessages';
import { AppError } from '../error/AppError';
import { handleError } from '../utils/ErrorHandler';
import { RequestHandler } from 'express';
import { EnumStatusName } from '../enum/EnumStatusName';
import { EnumOrderDirection } from '../enum/EnumOrderDirection';

export class LessonRequestValidator {
  static createLessonRequest(): Array<RequestHandler> {
    return BaseValidator.validationList([
      body('reason')
        .trim()
        .custom((value): boolean => {
          const validReasons = Object.values(EnumReasonName);
          const invalidReason = EnumErrorMessages.REASON_INVALID.replace('${validReasons}', validReasons.join(', '));

          if (!Array.isArray(value)) {
            throw new AppError(invalidReason);
          }

          if (value.length === 0) {
            throw new AppError(invalidReason);
          }

          for (const reason of value) {
            if (typeof reason !== 'string' || !validReasons.includes(reason as EnumReasonName)) {
              throw new AppError(invalidReason);
            }
          }
          return true;
        }),
      body('preferredDates')
        .isArray({ min: 1, max: 3 })
        .withMessage(EnumErrorMessages.PREFERRED_DATES_REQUIRED)
        .custom(async (value, { req }) => {
          const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):[0-5][0-9]$/;

          for (const date of value) {
            if (typeof date !== 'string' || !dateRegex.test(date)) {
              throw new Error(EnumErrorMessages.DATE_FORMAT_INVALID);
            }

            const dateObject = new Date(date);
            if (isNaN(dateObject.getTime())) {
              throw new Error(EnumErrorMessages.DATE_INVALID);
            }

            const currentDate = new Date();
            if (dateObject < currentDate) {
              throw new Error(EnumErrorMessages.PAST_DATE_ERROR.replace('${date}', date));
            }

            const oneYearFromNow = new Date();
            oneYearFromNow.setFullYear(currentDate.getFullYear() + 1);
            if (dateObject > oneYearFromNow) {
              throw new Error(EnumErrorMessages.DATE_INVALID);
            }
          }

          const uniqueDates = new Set(value);
          if (uniqueDates.size !== value.length) {
            throw new Error(EnumErrorMessages.DUPLICATE_PREFERRED_DATES);
          }

          const studentId = req.body.studentId;
          for (const date of value) {
            const existingLesson = await LessonRequestRepository.findByPreferredDate(date, studentId);
            if (existingLesson) {
              throw new Error(EnumErrorMessages.EXISTING_LESSON.replace('${date}', date));
            }
          }

          return true;
        }),
      body('subjectId')
        .isInt()
        .withMessage(EnumErrorMessages.SUBJECT_ID_INVALID)
        .notEmpty()
        .withMessage(EnumErrorMessages.SUBJECT_ID_REQUIRED)
        .custom(async (value) => {
          try {
            const subject = await SubjectRepository.findSubjectById(value);
            if (!subject) {
              throw new AppError(EnumErrorMessages.SUBJECT_NOT_FOUND);
            }
            return true;
          } catch (error) {
            const { statusCode, message } = handleError(error);
            throw new AppError(message, statusCode);
          }
        }),
      body('studentId')
        .isInt()
        .withMessage(EnumErrorMessages.STUDENT_ID_INVALID)
        .notEmpty()
        .withMessage(EnumErrorMessages.STUDENT_ID_REQUIRED)
        .custom(async (value) => {
          try {
            const student = await StudentRepository.findStudentById(value);
            if (!student) {
              throw new AppError(EnumErrorMessages.STUDENT_NOT_FOUND);
            }
            return true;
          } catch (error) {
            const { statusCode, message } = handleError(error);
            throw new AppError(message, statusCode);
          }
        }),
      body('additionalInfo')
        .optional()
        .isString()
        .withMessage(EnumErrorMessages.ADDITIONAL_INFO_STRING)
        .isLength({ max: 200 })
        .withMessage(EnumErrorMessages.ADDITIONAL_INFO_LENGTH)
    ]);
  }
  static getLessonRequests(): Array<RequestHandler> {
    return BaseValidator.validationList([
      query('id').optional().isInt({ min: 1 }).withMessage(EnumErrorMessages.TUTOR_ID_INVALID),
      query('page').optional().isInt({ min: 1 }).withMessage(EnumErrorMessages.INVALID_PAGE),
      query('size').optional().isInt({ min: 1 }).withMessage(EnumErrorMessages.INVALID_SIZE),
      query('order').optional().isIn(Object.values(EnumOrderDirection)).withMessage(EnumErrorMessages.ORDER_INVALID),
      query('orderBy').optional().isString().withMessage(EnumErrorMessages.ORDER_BY_INVALID),
      query('status').optional().isIn(Object.values(EnumStatusName)).withMessage(EnumErrorMessages.INVALID_STATUS)
    ]);
  }
}
