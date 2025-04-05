import { z } from 'zod';
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

export const authRouter = new Hono();

// Esquema de validación para el registro de usuarios
const registerSchema = z.object({
	username: z
		.string({ message: 'El nombre de usuario es obligatorio' })
		.trim()
		.min(3, {
			message: 'El nombre de usuario debe tener al menos 3 caracteres',
		})
		.optional(),
	email: z.string({ message: 'El correo electrónico es obligatorio' }).trim().email({
		message: 'El correo debe ser válido',
	}),
	password: z.string({ message: 'La contraseña es obligatoria' }).trim().min(8, {
		message: 'La contraseña debe tener al menos 8 caracteres',
	}),
});

// Ruta para el registro de usuarios
authRouter.post('/register', zValidator('json', registerSchema), async context => {
	// Obtener los datos del usuario
	const { username, email, password } = await context.req.json();

	// Verificar que el correo no esté registrado

	// Hashear la contraseña
	// Crear un nuevo usuario
	// Guardar el usuario en la base de datos
	// Enviar un correo de verificación

	return context.json({
		email,
		password,
	});
});

authRouter.post('/login', context => {
	// Obtener los datos del usuario
	// Validar los datos del usuario
	// Verificar si el usuario existe en la base de datos
	// Verificar si la contraseña es correcta
	// Crear un nuevo token de autenticación JWT
	// Retornar el JWT

	return context.json({
		message: 'Login success!',
	});
});

authRouter.post('/logout', context => {
	return context.json({
		message: 'Logout success!',
	});
});

export default authRouter;
