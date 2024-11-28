import { Router } from 'express';
import { HomeController } from './controller/HomeController';
import { TutorController } from './controller/TutorController';
import { StudentController } from './controller/StudentController';
import { EducationLevelController } from './controller/EducationLevelController';
import { AuthController } from './controller/AuthController';
import { LessonRequestController } from './controller/LessonRequestController';
import { SubjectController } from './controller/SubjectController';
import { TutorValidator } from './validator/TutorValidator';
import { StudentValidator } from './validator/StudentValidator';
import { AuthValidator } from './validator/AuthValidator';
import { LessonRequestValidator } from './validator/LessonRequestValidator';
import { UpdatePersonalDataValidator } from './validator/UpdatePersonalDataValidator';
import { UploadPhotoValidator } from './validator/UploadPhotoValidator';
import { authMiddleware } from './middleware/AuthMiddleware';
import { upload } from './config/s3Client';

const router = Router();

/**
 * Home Route
 * @route GET /
 * @description A basic route to test the API's availability.
 * @access Public
 */
router.get('/', new HomeController().hello);

/**
 * Register Tutor
 * @route POST /api/register/tutor
 * @description Creates a new tutor account.
 * @access Public
 * @middleware TutorValidator.createTutor
 * @controller TutorController.create
 */
router.post(
  '/api/tutor',
  TutorValidator.createTutor(),
  new TutorController().create
);

router.get('/api/tutor', authMiddleware(), new TutorController().getAll);
router.get('/api/tutor/:id', authMiddleware(), new TutorController().getById);

router.patch(
  '/api/tutor',
  authMiddleware(),
  UpdatePersonalDataValidator,
  new TutorController().updatePersonalData
);

router.patch(
  '/api/photo',
  authMiddleware(),
  upload.single('image'),
  (req, res, next) => UploadPhotoValidator(req, res, next),
  new TutorController().updatePhoto
);

router.patch(
  '/api/tutor-accept-lesson',
  authMiddleware(),
  new TutorController().acceptLessonRequest
);

// Students routes
router.get('/api/student', authMiddleware(), new StudentController().getAll);

router.post(
  '/api/student',
  StudentValidator.createStudent(),
  new StudentController().create
);

/**
 * Get All Students
 * @route GET /api/get/student
 * @description Retrieves all registered students.
 * @access Protected
 * @middleware authMiddleware
 * @controller StudentController.getAll
 */
router.get(
  '/api/get/student',
  authMiddleware(),
  new StudentController().getAll
);

/**
 * Get Student by ID
 * @route GET /api/get/student/:id
 * @description Retrieves a specific student by ID.
 * @access Protected
 * @middleware authMiddleware
 * @controller StudentController.getById
 */
router.get(
  '/api/student/:id',
  authMiddleware(),
  new StudentController().getById
);

/**
 * Get Pending Lessons by Student ID
 * @route GET /api/get/student-pending/:id
 * @description Retrieves pending lessons for a specific student by ID.
 * @access Protected
 * @middleware authMiddleware
 * @controller StudentController.getPendingLessonByStudentId
 */
router.get(
  '/api/student-lesson-status',
  authMiddleware(),
  new StudentController().getStudentLessons
);

/**
 * Register Education Level
 * @route POST /api/register/educationlevel
 * @description Creates a new education level.
 * @access Protected
 * @middleware authMiddleware
 * @controller EducationLevelController.create
 */
router.post(
  '/api/educationlevel',
  authMiddleware(),
  new EducationLevelController().create
);

router.get('/api/educationlevel', new EducationLevelController().getAll);

router.patch(
  '/api/student-confirm-lesson',
  authMiddleware(),
  new StudentController().confirmLessonRequest
);

/**
 * User Login
 * @route POST /api/login
 * @description Authenticates a user and returns a token.
 * @access Public
 * @middleware AuthValidator.login
 * @controller AuthController.login
 */
router.post('/api/login', AuthValidator.login(), new AuthController().login);

/**
 * Register Lesson Request
 * @route POST /api/register/lessonrequest
 * @description Creates a new lesson request.
 * @access Protected
 * @middleware authMiddleware, LessonRequestValidator.createLessonRequest
 * @controller LessonRequestController.create
 */
router.post(
  '/api/lessonrequest',
  authMiddleware(),
  LessonRequestValidator.createLessonRequest(),
  new LessonRequestController().create
);

/**
 * Get All Lesson Requests
 * @route GET /api/get/lessonrequest
 * @description Retrieves all lesson requests.
 * @access Protected
 * @middleware authMiddleware
 * @controller LessonRequestController.getAll
 */
router.get(
  '/api/lessonrequest',
  authMiddleware(),
  new LessonRequestController().getAll
);

/**
 * Get Lesson Request by ID
 * @route GET /api/get/lessonrequest/:id
 * @description Retrieves a specific lesson request by ID.
 * @access Protected
 * @middleware authMiddleware
 * @controller LessonRequestController.getById
 */
router.get(
  '/api/lessonrequest/:id',
  authMiddleware(),
  new LessonRequestController().getById
);

/**
 * Delete Lesson Request by ID
 * @route DELETE /api/delete/lessonrequest/:id
 * @description Deletes a specific lesson request by ID.
 * @access Protected
 * @middleware authMiddleware
 * @controller LessonRequestController.deleteById
 */
router.delete(
  '/api/lessonrequest/:id',
  new LessonRequestController().DeleteById
);

router.patch(
  '/api/lessonrequest/:lessonId',
  authMiddleware(),
  new LessonRequestController().updateLesson
);

router.delete(
  '/api/lessonrequest-cancel',
  authMiddleware(),
  new LessonRequestController().cancelTutorLessonRequest
);

// Subject route
router.post('/api/subject', authMiddleware(), new SubjectController().create);
router.get('/api/subject', authMiddleware(), new SubjectController().getAll);
export default router;
