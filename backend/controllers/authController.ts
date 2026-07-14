import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import User from '../models/User';

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.string().optional()
});

const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required')
});

const generateToken = (id: string): string => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: '30d'
    });
};

export const registerUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { name, email, password, role } = registerSchema.parse(req.body);

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                success: false,
                error: 'User already exists'
            });
        }

        const user = await User.create({
            name,
            email,
            password,
            role
        });

        return res.status(201).json({
            success: true,
            token: generateToken(user._id.toString()),
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);

        return res.status(500).json({
            success: false,
            error: message
        });
    }
};

export const loginUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email, password } = loginSchema.parse(req.body);

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        return res.status(200).json({
            success: true,
            token: generateToken(user._id.toString()),
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);

        return res.status(500).json({
            success: false,
            error: message
        });
    }
};