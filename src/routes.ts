import { getRouter } from './decorators/HttpRoute';
import './controller/HomeController';
import './controller/TutorController';
import './controller/StudentController';
import './controller/EducationLevelController';
import './controller/AuthController';
import './controller/LessonRequestController';
import './controller/SubjectController';
import './validator/TutorValidator';
import './validator/StudentValidator';
import './validator/AuthValidator';
import './validator/LessonRequestValidator';
import './middleware/AuthMiddleware';
import './config/s3Client';
import './validator/UpdatePersonalDataValidator';
import './validator/UploadPhotoValidator';
import './decorators/HttpRoute';

export default getRouter();
