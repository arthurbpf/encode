import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import { useEffect, useState } from 'react';
import abi from '@/utils/WavePortal.json';
import { ethers } from 'ethers';

declare global {
	interface Window {
		ethereum?: any;
	}
}

export default function Home() {
	const [currentAccount, setCurrentAccount] = useState('');

	const checkIfWalletIsConnected = async () => {
		try {
			const { ethereum } = window;

			if (!ethereum) {
				console.error('Install MetaMask!');
				return;
			} else {
				console.log('ethereum object was found!', ethereum);
			}

			const accounts = await ethereum.request({ method: 'eth_accounts' });

			if (accounts.length !== 0) {
				const account = accounts[0];
				console.log('Connected account found:', account);
				setCurrentAccount(account);
			} else {
				console.error('No connected account was found!');
			}
		} catch (error) {
			console.error(error);
		}
	};

	const connectWallet = async () => {
		try {
			const { ethereum } = window;

			if (!ethereum) {
				alert('MetaMask encontrada!');
				return;
			}

			const accounts = await ethereum.request({
				method: 'eth_requestAccounts'
			});

			console.log('Conectado', accounts[0]);
			setCurrentAccount(accounts[0]);
		} catch (error) {
			console.log(error);
		}
	};

	const wave = async () => {
		try {
			const { ethereum } = window;

			if (ethereum) {
				const provider = new ethers.BrowserProvider(ethereum);
				const signer = await provider.getSigner();

				const wavePortalContract = new ethers.Contract(
					'0xb2bb8ea58A7f0009B27FA050156a176E6fBEEaeB',
					abi.abi,
					signer
				);

				let count = await wavePortalContract.getTotalWaves();

				console.log('Recuperado o número de tchauzinhos...', Number(count));

				const waveTxn = await wavePortalContract.wave();
				console.log('Minerando...', waveTxn.hash);

				await waveTxn.wait();
				console.log('Minerado -- ', waveTxn.hash);

				count = await wavePortalContract.getTotalWaves();
				console.log('Total de tchauzinhos recuperado...', Number(count));
			} else {
				console.log('Objeto Ethereum não encontrado!');
			}
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		checkIfWalletIsConnected();
	}, []);

	return (
		<>
			<Head>
				<title>Encode</title>
				<meta name="description" content="" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className={styles.main}>
				<h1>Web3 Project</h1>

				<button onClick={wave}>Tchauzinho! 👋</button>

				{!currentAccount && (
					<button onClick={connectWallet}>Conectar carteira</button>
				)}
			</main>
		</>
	);
}
