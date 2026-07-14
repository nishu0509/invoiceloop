import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6)
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
});


describe('Auth Validation Tests', () => {

    it('should accept valid register data', () => {
        const result = registerSchema.safeParse({
            name: 'Nishu',
            email: 'test@example.com',
            password: 'password123'
        });

        expect(result.success).toBe(true);
    });


    it('should reject invalid email during register', () => {
        const result = registerSchema.safeParse({
            name: 'Nishu',
            email: 'wrong-email',
            password: 'password123'
        });

        expect(result.success).toBe(false);
    });


    it('should accept valid login data', () => {
        const result = loginSchema.safeParse({
            email: 'test@example.com',
            password: 'password123'
        });

        expect(result.success).toBe(true);
    });


    it('should reject empty password during login', () => {
        const result = loginSchema.safeParse({
            email: 'test@example.com',
            password: ''
        });

        expect(result.success).toBe(false);
    });

});