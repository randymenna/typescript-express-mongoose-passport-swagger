import express from 'express';
import * as apiKeyController from 'src/api/auth/apiKey/apiKey.controller';
import { validate } from 'src/middleware/validate';
import { validationRules } from 'src/api/auth/apiKey/apiKey.validations';
import passport from 'passport';

const router = express.Router();

router.post('/apiKey/:email', validationRules('newApiKey'), validate, apiKeyController.newApiKey);
router.delete('/apiKey/:key', validationRules('deleteApiKey'), validate, apiKeyController.deleteApiKey);
router.get('/apiKey/:key', validationRules('getApiKey'), validate, apiKeyController.getApiKey);
router.get('/apiKeys/:email', validationRules('keysForEmail'), validate, apiKeyController.keysForEmail);
router.get('/apiKeys', passport.authenticate('apiKey', {session: false}), apiKeyController.getAllApiKeys);
export const ApiKeyRouter = router;
