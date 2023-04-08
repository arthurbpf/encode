import { getTokenById, TokenInfo } from '@/utils/ethers';
import { retrieveData } from '@/utils/ipfs';
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
		<div>
			<h1># {tokenInfo.id}</h1>

			<h2>{tokenInfo.title}</h2>
			<h4>{tokenInfo.description}</h4>

			<text>{text}</text>
		</div>
	);
};

export default TokenInfoPage;
