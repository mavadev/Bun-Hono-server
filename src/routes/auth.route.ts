import { Hono } from 'hono';

export const authRouter = new Hono();

authRouter.post('/register', context => {
	return context.json({
		message: 'Register success!',
	});
});

authRouter.post('/login', context => {
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
