import TokenCard from '@/components/TokenCard';
import { getTokensOfOwner, TokenInfo } from '@/libutils/ethers';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Tokens = () => {
	const router = useRouter();
	const { walletAddress } = router.query;
	const [tokens, setTokens] = useState<TokenInfo[]>([]);

	const getTokens = async () => {
		if (!walletAddress) return;

		const tokens = await getTokensOfOwner(walletAddress as string);

		setTokens(tokens);
	};

	useEffect(() => {
		getTokens();
	}, [walletAddress]);

	return (
		<div>
			<h1>Wallet Address: {walletAddress}</h1>

			{tokens.map((token, index) => (
				<TokenCard key={index} token={token} />
			))}
		</div>
	);
};

export default Tokens;
