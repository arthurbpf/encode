import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import { useEffect } from 'react';
import abi from '@/utils/WavePortal.json';
import { ethers } from 'ethers';
import { connectWallet, getPrimaryAccountAddress } from '@/utils/ethers';
import { setUserAddress, useEthersStore } from '@/stores/ethers';

export default function Home() {
	const userAddress = useEthersStore((state) => state.userAddress);

	const checkIfWalletIsConnected = async () => {
		const accountAddress = (await getPrimaryAccountAddress()) || '';
		setUserAddress(accountAddress);
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
				console.log('Mining...', waveTxn.hash);

				await waveTxn.wait();
				console.log('Mined -- ', waveTxn.hash);

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

				{!userAddress && (
					<button onClick={connectWallet}>Conectar carteira</button>
				)}
			</main>
		</>
	);
}
