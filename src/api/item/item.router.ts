import express from 'express';
import * as mongoController from '../mongo/mongo.controller';

const router = express.Router();

router.post('/item', mongoController.create);
router.put('/item/:id', mongoController.update);
router.delete('/item/:id', mongoController.remove);
router.get('/item/:id', mongoController.retrieve);
router.get('/item', mongoController.list);

export const ItemRouter = router;
