import express from 'express';
import passport from 'passport'
const router = express.Router();
import * as authController from './auth.controller';
import { validate } from '../../middleware/validate';
import { validationRules } from './auth.validations';

router.post('/auth/local', passport.authenticate('local', { session: false }), authController.genAuthToken);
router.post('/auth/basic', passport.authenticate('basic', { session: false }), authController.genAuthToken);
router.post('/auth/digest', passport.authenticate('digest', { session: false }), authController.genAuthToken);

export const AuthRouter = router;
