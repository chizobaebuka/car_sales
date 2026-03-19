import { Router } from 'express';
import { CarController } from '../controllers/car.controller';
import { authMiddleware } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// Public routes
router.get('/', CarController.findAll);
router.get('/makes', CarController.getMakes);
router.get('/makes/:make/models', CarController.getModels);
router.get('/:id', CarController.findById);
router.get('/:id/similar', CarController.getSimilar);

// Protected routes
router.post('/', authMiddleware, upload.array('images', 12), CarController.create);
router.put('/:id', authMiddleware, CarController.update);
router.delete('/:id', authMiddleware, CarController.delete);
router.post('/:id/images', authMiddleware, upload.array('images', 12), CarController.addImages);
router.delete('/:id/images/:imageId', authMiddleware, CarController.deleteImage);
router.post('/:id/favorite', authMiddleware, CarController.toggleFavorite);
router.get('/user/favorites', authMiddleware, CarController.getFavorites);
router.get('/user/listings', authMiddleware, CarController.getMyListings);
router.get('/user/dashboard', authMiddleware, CarController.getDashboardStats);

export default router;
