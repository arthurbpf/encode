import { TokenInfo } from '@/lib/ethers';
import { Clock } from 'lucide-react';
import { formatDistance } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Link from 'next/link';

interface TokenCardProps {
	token: TokenInfo;
	onTokenClick?: Function;
}

const TokenCard = ({ token }: TokenCardProps) => {
	return (
		<Link href={`/tokens/${token.id}`}>
			<div className="max-w-sm rounded-lg border-2 border-solid border-gray-400 text-center">
				<h2 className="mt-10 scroll-m-20 border-b border-b-slate-200 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 dark:border-b-slate-700">
					# {token.id}
				</h2>

				<h3 className="mt-2 scroll-m-20 text-2xl font-semibold tracking-tight">
					{token.title}
				</h3>

				<p className="leading-7 [&:not(:first-child)]:mt-2">
					{token.description}
				</p>

				<span className="flex items-center justify-center gap-2 leading-7 [&:not(:first-child)]:mt-2">
					<Clock />{' '}
					{formatDistance(token.creationDate, new Date(), { locale: ptBR })}
				</span>
			</div>
		</Link>
	);
};

export default TokenCard;
