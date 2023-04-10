import TokenCard from '@/components/TokenCard';
import { listTokens, TokenInfo } from '@/lib/ethers';
import { useEffect, useState } from 'react';

const Tokens = () => {
	const [tokens, setTokens] = useState<TokenInfo[]>([]);

	const getAllTokens = async () => {
		const tokens = await listTokens();
		setTokens(tokens);
	};

	useEffect(() => {
		getAllTokens();
	}, []);

	return (
		<div className="p-4">
			<h1 className="mb-4 flex h-10 scroll-m-20 items-center space-x-4 text-4xl font-extrabold tracking-tight lg:text-5xl">
				Tokens gerados pela comunidade de usuários!
			</h1>

			<div className="grid gap-2">
				{tokens.map((token) => (
					<TokenCard key={token.id} token={token} />
				))}
			</div>
		</div>
	);
};

export default Tokens;
