import Head from 'next/head';
import { useEffect } from 'react';
import { connectWallet, getPrimaryAccountAddress } from '@/lib/ethers';
import { setUserAddress, useEthersStore } from '@/stores/ethers';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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
			<main>
				<h1>Encode</h1>

				{!userAddress ? (
					<Button onClick={connectWallet}>Conectar carteira</Button>
				) : (
					<Link href="/mint">
						<Button>Envie seus textos para a blockchain</Button>
					</Link>
				)}
			</main>
		</>
	);
}
