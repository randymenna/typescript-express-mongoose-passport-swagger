import express from 'express';
import * as mongoController from '../mongo/mongo.controller';

const router = express.Router();

router.post('/geoFence', mongoController.create);
router.put('/geoFence/:id', mongoController.update);
router.delete('/geoFence/:id', mongoController.remove);
router.get('/geoFence/:id', mongoController.retrieve);
router.get('/geoFence', mongoController.list);

export const GeoFenceRouter = router;
