import { TokenInfo } from '@/lib/ethers';
import { ipfsBaseUrl } from '@/lib/ipfs';

interface TokenCardProps {
	token: TokenInfo;
	onTokenClick?: Function;
}

const TokenCard = ({ token }: TokenCardProps) => {
	return (
		<div>
			<h2># {token.id}</h2>
			<h3>{token.title}</h3>

			<p>{token.description}</p>

			<p>{token.creationDate.toString()}</p>

			<a href={ipfsBaseUrl + token.uri}>{ipfsBaseUrl + token.uri}</a>
		</div>
	);
};

export default TokenCard;
