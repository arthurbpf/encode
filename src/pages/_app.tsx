import Navbar from '@/components/Navbar';
import { getPrimaryAccountAddress } from '@/lib/ethers';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps) {
	useEffect(() => {
		getPrimaryAccountAddress();
	}, []);

	return (
		<div className={`flex min-h-screen flex-col font-sans`}>
			<Navbar />
			<main className="flex flex-grow flex-col">
				<Component {...pageProps} />
			</main>
		</div>
	);
}
