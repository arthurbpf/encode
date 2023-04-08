import '@/styles/globals.css';
import type { AppProps } from 'next/app';

import { Inter, Noto_Serif } from 'next/font/google';

const inter = Inter({
	subsets: ['latin'],
	variable: '--font-sans'
});

/*
const serif = Noto_Serif({
	subsets: ['latin'],
	variable: '--font-serif'
});
*/

export default function App({ Component, pageProps }: AppProps) {
	return (
		<main className={`${inter.variable} font-sans`}>
			<Component {...pageProps} />;
		</main>
	);
}
