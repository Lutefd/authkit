'use server';
require('dotenv').config();

import { env } from '@/env';
import AWS from 'aws-sdk';

const ses = new AWS.SES({
	apiVersion: 'latest',
	region: 'sa-east-1',
	credentials: {
		accessKeyId: env.SES_ACCESS_KEY_ID!,
		secretAccessKey: env.SES_SECRET_ACCESS_KEY!,
	},
});

export const sendEmail = async (to: string, subject: string, body: string) => {
	const params = {
		Destination: {
			ToAddresses: [to],
		},
		Message: {
			Body: {
				Html: {
					Charset: 'UTF-8',
					Data: body,
				},
			},
			Subject: {
				Charset: 'UTF-8',
				Data: subject,
			},
		},
		Source: env.SES_EMAIL,
	};

	try {
		const emailResult = await ses.sendEmail(params).promise();
		console.log(emailResult);
		return emailResult.MessageId;
	} catch (error) {
		console.log(error);
		return error;
	}
};

export const sendVerificationEmail = async (to: string, token: string) => {
	const subject = 'Verifique seu email';
	const body = `
        <p>Obrigado por se Cadastrar!</p>
        <p>Por favor verifique seu email clicando <a href="http://localhost:3000/auth/verify-email?token=${token}">aqui</a>.</p>
    `;

	return await sendEmail(to, subject, body);
};

export const sendPasswordResetEmail = async (to: string, token: string) => {
	const subject = 'Redefinir sua senha';
	const body = `
		<p>Por favor clique <a href="http://localhost:3000/auth/reset-password?token=${token}">aqui</a> para redefinir sua senha.</p>
	`;

	return await sendEmail(to, subject, body);
};
