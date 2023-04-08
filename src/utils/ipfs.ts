import { BytesLike, toUtf8String } from 'ethers';
import { create } from 'ipfs-http-client';

export async function sendData(data: any) {
	const client = create({ url: process.env.NEXT_PUBLIC_IPFS_API_URL });

	const saveInfo = await client.add(data);

	return saveInfo.path;
}

export async function retrieveData(hash: string) {
	if (!hash) {
		return '';
	}

	const client = create({ url: process.env.NEXT_PUBLIC_IPFS_API_URL });

	let content = '';
	for await (const chunk of client.cat(hash)) {
		content += toUtf8String(chunk);
	}

	return content;
}

export const ipfsBaseUrl = 'https://ipfs.io/ipfs/';
