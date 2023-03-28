import { setUserAddress } from '@/stores/ethers';
import { ethers } from 'ethers';

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

		const accounts = await ethereum.request({
			method: 'eth_requestAccounts'
		});

		console.log('Connected', accounts[0]);
		setUserAddress(accounts[0]);
	} catch (error) {
		console.error(error);
	}
}
