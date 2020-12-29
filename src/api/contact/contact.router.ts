import express from 'express';
import * as mongoController from '../mongo/mongo.controller';

const router = express.Router();

router.post('/contact', mongoController.create);
router.put('/contact/:id', mongoController.update);
router.delete('/contact/:id', mongoController.remove);
router.get('/contact/:id', mongoController.retrieve);
router.get('/contact', mongoController.list);

export const ContactRouter = router;
