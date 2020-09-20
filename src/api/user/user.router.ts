import express from 'express';
const router = express.Router();
import * as userController from './user.controller';
import { validate } from '../../routes/validator';
import { validationRules } from './user.validations';
import passport from 'passport'

router.post('/user', validationRules('newUser'), validate, userController.newUser);
router.put('/user/:id', validationRules('updateUser'), validate, userController.updateUser);
router.delete('/user/:id', validationRules('deleteUser'), validate, userController.deleteUser);
router.get('/users', passport.authenticate('bearer', { session: false }), userController.getAllUsers);

export const UserRouter = router;
