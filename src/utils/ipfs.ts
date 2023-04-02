import { create } from 'ipfs-http-client';

export async function sendData(data: any) {
	const client = create({ url: process.env.NEXT_PUBLIC_IPFS_URL });

	const saveInfo = await client.add(data);

	return saveInfo.path;
}

export const ipfsBaseUrl = 'https://ipfs.io/ipfs/';
