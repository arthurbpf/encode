import { TokenInfo } from '@/utils/ethers';
import { ipfsBaseUrl } from '@/utils/ipfs';

interface TokenCardProps {
	token: TokenInfo;
	onTokenClick?: Function;
}

const TokenCard = ({ token }: TokenCardProps) => {
	return (
		<div>
			<h3>{token.id}</h3>
			{ipfsBaseUrl + token.uri}
		</div>
	);
};

export default TokenCard;
