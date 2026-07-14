import express, { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { registerUser, loginUser } from '../controllers/authController';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: "Too many requests, please try again later."
    }
});

router.post('/register', authLimiter, registerUser);

router.post('/login', authLimiter, loginUser);

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