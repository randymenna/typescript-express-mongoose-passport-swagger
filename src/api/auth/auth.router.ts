import express from 'express';
import passport from 'passport';
import * as authController from './auth.controller';
import { validationRules } from '../../api/apiKey/apiKey.validations';
import { validate } from '../../middleware/validate';
import { impersonate } from '../../middleware/impersonate';

const router = express.Router();

router.post('/auth/local',
    validationRules('local'),
    validate,
    passport.authenticate('local', {session: false}),
    authController.genAuthToken);
router.post('/auth/basic', passport.authenticate('basic', {session: false}), authController.genAuthToken);
router.post('/auth/digest', passport.authenticate('digest', {session: false}), authController.genAuthToken);
router.post('/auth/impersonate',
    validationRules('impersonate'),
    validate,
    passport.authenticate('local', {session: false}),
    impersonate,
    authController.genAuthToken);
export const AuthRouter = router;
