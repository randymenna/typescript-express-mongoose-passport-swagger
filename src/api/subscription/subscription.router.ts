import express from 'express';
import * as mongoController from '../mongo/mongo.controller';

const router = express.Router();

router.post('/subscription', mongoController.create);
router.put('/subscription/:id', mongoController.update);
router.delete('/subscription/:id', mongoController.remove);
router.get('/subscription/:id', mongoController.retrieve);
router.get('/subscription', mongoController.list);

export const SubscriptionRouter = router;
