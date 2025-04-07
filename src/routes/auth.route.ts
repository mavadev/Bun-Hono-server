import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { loginSchema, registerSchema, verifySchema } from '../validators/auth.validator';
import { loginUser, registerUser, verifyUser } from '../controller/auth.controller';

export const authRouter = new Hono();

// Ruta para el registro de usuarios
authRouter.post('/register', zValidator('json', registerSchema), registerUser);

// Ruta para la verificación de cuenta
authRouter.post('/verify/:token', zValidator('param', verifySchema), verifyUser);

// Ruta para el inicio de sesión de usuario
authRouter.post('/login', zValidator('json', loginSchema), loginUser);

authRouter.post('/logout', context => {
	return context.json({
		message: 'Logout success!',
	});
});

export default authRouter;
