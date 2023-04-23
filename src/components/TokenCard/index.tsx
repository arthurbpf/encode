import { TokenInfo } from '@/lib/ethers';
import { Clock } from 'lucide-react';
import { formatDistance } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Link from 'next/link';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card';

interface TokenCardProps {
	token: TokenInfo;
	onTokenClick?: Function;
}

const TokenCard = ({ token }: TokenCardProps) => {
	return (
		<Link href={`/tokens/${token.id}`}>
			<Card>
				<CardHeader>
					<CardTitle>
						# {token.id} - {token.title}
					</CardTitle>
					<CardDescription>{token.description}</CardDescription>
				</CardHeader>
				<CardContent>
					<p>
						<span className="flex items-center justify-center gap-2 leading-7 [&:not(:first-child)]:mt-2">
							<Clock />{' '}
							{formatDistance(token.creationDate, new Date(), { locale: ptBR })}
						</span>
					</p>
				</CardContent>
			</Card>
		</Link>
	);
};

export default TokenCard;
