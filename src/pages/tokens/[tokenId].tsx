import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
	acceptBuyingRequest,
	BuyingRequest,
	buyToken,
	cancelBuyingRequest,
	cancelSellingListing,
	createBuyingRequest,
	createSellingListing,
	getBuyingRequests,
	getTokenById,
	shortenAddress,
	TokenInfo
} from '@/lib/ethers';
import { retrieveData } from '@/lib/ipfs';
import { useEthersStore } from '@/stores/ethers';
import {
	Clock,
	List,
	Megaphone,
	ShoppingBag,
	ShoppingCart,
	Trash,
	User
} from 'lucide-react';
import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';
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
import { CallExceptionError, formatEther, isCallException } from 'ethers';
import { toast } from '@/components/ui/use-toast';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

const TokenContext = createContext<TokenInfo>({} as TokenInfo);

const ListOffersSheet = () => {
	const token = useContext(TokenContext);
	const [buyingRequests, setBuyingRequests] = useState<BuyingRequest[]>([]);
	const { userAddress } = useEthersStore();

	const getRequests = async (tokenId: number) => {
		if (isNaN(tokenId)) return;

		const requests = await getBuyingRequests({ tokenId });
		setBuyingRequests(requests);
	};

	const accept = (requestId: number) => {
		acceptBuyingRequest({
			requestId,
			tokenId: token.id
		});
	};

	const cancel = (requestId: number) => {
		cancelBuyingRequest({
			requestId,
			tokenId: token.id
		});
	};

	useEffect(() => {
		getRequests(token.id);
	}, [token.id]);

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
										{formatEther(buyingRequest.offer)}
									</div>
									<div className="align-center flex items-center justify-center">
										<Clock className="h-4" />
										{formatDistance(buyingRequest.creationDate, new Date(), {
											locale: ptBR
										})}
									</div>
									{token.owner === userAddress && (
										<Button onClick={() => accept(buyingRequest.id)}>
											Aceitar oferta
										</Button>
									)}
									{buyingRequest.buyer === userAddress && (
										<Button
											variant="destructive"
											onClick={() => cancel(buyingRequest.id)}
										>
											Cancelar oferta
										</Button>
									)}
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

const MakeOfferDialog = () => {
	const token = useContext(TokenContext);
	interface FormData {
		amount: number;
	}

	const { register, handleSubmit } = useForm<FormData>();

	const onSubmit = handleSubmit(async (data) => {
		try {
			await createBuyingRequest({ tokenId: token.id, amount: data.amount });
			toast({
				title: 'Oferta enviada com sucesso!',
				description: 'Aguarde a confirmação da transação!'
			});
		} catch (error) {
			let msg = 'Erro não identificado.';

			if (isCallException(error)) {
				msg = (error as CallExceptionError).reason || msg;
			}

			toast({
				title: 'Erro ao enviar oferta!',
				description: msg,
				variant: 'destructive'
			});
		}
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
								step="any"
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
	const token = useContext(TokenContext);
	const [dialogOpen, setDialogOpen] = useState(false);

	interface FormData {
		amount: number;
	}

	const { register, handleSubmit } = useForm<FormData>();

	const onSubmit = handleSubmit(async (data) => {
		try {
			await createSellingListing({ tokenId: token.id, amount: data.amount });
			toast({
				title: 'Anúncio enviado com sucesso!',
				description: 'Aguarde a confirmação da transação!'
			});
		} catch (error) {
			toast({
				title: 'Erro ao enviar anúncio!',
				description: 'Houve um erro ao realizar o envio da transação!',
				variant: 'destructive'
			});
		}
		setDialogOpen(false);
	});

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild>
				<Button className="flex gap-2">
					Fazer um anúncio <Megaphone />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<form onSubmit={onSubmit}>
					<DialogHeader>
						<DialogTitle>Faça um anúncio!</DialogTitle>
						<DialogDescription>
							Insira a quantia pela qual está disposto a vender os direitos
							sobre este texto
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="name" className="text-right">
								Quantia
							</Label>
							<Input
								type="number"
								step="any"
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
						<Button type="submit">Anunciar</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

const BuyNowDialog = () => {
	const token = useContext(TokenContext);
	const [dialogOpen, setDialogOpen] = useState(false);

	const onClickBuy = () => {
		buyToken({ tokenId: token.id, amount: token.sellingListing.price });
		setDialogOpen(false);
	};

	if (!token.sellingListing?.price) {
		return <></>;
	}

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild>
				<Button className="flex gap-2" variant="approval">
					Comprar
					<ShoppingCart />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Comprar o token agora!</DialogTitle>
					<DialogDescription>
						O proprietário deste token está disposto a vende-lo imediatamente
						por:
					</DialogDescription>
				</DialogHeader>
				<div className="align-center flex w-full scroll-m-20 items-center justify-center text-2xl font-semibold tracking-tight">
					<FaEthereum /> {formatEther(token.sellingListing?.price)}
				</div>
				<DialogFooter>
					<Button variant="approval" onClick={onClickBuy}>
						Comprar
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

const DeleteSellingListDialog = () => {
	const token = useContext(TokenContext);
	const [dialogOpen, setDialogOpen] = useState(false);

	const onClickDelete = () => {
		cancelSellingListing({ tokenId: token.id });
		setDialogOpen(false);
	};

	const onClickCancel = () => {
		setDialogOpen(false);
	};

	if (!token.sellingListing.price) {
		return <></>;
	}

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild>
				<Button className="flex gap-2" variant="destructive">
					Excluir anúncio de venda
					<Trash />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Deseja excluir o anúncio?</DialogTitle>
					<DialogDescription>
						Este token está disponível para venda pela quantia de:
					</DialogDescription>
				</DialogHeader>
				<div className="align-center flex w-full scroll-m-20 items-center justify-center text-2xl font-semibold tracking-tight">
					<FaEthereum /> {formatEther(token.sellingListing.price)}
				</div>
				<DialogFooter>
					<Button
						className="flex gap-2"
						variant="destructive"
						onClick={onClickDelete}
					>
						Excluir <Trash />
					</Button>
					<Button variant="subtle" onClick={onClickCancel}>
						Cancelar
					</Button>
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

	const getSellingListing = async () => {
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
		getSellingListing();
	}, [tokenId]);

	useEffect(() => {
		getText();
	}, [tokenInfo.uri]);

	return (
		<div className="align-center flex w-screen flex-col items-center justify-center gap-10 p-6">
			<h1 className="flex h-10 scroll-m-20 items-center space-x-4 text-3xl font-extrabold tracking-tight lg:text-4xl">
				<span># {tokenInfo.id}</span>
				<Separator orientation="vertical" />
				<span>{tokenInfo.title}</span>
			</h1>

			<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
				Owned by: {shortenAddress(tokenInfo.owner || '')}
			</h3>

			<div className="align-center flex items-center justify-center gap-2">
				<TokenContext.Provider value={tokenInfo}>
					{tokenInfo.owner !== userAddress ? (
						<>
							<BuyNowDialog />
							<MakeOfferDialog />
						</>
					) : (
						<>
							<DeleteSellingListDialog />
							<SellTokenDialog />
						</>
					)}
					<ListOffersSheet />
				</TokenContext.Provider>
			</div>

			<div>
				<h2 className="mt-10 scroll-m-20 border-b border-b-slate-200 pb-2 text-center text-2xl font-semibold tracking-tight transition-colors first:mt-0 dark:border-b-slate-700">
					{tokenInfo.description}
				</h2>

				<article className="w-full text-justify">
					<ReactMarkdown>{text}</ReactMarkdown>
				</article>
			</div>
		</div>
	);
};

export default TokenInfoPage;
