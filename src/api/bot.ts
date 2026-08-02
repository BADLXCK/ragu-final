'use server';

export const sendMessageToBot = async (text: string) => {
	const response = await fetch(
		`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_KEY}/sendMessage`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				chat_id: process.env.TELEGRAM_CHAT_ID,
				text,
			}),
		},
	);

	if (!response.ok) {
		const body = await response.text();
		console.error(
			`Telegram sendMessage failed (${response.status}): ${body}`,
		);
		throw new Error(`Telegram sendMessage failed: ${body}`);
	}

	return response.status;
};
