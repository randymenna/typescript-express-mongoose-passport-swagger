import express from 'express';
import * as mongoController from '../mongo/mongo.controller';

const router = express.Router();

router.post('/device', mongoController.create);
router.put('/device/:id', mongoController.update);
router.delete('/device/:id', mongoController.remove);
router.get('/device/:id', mongoController.retrieve);
router.get('/devices', mongoController.list);

export const DeviceRouter = router;
