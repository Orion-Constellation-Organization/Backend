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
const homeController = new HomeController();
const tutorController = new TutorController();
const studentController = new StudentController();
const educationLevelController = new EducationLevelController();
const authController = new AuthController();
const lessonRequestController = new LessonRequestController();
const subjectController = new SubjectController();

/**
 * @section Home
 * Rotas principais relacionadas à aplicação.
 */
router.get('/', homeController.hello.bind(homeController));

/**
 * @section Auth
 * Rotas relacionadas à autenticação de usuários.
 */
router.post('/api/login', AuthValidator.login(), authController.login.bind(authController));

/**
 * @section Tutor
 * Rotas relacionadas aos tutores.
 */
router.post('/api/tutor', TutorValidator.createTutor(), tutorController.create.bind(tutorController));
router.get('/api/tutor', authMiddleware(), tutorController.getAll.bind(tutorController));
router.get('/api/tutor/:id', authMiddleware(), tutorController.getById.bind(tutorController));
router.patch('/api/tutor', authMiddleware(), UpdatePersonalDataValidator, tutorController.updatePersonalData.bind(tutorController));
router.patch(
  '/api/photo',
  authMiddleware(),
  upload.single('image'),
  UploadPhotoValidator,
  tutorController.updatePhoto.bind(tutorController)
);
router.patch('/api/tutor-accept-lesson', authMiddleware(), tutorController.acceptLessonRequest.bind(tutorController));

/**
 * @section Student
 * Rotas relacionadas aos estudantes.
 */
router.post('/api/student', StudentValidator.createStudent(), studentController.create.bind(studentController));
router.get('/api/student', authMiddleware(), studentController.getAll.bind(studentController));
router.get('/api/student/:id', authMiddleware(), studentController.getById.bind(studentController));
router.get('/api/student-lesson-status', authMiddleware(), studentController.getStudentLessons.bind(studentController));
router.patch('/api/student-confirm-lesson', authMiddleware(), studentController.confirmLessonRequest.bind(studentController));

/**
 * @section Education Level
 * Rotas relacionadas aos níveis de ensino.
 */
router.post('/api/educationlevel', authMiddleware(), educationLevelController.create.bind(educationLevelController));
router.get('/api/educationlevel', educationLevelController.getAll.bind(educationLevelController));

/**
 * @section Lesson Request
 * Rotas relacionadas às solicitações de aula.
 */
router.post(
  '/api/lessonrequest',
  authMiddleware(),
  LessonRequestValidator.createLessonRequest(),
  lessonRequestController.create.bind(lessonRequestController)
);
router.get('/api/lessonrequest', authMiddleware(), lessonRequestController.getAll.bind(lessonRequestController));
router.get('/api/lessonrequest/:id', authMiddleware(), lessonRequestController.getById.bind(lessonRequestController));
router.patch('/api/lessonrequest/:lessonId', authMiddleware(), lessonRequestController.updateLesson.bind(lessonRequestController));
router.delete(
  '/api/lessonrequest-cancel',
  authMiddleware(),
  lessonRequestController.cancelTutorLessonRequest.bind(lessonRequestController)
);

/**
 * @section Subject
 * Rotas relacionadas às matérias.
 */
router.post('/api/subject', authMiddleware(), subjectController.create.bind(subjectController));
router.get('/api/subject', authMiddleware(), subjectController.getAll.bind(subjectController));

export default router;
