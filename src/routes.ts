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
  '/api/register/tutor',
  TutorValidator.createTutor(),
  new TutorController().create
);

/**
 * Get All Tutors
 * @route GET /api/get/tutor
 * @description Retrieves all registered tutors.
 * @access Protected
 * @middleware authMiddleware
 * @controller TutorController.getAll
 */
router.get('/api/get/tutor', authMiddleware(), new TutorController().getAll);

/**
 * Update Tutor Photo
 * @route PATCH /api/update/photo
 * @description Updates the photo of a tutor.
 * @access Protected
 * @middleware authMiddleware, upload.single('image'), UploadPhotoValidator
 * @controller TutorController.updatePhoto
 */
router.patch(
  '/api/update/photo',
  authMiddleware(),
  upload.single('image'),
  (req, res, next) => UploadPhotoValidator(req, res, next),
  new TutorController().updatePhoto
);

/**
 * Update Tutor Personal Data
 * @route PATCH /api/update/tutor
 * @description Updates personal data of a tutor.
 * @access Protected
 * @middleware authMiddleware, UpdatePersonalDataValidator
 * @controller TutorController.updatePersonalData
 */
router.patch(
  '/api/update/tutor',
  authMiddleware(),
  (req, res, next) => UpdatePersonalDataValidator(req, res, next),
  new TutorController().updatePersonalData
);

/**
 * Get Tutor by ID
 * @route GET /api/get/tutor/:id
 * @description Retrieves a specific tutor by ID.
 * @access Protected
 * @middleware authMiddleware
 * @controller TutorController.getById
 */
router.get(
  '/api/get/tutor/:id',
  authMiddleware(),
  new TutorController().getById
);

/**
 * Register Student
 * @route POST /api/register/student
 * @description Creates a new student account.
 * @access Public
 * @middleware StudentValidator.createStudent
 * @controller StudentController.create
 */
router.post(
  '/api/register/student',
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
  '/api/get/student/:id',
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
  '/api/get/student-pending/:id',
  authMiddleware(),
  new StudentController().getPendingLessonByStudentId
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
  '/api/register/educationlevel',
  authMiddleware(),
  new EducationLevelController().create
);

/**
 * Get All Education Levels
 * @route GET /api/get/educationlevel
 * @description Retrieves all education levels.
 * @access Protected
 * @middleware authMiddleware
 * @controller EducationLevelController.getAll
 */
router.get(
  '/api/get/educationlevel',
  authMiddleware(),
  new EducationLevelController().getAll
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
  '/api/register/lessonrequest',
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
  '/api/get/lessonrequest',
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
  '/api/get/lessonrequest/:id',
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
  '/api/delete/lessonrequest/:id',
  authMiddleware(),
  new LessonRequestController().deleteById
);

/**
 * Register Subject
 * @route POST /api/register/subject
 * @description Creates a new subject.
 * @access Protected
 * @middleware authMiddleware
 * @controller SubjectController.create
 */
router.post(
  '/api/register/subject',
  authMiddleware(),
  new SubjectController().create
);

/**
 * Get All Subjects
 * @route GET /api/get/subject
 * @description Retrieves all subjects.
 * @access Protected
 * @middleware authMiddleware
 * @controller SubjectController.getAll
 */
router.get(
  '/api/get/subject',
  authMiddleware(),
  new SubjectController().getAll
);

export default router;
