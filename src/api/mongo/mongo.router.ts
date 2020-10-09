import express from 'express';
import * as mongoController from './mongo.controller';
import { validate } from '../../middleware/validate';
import { validationRules } from './mongo.validations';

const router = express.Router();

router.post('/mongo/:collection', validationRules('create'), validate, mongoController.create);
router.put('/mongo/:collection/:id', validationRules('update'), validate, mongoController.update);
router.delete('/mongo/:collection/:id', validationRules('remove'), validate, mongoController.remove);
router.get('/mongo/:collection/:id', validationRules('retrieve'), validate, mongoController.retrieve);
router.get('/mongos/:collection', validationRules('list'), validate, mongoController.list);

export const MongoRouter = router;
