import express from 'express';
import * as mongoController from '../mongo/mongo.controller';

const router = express.Router();

router.post('/billing', mongoController.create);
router.put('/billing/:id', mongoController.update);
router.delete('/billing/:id', mongoController.remove);
router.get('/billing/:id', mongoController.retrieve);
router.get('/billing', mongoController.list);

export const BillingRouter = router;
