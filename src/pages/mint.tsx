import { getPrimaryAccountAddress, mintToken } from '@/utils/ethers';
import { useState } from 'react';
import * as IPFS from 'ipfs-core';
import styles from '@/styles/mint.module.scss';

export default function Mint() {
	const [text, setText] = useState('');
	const [mintToThirdParty, setMintToThirdParty] = useState(false);
	const [thirdPartyAdd, setThirdPartyAdd] = useState('');

	const onClickMint = async () => {
		try {
			const ipfs = await IPFS.create();
			const { path } = await ipfs.add(text);

			ipfs.stop();

			mintToken({
				address: mintToThirdParty
					? thirdPartyAdd
					: await getPrimaryAccountAddress(),
				uri: path
			});
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className={styles.mainContainer}>
			<div>
				<div>
					<input
						type="checkbox"
						id="mintToThirdParty"
						checked={mintToThirdParty}
						onChange={(value) => {
							console.log(value.target.value);
							setMintToThirdParty((state) => !state);
						}}
					/>
					<label htmlFor="mintToThirdParty">
						Deseja enviar o token para uma outra conta?
					</label>
				</div>

				{mintToThirdParty && (
					<input
						type="text"
						placeholder="Endereço da conta"
						value={thirdPartyAdd}
						onChange={(event) => setThirdPartyAdd(event.target.value)}
					/>
				)}
			</div>

			<textarea
				value={text}
				onChange={(event) => setText(event.target.value)}
			/>

			<button onClick={onClickMint}>Mint</button>
		</div>
	);
}
