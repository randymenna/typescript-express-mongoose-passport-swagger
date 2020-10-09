import express from 'express';
import * as mongoController from '../mongo/mongo.controller';

const router = express.Router();

router.post('/account', mongoController.create);
router.put('/account/:id', mongoController.update);
router.delete('/account/:id', mongoController.remove);
router.get('/account/:id', mongoController.retrieve);
router.get('/account', mongoController.list);

export const AccountRouter = router;
