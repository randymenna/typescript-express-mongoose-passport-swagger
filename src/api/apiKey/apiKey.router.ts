import express from 'express';
const router = express.Router();
import * as apiKeyController from './apiKey.controller';
import { validate } from '../../routes/validator';
import { validationRules } from './apiKey.validations';
import passport from 'passport'

router.post('/apiKey', validationRules('newApiKey'), validate, apiKeyController.newApiKey);
router.put('/apiKey/:id', validationRules('updateApiKey'), validate, apiKeyController.updateApiKey);
router.delete('/apiKey/:id', validationRules('deleteApiKey'), validate, apiKeyController.deleteApiKey);
router.get('/apiKeys', passport.authenticate('apiKey', { session: false }), apiKeyController.getAllApiKeys);
export const ApiKeyRouter = router;
