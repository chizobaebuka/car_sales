import { Router } from 'express';
import { LeadController } from '../controllers/lead.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/', LeadController.create);
router.get('/my', authMiddleware, LeadController.getMyLeads);
router.put('/:id/status', authMiddleware, LeadController.updateStatus);

export default router;
