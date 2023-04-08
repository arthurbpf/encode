import Head from 'next/head';
import { useEffect } from 'react';
import { connectWallet, getPrimaryAccountAddress } from '@/lib/ethers';
import { setUserAddress, useEthersStore } from '@/stores/ethers';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Wallet, Link as LinkIcon } from 'lucide-react';

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
			<main className="font-sans p-10 flex flex-col items-center justify-around gap-5 h-screen w-screen">
				<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
					Encode
				</h1>

				{!userAddress ? (
					<Button onClick={connectWallet}>
						Conectar carteira <Wallet className="ml-2" />
					</Button>
				) : (
					<Link href="/mint">
						<Button>
							Envie seus textos para a blockchain <LinkIcon className="ml-2" />
						</Button>
					</Link>
				)}
			</main>
		</>
	);
}
