import { eq } from 'drizzle-orm';
import type { Context } from 'hono';

import { db } from '../db';
import { usersTable } from '../db/schema';
import { hashPassword } from '../utils/hash';
import { generateRandomToken } from '../utils/token';
import { sendVerificationEmail } from '../services/email.service';
import type { UserRegisterSchema } from '../validators/auth.validator';

export const registerUser = async (context: Context) => {
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

	// Generar datos de usuario
	const hashedPassword = await hashPassword(password);
	const token = generateRandomToken();
	const tokenExpires = new Date();
	tokenExpires.setMinutes(tokenExpires.getMinutes() + 15);

	// Crear un nuevo usuario
	const user: UserRegisterSchema = {
		username: username ?? email.split('@')[0],
		email,
		password: hashedPassword,
		verification_token: token,
		verification_expires: tokenExpires.getTime(),
	};

	// Guardar el usuario en la base de datos
	const [newUser] = await db
		.insert(usersTable)
		.values(user)
		.returning({ id: usersTable.id, username: usersTable.username, email: usersTable.email });

	// Enviar un correo electrónico de verificación
	await sendVerificationEmail(email, token);

	return context.json(newUser, 201);
};
