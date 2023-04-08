import type { NextApiRequest, NextApiResponse } from 'next';
import pinataSDK from '@pinata/sdk';

async function sendToIpfs(data: string) {
	const pinata = new pinataSDK({
		pinataApiKey: process.env.PINATA_API_KEY,
		pinataSecretApiKey: process.env.PINATA_SECRET_API_KEY
	});

	await pinata.testAuthentication();
	return await pinata.pinJSONToIPFS({ text: data });
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'POST') {
		try {
			const uri = await sendToIpfs(req.body);
			res.status(200).json({ uri });
		} catch (err) {
			res.status(500).json({ error: err });
		}
	} else {
	}
}
