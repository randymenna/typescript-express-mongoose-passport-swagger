import express from 'express';
import * as mongoController from '../mongo/mongo.controller';

const router = express.Router();

router.post('/location', mongoController.create);
router.put('/location/:id', mongoController.update);
router.delete('/location/:id', mongoController.remove);
router.get('/location/:id', mongoController.retrieve);
router.get('/location', mongoController.list);

export const LocationRouter = router;
