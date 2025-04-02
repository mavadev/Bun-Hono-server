import { Hono } from 'hono';

const app = new Hono();

app.get('/', context => {
	return context.json({
		message: 'Hello World!',
	});
});

export default app;
