import { Hono } from 'hono';
import authRouter from './routes/auth.route';
import postRouter from './routes/posts.route';

const app = new Hono();

app.get('/', context => {
	return context.json({
		message: 'Hello World!',
	});
});

app.route('/api/v1/auth', authRouter);
app.route('/api/v1/posts', postRouter);

export default app;
