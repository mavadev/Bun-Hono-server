import { Hono } from 'hono';
import { middlewareJWT } from '../utils/jwt';

export const postRouter = new Hono();
postRouter.use(middlewareJWT);

postRouter.get('/', context => {
	const payload = context.get('jwtPayload');
	return context.json({ message: 'Posts!', payload });
});

export default postRouter;
