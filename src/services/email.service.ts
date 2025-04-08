import { Resend } from 'resend';
if (process.env.RESEND_API_KEY === undefined) throw new Error('Missing RESEND_API_KEY');
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, code: string) => {
	await resend.emails.send({
		from: 'app@resend.dev',
		to: email,
		subject: 'Verifica tu cuenta',
		html: `<p>Tu código de verificación es: <strong>${code}</strong></p>
           <p>Este código expirará en 15 minutos.</p>`,
	});
};
