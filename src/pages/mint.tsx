import { getPrimaryAccountAddress, mintToken } from '@/utils/ethers';
import { useState } from 'react';
import * as IPFS from 'ipfs-core';
import styles from '@/styles/mint.module.scss';

export default function Mint() {
	const [text, setText] = useState('');

	const onClickMint = async () => {
		try {
			const ipfs = await IPFS.create();
			const { path } = await ipfs.add(text);

			ipfs.stop();

			mintToken({ address: await getPrimaryAccountAddress(), uri: path });
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<>
			<div className={styles.mainContainer}>
				<textarea
					value={text}
					onChange={(event) => setText(event.target.value)}
				/>

				<button onClick={onClickMint}>Mint</button>
			</div>
		</>
	);
}
