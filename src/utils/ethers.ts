import { ethers } from 'ethers';

export function getDefaultProvider() {
	return ethers.getDefaultProvider('goerli');
}

export function getBrowserProvider() {
	let provider;

	if (window.ethereum == null) {
		console.log('MetaMask not installed; using read-only defaults');
	} else {
		provider = new ethers.BrowserProvider(window.ethereum);
	}

	return provider;
}

export async function getSigner() {
	let signer;

	if (provider instanceof ethers.BrowserProvider) {
		signer = await provider.getSigner();
	}

	return signer;
}

export const defaultProvider = getDefaultProvider();
export const provider = getBrowserProvider();
export const signer = await getSigner();

export async function getUserAddress() {
	return await signer?.getAddress();
}
