import { getPrimaryAccountAddress, mintToken } from '@/utils/ethers';
import { useState } from 'react';
import styles from '@/styles/mint.module.scss';
import { sendData } from '@/utils/ipfs';
import { Input } from '@/components/Primitives/Input';

export default function Mint() {
	const [text, setText] = useState('');
	const [mintToThirdParty, setMintToThirdParty] = useState(false);
	const [thirdPartyAdd, setThirdPartyAdd] = useState('');
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');

	const onClickMint = async () => {
		try {
			const ipfs = await sendData(text);

			mintToken({
				address: mintToThirdParty
					? thirdPartyAdd
					: await getPrimaryAccountAddress(),
				uri: ipfs,
				title: title,
				description: description
			});

			//TODO: Add a success message!
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className={styles.mainContainer}>
			<div>
				<div>
					<Input
						type="checkbox"
						id="mintToThirdParty"
						checked={mintToThirdParty}
						onChange={() => {
							setMintToThirdParty((state) => !state);
						}}
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

			<div>
				<Input
					value={title}
					onChange={(event) => setTitle(event.target.value)}
				/>
				<Input
					value={description}
					onChange={(event) => setDescription(event.target.value)}
				/>
			</div>

			<textarea
				value={text}
				onChange={(event) => setText(event.target.value)}
			/>

			<button onClick={onClickMint}>Mint</button>
		</div>
	);
}
