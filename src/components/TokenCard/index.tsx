import { TokenInfo } from '@/lib/ethers';
import { ipfsBaseUrl } from '@/lib/ipfs';

interface TokenCardProps {
	token: TokenInfo;
	onTokenClick?: Function;
}

const TokenCard = ({ token }: TokenCardProps) => {
	return (
		<div className="rounded-lg border-solid border-2 border-gray-400 max-w-lg">
			<h2 className="mt-10 scroll-m-20 border-b border-b-slate-200 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 dark:border-b-slate-700">
				# {token.id}
			</h2>

			<div className="text-right">
				<h3 className="mt-2 scroll-m-20 text-2xl font-semibold tracking-tight">
					{token.title}
				</h3>

				<p className="leading-7 [&:not(:first-child)]:mt-2">
					{token.description}
				</p>

				<p className="leading-7 [&:not(:first-child)]:mt-2">
					{token.creationDate.toString()}
				</p>

				<a href={ipfsBaseUrl + token.uri}>{ipfsBaseUrl + token.uri}</a>
			</div>
		</div>
	);
};

export default TokenCard;
