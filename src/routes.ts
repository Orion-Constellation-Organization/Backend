import { Router } from 'express';
import { HomeController } from './controller/HomeController';
import { TutorController } from './controller/TutorController';
import { TutorValidator } from './validator/TutorValidator';
import { StudentValidator } from './validator/StudentValidator';
import { AuthValidator } from './validator/AuthValidator';
import { StudentController } from './controller/StudentController';
import { EducationLevelController } from './controller/EducationLevelController';
import { AuthController } from './controller/AuthController';
import { authMiddleware } from './middleware/AuthMiddleware';
import { LessonRequestController } from './controller/LessonRequestController';
import { SubjectController } from './controller/SubjectController';
import { upload } from './config/s3Client';
import { UpdatePersonalDataValidator } from './validator/UpdatePersonalDataValidator';
import { UploadPhotoValidator } from './validator/UploadPhotoValidator';
import { LessonRequestValidator } from './validator/LessonRequestValidator';

const router = Router();

// Instâncias de controladores
const homeController = new HomeController();
const tutorController = new TutorController();
const studentController = new StudentController();
const educationLevelController = new EducationLevelController();
const authController = new AuthController();
const lessonRequestController = new LessonRequestController();
const subjectController = new SubjectController();

// Home route
router.get('/', homeController.hello);

// Tutor routes
router.post('/api/tutor', TutorValidator.createTutor(), tutorController.create);
router.get('/api/tutor', authMiddleware(), tutorController.getAll);
router.get('/api/tutor/:id', authMiddleware(), tutorController.getById);
router.patch('/api/tutor', authMiddleware(), UpdatePersonalDataValidator, tutorController.updatePersonalData);
router.patch('/api/photo', authMiddleware(), upload.single('image'), UploadPhotoValidator, tutorController.updatePhoto);
router.patch('/api/tutor-accept-lesson', authMiddleware(), tutorController.acceptLessonRequest);

// Students routes
router.get('/api/student', authMiddleware(), studentController.getAll);
router.post('/api/student', StudentValidator.createStudent(), studentController.create);
router.get('/api/student/:id', authMiddleware(), studentController.getById);
router.get('/api/student-lesson-status', authMiddleware(), studentController.getStudentLessons);
router.patch('/api/student-confirm-lesson', authMiddleware(), studentController.confirmLessonRequest);

// Education Level routes
router.post('/api/educationlevel', authMiddleware(), educationLevelController.create);
router.get('/api/educationlevel', educationLevelController.getAll);

// Login route
router.post('/api/login', AuthValidator.login(), authController.login);

// Lesson Request routes
router.post('/api/lessonrequest', authMiddleware(), LessonRequestValidator.createLessonRequest(), lessonRequestController.create);
router.get('/api/lessonrequest', authMiddleware(), LessonRequestValidator.getLessonRequests(), lessonRequestController.getLessonRequests);
router.get('/api/lessonrequest/:id', authMiddleware(), lessonRequestController.getById);
router.delete('/api/lessonrequest/:id', lessonRequestController.DeleteById);
router.patch('/api/lessonrequest/:lessonId', authMiddleware(), lessonRequestController.updateLesson);
router.delete('/api/lessonrequest-cancel', authMiddleware(), lessonRequestController.cancelTutorLessonRequest);

// Subject routes
router.post('/api/subject', authMiddleware(), subjectController.create);
router.get('/api/subject', authMiddleware(), subjectController.getAll);

export default router;
