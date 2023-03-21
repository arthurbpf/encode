import Head from 'next/head';
import styles from '@/styles/Home.module.css';

export default function Home() {
	const checkIfWalletIsConnected = () => {
		const { ethereum } = window;

		if (!ethereum) {
			console.log('Garanta que possua a Metamask instalada!');
			return;
		} else {
			console.log('Temos o objeto ethereum', ethereum);
		}
	};

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

				<button>Tchauzinho! 👋</button>
			</main>
		</>
	);
}
