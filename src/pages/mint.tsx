import { getPrimaryAccountAddress, mintToken } from '@/lib/ethers';
import { useState } from 'react';
import { sendData } from '@/lib/ipfs';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Hammer } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function Mint() {
	const [text, setText] = useState('');
	const [mintToThirdParty, setMintToThirdParty] = useState(false);
	const [thirdPartyAdd, setThirdPartyAdd] = useState('');
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const { toast } = useToast();

	const onClickMint = async () => {
		try {
			const ipfs = await sendData(text);

			await mintToken({
				address: mintToThirdParty
					? thirdPartyAdd
					: await getPrimaryAccountAddress(),
				uri: ipfs,
				title: title,
				description: description
			});

			toast({
				title: 'Token criado com sucesso',
				description:
					'Solicitação enviada com sucesso, aguarde a confirmação da transação!'
			});
		} catch (error) {
			toast({
				variant: 'destructive',
				title: 'Erro ao criar o token',
				description: 'Não foi possível criar o token, tente novamente.'
			});
		}
	};

	return (
		<>
			<div className="flex h-full flex-grow flex-col gap-5 p-10 font-sans">
				<div>
					<div className="flex items-center justify-center gap-2">
						<Checkbox
							id="mintToThirdParty"
							onCheckedChange={(state) => setMintToThirdParty(!!state)}
							checked={mintToThirdParty}
						/>
						<label htmlFor="mintToThirdParty">
							Deseja enviar o token para uma outra conta?
						</label>
					</div>

					{mintToThirdParty && (
						<Input
							type="text"
							placeholder="Endereço da conta"
							value={thirdPartyAdd}
							onChange={(event) => setThirdPartyAdd(event.target.value)}
						/>
					)}
				</div>

				<div className="flex flex-row gap-2">
					<Input
						placeholder="Título"
						value={title}
						onChange={(event) => setTitle(event.target.value)}
					/>
					<Input
						placeholder="Descrição"
						value={description}
						onChange={(event) => setDescription(event.target.value)}
					/>
				</div>

				<Textarea
					className="flex-grow"
					placeholder="Digite o texto aqui"
					value={text}
					onChange={(event) => setText(event.target.value)}
				/>

				<Button onClick={onClickMint}>
					Mint <Hammer className="ml-2" />
				</Button>
			</div>
		</>
	);
}
