import express from 'express';
import * as userController from './user.controller';
import { validate } from '../../middleware/validate';
import { validationRules } from './user.validations';
import passport from 'passport';

const router = express.Router();

router.post('/user', validationRules('newUser'), validate, userController.newUser);
router.put('/user', validationRules('updateUser'), validate, userController.updateUser);
router.delete('/user/:email', validationRules('deleteUser'), validate, userController.deleteUser);
router.get('/users', passport.authenticate('bearer', {session: false}), userController.getAllUsers);
router.get('/user/:email', validationRules('getUser'), validate, userController.getUser);
router.get('/user', passport.authenticate('bearer', {session: false}), userController.me);

export const UserRouter = router;
