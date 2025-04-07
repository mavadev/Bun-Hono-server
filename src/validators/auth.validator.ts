import { z } from 'zod';
import { createInsertSchema } from 'drizzle-zod';
import { usersTable } from '../db/schema';

// REGISTER
export const registerSchema = createInsertSchema(usersTable, {
	username: z
		.string({ message: 'El nombre de usuario es obligatorio' })
		.trim()
		.toLowerCase()
		.min(3, {
			message: 'El nombre de usuario debe tener al menos 3 caracteres',
		})
		.optional(),
	email: z.string({ message: 'El correo electrónico es obligatorio' }).trim().toLowerCase().email({
		message: 'El correo debe ser válido',
	}),
	password: z.string({ message: 'La contraseña es obligatoria' }).trim().min(8, {
		message: 'La contraseña debe tener al menos 8 caracteres',
	}),
});
export type UserRegisterSchema = z.infer<typeof registerSchema>;

// VERIFY
export const verifySchema = z.object({
	token: z
		.string({ message: 'El token es obligatorio' })
		.min(6, {
			message: 'El token debe tener al menos 6 caracteres',
		})
		.trim(),
});

// LOGIN
export const loginSchema = registerSchema.pick({
	email: true,
	password: true,
});
export type UserLoginSchema = z.infer<typeof loginSchema>;
