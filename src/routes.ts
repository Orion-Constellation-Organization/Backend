import { Router } from 'express';
import { HomeController } from './controller/HomeController';
import { TutorController } from './controller/TutorController';
import { StudentController } from './controller/StudentController';
import { EducationLevelController } from './controller/EducationLevelController';
import { AuthController } from './controller/AuthController';
import { LessonRequestController } from './controller/LessonRequestController';
import { SubjectController } from './controller/SubjectController';
import { authMiddleware } from './middleware/AuthMiddleware';
import { TutorValidator } from './validator/TutorValidator';
import { StudentValidator } from './validator/StudentValidator';
import { AuthValidator } from './validator/AuthValidator';
import { LessonRequestValidator } from './validator/LessonRequestValidator';
import { UpdatePersonalDataValidator } from './validator/UpdatePersonalDataValidator';
import { UploadPhotoValidator } from './validator/UploadPhotoValidator';
import { upload } from './config/s3Client';

const router = Router();

// Instâncias dos controladores centralizadas
const homeController = new HomeController();
const tutorController = new TutorController();
const studentController = new StudentController();
const educationLevelController = new EducationLevelController();
const authController = new AuthController();
const lessonRequestController = new LessonRequestController();
const subjectController = new SubjectController();

/**
 * Home routes
 * @route GET /
 */
router.get('/', homeController.hello);

/**
 * Tutor routes
 * @route POST /api/tutor
 * @route GET /api/tutor
 * @route GET /api/tutor/:id
 * @route PATCH /api/tutor
 * @route PATCH /api/photo
 * @route PATCH /api/tutor-accept-lesson
 */
router.post('/api/tutor', TutorValidator.createTutor(), tutorController.create);
router.get('/api/tutor', authMiddleware(), tutorController.getAll);
router.get('/api/tutor/:id', authMiddleware('tutor', true), tutorController.getById);
router.patch('/api/tutor', authMiddleware(), UpdatePersonalDataValidator, tutorController.updatePersonalData);
router.patch('/api/photo', authMiddleware(), upload.single('image'), UploadPhotoValidator, tutorController.updatePhoto);
router.patch('/api/tutor-accept-lesson', authMiddleware(), tutorController.acceptLessonRequest);

/**
 * Student routes
 * @route GET /api/student
 * @route POST /api/student
 * @route GET /api/student/:id
 * @route GET /api/student-lesson-status
 * @route PATCH /api/student-confirm-lesson
 */
router.get('/api/student', authMiddleware(), studentController.getAll);
router.post('/api/student', StudentValidator.createStudent(), studentController.create);
router.get('/api/student/:id', authMiddleware('student', true), studentController.getById);
router.get('/api/student-lesson-status', authMiddleware('student', true), studentController.getStudentLessons);
router.patch('/api/student-confirm-lesson', authMiddleware(), studentController.confirmLessonRequest);

/**
 * Education Level routes
 * @route POST /api/educationlevel
 * @route GET /api/educationlevel
 */
router.post('/api/educationlevel', authMiddleware(), educationLevelController.create);
router.get('/api/educationlevel', educationLevelController.getAll);

/**
 * Auth routes
 * @route POST /api/login
 */
router.post('/api/login', AuthValidator.login(), authController.login);

/**
 * Lesson Request routes
 * @route POST /api/lessonrequest
 * @route POST /api/lessonrequest-decline
 * @route GET /api/lessonrequest
 * @route GET /api/lessonrequest/:id
 * @route DELETE /api/lessonrequest/:id
 * @route PATCH /api/lessonrequest/:lessonId
 * @route DELETE /api/lessonrequest-cancel
 */
router.post('/api/lessonrequest', authMiddleware(), LessonRequestValidator.createLessonRequest(), lessonRequestController.create);
router.post('/api/lessonrequest-decline', authMiddleware(), new LessonRequestController().declineLessonRequest);
router.get(
  '/api/lessonrequest',
  authMiddleware('tutor', true),
  LessonRequestValidator.getLessonRequests(),
  lessonRequestController.getLessonRequests
);
router.get('/api/lessonrequest/:id', authMiddleware(), lessonRequestController.getById);
router.delete('/api/lessonrequest/:id', authMiddleware('student', true), lessonRequestController.deleteById);
router.patch('/api/lessonrequest/:lessonId', authMiddleware('student', true), lessonRequestController.updateLesson);
router.delete('/api/lessonrequest-cancel', authMiddleware('tutor', true), lessonRequestController.cancelTutorLessonRequest);

/**
 * Subject routes
 * @route POST /api/subject
 * @route GET /api/subject
 */
router.post('/api/subject', authMiddleware(), subjectController.create);
router.get('/api/subject', authMiddleware(), subjectController.getAll);

export default router;
