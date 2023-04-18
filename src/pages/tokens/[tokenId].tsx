import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getTokenById, TokenInfo } from '@/lib/ethers';
import { retrieveData } from '@/lib/ipfs';
import { useEthersStore } from '@/stores/ethers';
import { ShoppingBag } from 'lucide-react';
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

const TokenInfoPage = () => {
	const { userAddress } = useEthersStore();
	const router = useRouter();
	const { tokenId } = router.query;
	const [tokenInfo, setTokenInfo] = useState<TokenInfo>({} as TokenInfo);
	const [text, setText] = useState('');

	const getTokenInfo = async () => {
		const tokenInfo = await getTokenById(Number(tokenId));
		setTokenInfo(tokenInfo);
	};

	const getText = async () => {
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

			{tokenInfo.owner !== userAddress && (
				<Dialog>
					<DialogTrigger asChild>
						<Button className="mt-10 flex gap-2">
							Fazer uma oferta <ShoppingBag />
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Fa</DialogTitle>
							<DialogDescription>
								Make changes to your profile here. Click save when you're done.
							</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="name" className="text-right">
									Name
								</Label>
								<Input id="name" value="Pedro Duarte" className="col-span-3" />
							</div>
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="username" className="text-right">
									Username
								</Label>
								<Input id="username" value="@peduarte" className="col-span-3" />
							</div>
						</div>
						<DialogFooter>
							<Button type="submit">Save changes</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}

			<h2 className="mt-10 scroll-m-20 border-b border-b-slate-200 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 dark:border-b-slate-700">
				{tokenInfo.description}
			</h2>

			<text className="w-full text-justify">{text}</text>
		</div>
	);
};

export default TokenInfoPage;
