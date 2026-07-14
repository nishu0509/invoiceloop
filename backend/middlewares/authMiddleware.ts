import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AuthUser } from '../types/express';

const protect = (req: Request, res: Response, next: NextFunction): void => {
    let token = req.headers.authorization;
    if (token && token.startsWith('Bearer')) {
        try {
            token = token.split(' ')[1];
            const decoded: string | JwtPayload = jwt.verify(
                token,
                process.env.JWT_SECRET || 'secret'
            );

            if (typeof decoded === 'string') {
                res.status(401).json({ message: 'Not authorized, invalid token payload' });
                return;
            }

            req.user = decoded as AuthUser;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export default protect;