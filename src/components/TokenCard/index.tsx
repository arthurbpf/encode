import { TokenInfo } from '@/lib/ethers';
import { Clock, ShoppingBag } from 'lucide-react';
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
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '../ui/tooltip';

interface TokenCardProps {
	token: TokenInfo;
	onTokenClick?: Function;
}

const BuyNowBadge = () => {
	return (
		<div className="rounded-md bg-green-500 p-1 text-white">
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>
						<ShoppingBag />
					</TooltipTrigger>
					<TooltipContent>
						<p>Token disponível para compra imediata</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
};

const TokenCard = ({ token }: TokenCardProps) => {
	return (
		<Link href={`/tokens/${token.id}`}>
			<Card>
				<CardHeader>
					<CardTitle className="flex justify-between">
						<div>
							# {token.id} - {token.title}
						</div>

						{!!token.sellingListing?.price && <BuyNowBadge />}
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
