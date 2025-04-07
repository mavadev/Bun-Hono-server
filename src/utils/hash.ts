export const hashPassword = async (password: string) => {
	return await Bun.password.hash(password, {
		algorithm: 'argon2id',
		memoryCost: 2 ** 15,
		timeCost: 3,
	});
};
