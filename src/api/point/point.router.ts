import express from 'express';
import * as mongoController from '../mongo/mongo.controller';

const router = express.Router();

router.post('/point', mongoController.create);
router.put('/point/:id', mongoController.update);
router.delete('/point/:id', mongoController.remove);
router.get('/point/:id', mongoController.retrieve);
router.get('/point', mongoController.list);

export const PointRouter = router;
