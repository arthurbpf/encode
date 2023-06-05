import Head from 'next/head';
import { useEffect, useState } from 'react';
import {
	connectWallet,
	getPrimaryAccountAddress,
	isMetaMaskInstalled
} from '@/lib/ethers';
import { setUserAddress, useEthersStore } from '@/stores/ethers';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Wallet, Link as LinkIcon, Search } from 'lucide-react';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from '@/components/ui/alert-dialog';
import Image from 'next/image';

const MissingMetamaskDialog = () => {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		setOpen(!isMetaMaskInstalled());
	}, []);

	return (
		<AlertDialog open={open}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Não encontramos a carteira Metamask!
					</AlertDialogTitle>
					<AlertDialogDescription className="flex flex-col items-center justify-center">
						<Image
							src="/metamask.svg"
							alt="Metamask logo"
							width={250}
							height={250}
						/>

						<p className="mb-10">
							Utilizar esta aplicação sem a extensão instalada fará com que ela
							não funcione corretamente!
						</p>
						<a target="_blank" href={'https://metamask.io/'}>
							<Button>Faça o download clicando aqui!</Button>
						</a>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={() => setOpen(false)}>
						Ok, entendi!
					</AlertDialogCancel>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

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
			<main className="flex w-screen flex-grow flex-col items-center justify-around gap-5 p-10 font-sans">
				<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
					Encode
				</h1>

				<div className="flex flex-col items-center justify-center gap-2">
					{!userAddress ? (
						<Button onClick={connectWallet}>
							Conectar carteira <Wallet className="ml-2" />
						</Button>
					) : (
						<Link href="/mint">
							<Button>
								Envie seus textos para a blockchain{' '}
								<LinkIcon className="ml-2" />
							</Button>
						</Link>
					)}

					<Link href="/tokens">
						<Button>
							Veja os tokens criados pela comunidade <Search className="ml-2" />
						</Button>
					</Link>
				</div>
				<MissingMetamaskDialog />
			</main>
		</>
	);
}
