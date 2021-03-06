import { Router } from 'express';
import { Segments, Joi, celebrate } from 'celebrate';
import multer from 'multer';
import uploadConfig from '@config/updload';
import UsersController from '../controllers/UsersController';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import UsersAvatarController from '../controllers/UsersAvatarController';

const usersRouter = Router();
const upload = multer(uploadConfig.multer);
const usersController = new UsersController();
const usersAvatarController = new UsersAvatarController();

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  usersController.create,
);

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  usersAvatarController.update,
);

export default usersRouter;
