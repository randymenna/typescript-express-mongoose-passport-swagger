import express from 'express';
import * as mongoController from '../mongo/mongo.controller';

const router = express.Router();

router.post('/alert', mongoController.create);
router.put('/alert/:id', mongoController.update);
router.delete('/alert/:id', mongoController.remove);
router.get('/alert/:id', mongoController.retrieve);
router.get('/alert', mongoController.list);

export const AlertRouter = router;
