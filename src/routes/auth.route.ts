import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { registerSchema, verifySchema } from '../validators/auth.validator';
import { registerUser, verifyUser } from '../controller/auth.controller';

export const authRouter = new Hono();

// Ruta para el registro de usuarios
authRouter.post('/register', zValidator('json', registerSchema), registerUser);

// Ruta para la verificación de cuenta
authRouter.post('/verify/:token', zValidator('param', verifySchema), verifyUser);

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
