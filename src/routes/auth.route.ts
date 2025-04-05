import { z } from 'zod';
import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { zValidator } from '@hono/zod-validator';

import { db } from '../db';
import { usersTable } from '../db/schema';

export const authRouter = new Hono();

// Esquema de validación para el registro de usuarios
const registerSchema = z.object({
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

// Ruta para el registro de usuarios
authRouter.post('/register', zValidator('json', registerSchema), async context => {
	// Obtener los datos del usuario
	const { username, email, password } = await context.req.json();

	// Verificar que el correo no esté registrado
	const [existUserByEmail] = await db.select().from(usersTable).where(eq(usersTable.email, email));
	if (existUserByEmail) {
		return context.json({ message: 'El usuario ya está registrado' }, 400);
	}

	// Verificar que el nombre de usuario no esté registrado
	if (username) {
		const [existUsername] = await db.select().from(usersTable).where(eq(usersTable.username, username));
		if (existUsername) {
			return context.json({ message: 'El nombre de usuario ya está registrado' }, 400);
		}
	}

	// Hashear la contraseña
	const hashedPassword = await Bun.password.hash(password, {
		algorithm: 'argon2id',
		memoryCost: 2 ** 15,
		timeCost: 3,
	});

	// Crear un nuevo usuario
	const user = { username: username ?? email.split('@')[0], email, password: hashedPassword };

	// Guardar el usuario en la base de datos
	const [newUser] = await db
		.insert(usersTable)
		.values(user)
		.returning({ id: usersTable.id, username: usersTable.username, email: usersTable.email });

	return context.json(newUser, 201);
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
