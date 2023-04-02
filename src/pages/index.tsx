import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import { useEffect } from 'react';
import { connectWallet, getPrimaryAccountAddress } from '@/utils/ethers';
import { setUserAddress, useEthersStore } from '@/stores/ethers';
import Link from 'next/link';

export default function Home() {
	const userAddress = useEthersStore((state) => state.userAddress);

	const checkIfWalletIsConnected = async () => {
		const accountAddress = (await getPrimaryAccountAddress()) || '';
		setUserAddress(accountAddress);
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
				<h1>Encode</h1>

				{!userAddress ? (
					<button onClick={connectWallet}>Conectar carteira</button>
				) : (
					<Link href="/mint">
						<button>Envie seus textos para a blockchain</button>
					</Link>
				)}
			</main>
		</>
	);
}
