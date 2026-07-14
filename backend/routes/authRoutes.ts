import express, { Request, Response } from 'express';
import { registerUser, loginUser } from '../controllers/authController';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/current-user', authMiddleware, async (req: Request, res: Response) => {
    try {
        res.status(200).send({
            success: true,
            message: 'User verified successfully!',
            user: req.user
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in current-user API'
        });
    }
});

export default router;
