import express from 'express';
import * as mongoController from '../mongo/mongo.controller';

const router = express.Router();

router.post('/position', mongoController.create);
router.put('/position/:id', mongoController.update);
router.delete('/position/:id', mongoController.remove);
router.get('/position/:id', mongoController.retrieve);
router.get('/position', mongoController.list);

export const PositionRouter = router;
