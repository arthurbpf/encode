import { Separator } from '@/components/ui/separator';
import { getTokenById, TokenInfo } from '@/lib/ethers';
import { retrieveData } from '@/lib/ipfs';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const TokenInfoPage = () => {
	const router = useRouter();
	const { tokenId } = router.query;
	const [tokenInfo, setTokenInfo] = useState<TokenInfo>({} as TokenInfo);
	const [text, setText] = useState('');

	const getTokenInfo = async () => {
		const tokenInfo = await getTokenById(Number(tokenId));
		setTokenInfo(tokenInfo);
	};

	const getText = async () => {
		const text = await retrieveData(tokenInfo.uri);
		setText(text);
	};

	useEffect(() => {
		getTokenInfo();
	}, [tokenId]);

	useEffect(() => {
		getText();
	}, [tokenInfo.uri]);

	return (
		<div className="align-center flex w-screen flex-col items-center justify-center p-4">
			<h1 className="flex h-10 scroll-m-20 items-center space-x-4 text-4xl font-extrabold tracking-tight lg:text-5xl">
				<span># {tokenInfo.id}</span>
				<Separator orientation="vertical" />
				<span>{tokenInfo.title}</span>
			</h1>

			<h2 className="mt-10 scroll-m-20 border-b border-b-slate-200 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 dark:border-b-slate-700">
				{tokenInfo.description}
			</h2>

			<text className="w-full text-justify">{text}</text>
		</div>
	);
};

export default TokenInfoPage;
