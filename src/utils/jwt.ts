import { jwt, sign } from 'hono/jwt';

import type { JWTPayload } from 'hono/utils/jwt/types';

if (!Bun.env.JWT_SECRET) throw new Error('Missing JWT_SECRET');
const secret = Bun.env.JWT_SECRET;

export const signJWT = async (payload: JWTPayload) => {
	return await sign(payload, secret);
};

export const middlewareJWT = jwt({ secret });
