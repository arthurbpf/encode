import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
	BuyingRequest,
	createBuyingRequest,
	getBuyingRequests,
	getTokenById,
	shortenAddress,
	TokenInfo
} from '@/lib/ethers';
import { retrieveData } from '@/lib/ipfs';
import { useEthersStore } from '@/stores/ethers';
import { Clock, List, Megaphone, ShoppingBag, User } from 'lucide-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from '@/components/ui/sheet';
import { useForm } from 'react-hook-form';
import { formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FaEthereum } from 'react-icons/fa';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface ListOffersSheetProps {
	tokenId: number;
}

const ListOffersSheet = ({ tokenId }: ListOffersSheetProps) => {
	const [buyingRequests, setBuyingRequests] = useState<BuyingRequest[]>([]);

	const getRequests = async (tokenId: number) => {
		if (isNaN(tokenId)) return;

		const requests = await getBuyingRequests({ tokenId });
		setBuyingRequests([
			...requests,
			...requests,
			...requests,
			...requests,
			...requests,
			...requests,
			...requests,
			...requests,
			...requests,
			...requests,
			...requests,
			...requests,
			...requests
		]);
	};

	useEffect(() => {
		getRequests(tokenId);
	}, [tokenId]);

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button className="flex gap-2">
					Listar ofertas de compra
					<List />
				</Button>
			</SheetTrigger>
			<SheetContent position="right" size="sm" className="flex flex-col">
				<SheetHeader>
					<SheetTitle>Ofertas de compra</SheetTitle>
					<SheetDescription>
						Veja aqui as ofertas para esse token.
					</SheetDescription>
				</SheetHeader>
				<ScrollArea>
					<div className="grid p-6">
						{buyingRequests.map((buyingRequest, index) => (
							<div key={index}>
								{index > 0 && <Separator className="my-4" />}
								<div className="flex flex-col">
									<div># {buyingRequest.id}</div>
									<div className="align-center flex items-center justify-center">
										<User />
										{shortenAddress(buyingRequest.buyer)}
									</div>
									<div className="align-center flex items-center justify-center">
										<FaEthereum />
										{buyingRequest.offer}
									</div>
									<div className="align-center flex items-center justify-center">
										<Clock className="h-4" />
										{formatDistance(buyingRequest.creationDate, new Date(), {
											locale: ptBR
										})}
									</div>
									<Button>Aceitar oferta</Button>
								</div>
							</div>
						))}
					</div>
					<ScrollBar />
				</ScrollArea>
			</SheetContent>
		</Sheet>
	);
};

interface MakeOfferDialogProps {
	tokenId: number;
}

const MakeOfferDialog = ({ tokenId }: MakeOfferDialogProps) => {
	interface FormData {
		amount: number;
	}

	const { register, handleSubmit } = useForm<FormData>();

	const onSubmit = handleSubmit((data) => {
		createBuyingRequest({ tokenId, amount: data.amount });
	});

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="flex gap-2">
					Fazer uma oferta <ShoppingBag />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<form onSubmit={onSubmit}>
					<DialogHeader>
						<DialogTitle>Faça uma oferta!</DialogTitle>
						<DialogDescription>
							Insira a quantia que estiver disposto a pagar pelos direitos de
							posse do conteúdo.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="name" className="text-right">
								Quantia
							</Label>
							<Input
								type="number"
								{...register('amount', {
									min: 0,
									required: true,
									valueAsNumber: true
								})}
								className="col-span-3"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button type="submit">Fazer oferta</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

const SellTokenDialog = () => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="flex gap-2">
					Criar anúncio de venda <Megaphone />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Faça uma oferta!</DialogTitle>
					<DialogDescription>
						Insira a quantia que estiver disposto a pagar pelos direitos de
						posse do conteúdo.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="name" className="text-right">
							Quantia
						</Label>
						<Input type="number" id="name" className="col-span-3" />
					</div>
				</div>
				<DialogFooter>
					<Button type="submit">Fazer oferta</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

const TokenInfoPage = () => {
	const { userAddress } = useEthersStore();
	const router = useRouter();
	const { tokenId } = router.query;
	const [tokenInfo, setTokenInfo] = useState<TokenInfo>({} as TokenInfo);
	const [text, setText] = useState('');

	const getTokenInfo = async () => {
		if (!tokenId) return;

		const tokenInfo = await getTokenById(Number(tokenId));
		setTokenInfo(tokenInfo);
	};

	const getText = async () => {
		if (!tokenInfo.uri) return;

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

			<div className="align-center mt-10 flex items-center justify-center gap-2">
				{tokenInfo.owner !== userAddress ? (
					<MakeOfferDialog tokenId={Number(tokenId)} />
				) : (
					<SellTokenDialog />
				)}
				<ListOffersSheet tokenId={Number(tokenId)} />
			</div>

			<h2 className="mt-10 scroll-m-20 border-b border-b-slate-200 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 dark:border-b-slate-700">
				{tokenInfo.description}
			</h2>

			<article className="w-full text-justify">{text}</article>
		</div>
	);
};

export default TokenInfoPage;
