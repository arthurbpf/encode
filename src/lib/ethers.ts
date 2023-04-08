import { setUserAddress } from '@/stores/ethers';
import { ethers } from 'ethers';

import abi from './Encode.json';

export const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export function isMetaMaskInstalled() {
	return window && window.ethereum;
}

export function getProvider() {
	try {
		let provider = new ethers.BrowserProvider(window.ethereum);

		return provider;
	} catch (e) {
		console.error('MetaMask not found!');
	}
}

export async function getConnectedAccounts() {
	const provider = getProvider();

	if (provider) {
		return await provider.listAccounts();
	}

	return [];
}

export async function isConnected() {
	const accounts = await getConnectedAccounts();

	return accounts.length > 0;
}

export async function getPrimaryAccountAddress() {
	const accounts = await getConnectedAccounts();

	return accounts[0]?.getAddress();
}

export async function connectWallet() {
	try {
		const { ethereum } = window;

		if (!ethereum) {
			alert('MetaMask encontrada!');
			return;
		}

		const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

		console.log('Connected', accounts[0]);
		setUserAddress(accounts[0]);
	} catch (error) {
		console.error(error);
	}
}

interface getEncodeContractParams {
	signed?: boolean;
}

export async function getEncodeContract({
	signed = true
}: getEncodeContractParams) {
	const provider = getProvider();

	if (provider) {
		const signer = signed ? await provider.getSigner() : provider;

		return new ethers.Contract(contractAddress, abi.abi, signer);
	}
}

interface mintTokenParams {
	address: string;
	uri: string;
	title: string;
	description: string;
}

export async function mintToken({
	address,
	uri,
	title,
	description
}: mintTokenParams) {
	const contract = await getEncodeContract({ signed: true });

	try {
		if (contract) {
			const tx = contract.safeMint(address, uri, title, description);
			await tx;
		} else {
			throw new Error('Contract not found!');
		}
	} catch (error) {
		console.error(error);
	}
}

export interface TokenInfo {
	id: number;
	uri: string;
	title: string;
	owner?: string;
	description: string;
	creationDate: Date;
}

export async function getTokensOfOwner(address: string): Promise<TokenInfo[]> {
	const contract = await getEncodeContract({ signed: false });

	try {
		if (contract) {
			const tokens = await contract.getTokensOfOwner(address);

			if (tokens.length === 0) return [];

			return tokens.map((token: any) => ({
				id: Number(token.id),
				uri: token.uri,
				creationDate: new Date(Number(token.metadata.creationDate) * 1000),
				title: token.metadata.title,
				description: token.metadata.description
			}));
		} else {
			throw new Error('Contract not found!');
		}
	} catch (error) {
		console.error(error);
		return [];
	}
}

export async function getTokenById(id: number): Promise<TokenInfo> {
	const contract = await getEncodeContract({ signed: false });

	try {
		if (id < 0 || isNaN(id)) throw new Error('Invalid id!');

		if (contract) {
			const token = await contract.getToken(BigInt(id));

			return {
				id: Number(token.id),
				uri: token.uri,
				creationDate: new Date(Number(token.metadata.creationDate) * 1000),
				owner: token.owner,
				title: token.metadata.title,
				description: token.metadata.description
			};
		} else {
			throw new Error('Contract not found!');
		}
	} catch (error) {
		console.error(error);
		return {} as TokenInfo;
	}
}