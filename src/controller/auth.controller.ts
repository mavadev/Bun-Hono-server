import { eq } from 'drizzle-orm';
import type { Context } from 'hono';

import { db } from '../db';
import { usersTable } from '../db/schema';
import { hashPassword } from '../utils/hash';
import { generateRandomToken } from '../utils/token';
import { sendVerificationEmail } from '../services/email.service';
import type { UserRegisterSchema } from '../validators/auth.validator';
import { signJWT } from '../utils/jwt';

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

export const verifyUser = async (context: Context) => {
	const { token } = context.req.param();

	// Verificar que el token no esté expirado
	const [user] = await db.select().from(usersTable).where(eq(usersTable.verification_token, token!));
	if (!user) {
		return context.json({ message: 'El token no existe' }, 400);
	}

	// Token expirado
	if (user.verification_expires! < Date.now()) {
		return context.json({ message: 'El token está expirado' }, 400);
	}

	// Verificar que el usuario no esté verificado
	if (user.verified) {
		return context.json({ message: 'El usuario ya está verificado' }, 400);
	}

	// Actualizar el usuario
	await db.update(usersTable).set({
		verified: true,
		verification_token: null,
		verification_expires: null,
	});

	return context.json({ message: 'Usuario verificado' }, 200);
};

export const loginUser = async (context: Context) => {
	// Obtener los datos del usuario
	const { email, password } = await context.req.json();

	// Verificar si el usuario existe en la base de datos
	const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
	if (!user) {
		return context.json({ message: 'El usuario no existe' }, 400);
	}

	// Verificar si la contraseña es correcta
	const isPasswordValid = await Bun.password.verify(password, user.password);
	if (!isPasswordValid) {
		return context.json({ message: 'La contraseña es incorrecta' }, 400);
	}

	// Crear un token de autenticación JWT
	const payload = {
		id: user.id,
		email: user.email,
		username: user.username,
		exp: Math.floor(Date.now() / 1000) + 60 * 60, // Token válido por 1 hora
	};
	const token = await signJWT(payload);

	return context.json({ message: 'Iniciaste Sesión con éxito!', data: token }, 200);
};
