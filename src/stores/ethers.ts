import { create } from 'zustand';
import { signer } from '../utils/ethers';

interface EthersStore {
	userAddress: string;
	getTrimmedUserAddress(): string;
	fetch: Function;
}

export const useEthersStore = create<EthersStore>((set, get) => ({
	userAddress: '',
	getTrimmedUserAddress: () => {
		return get().userAddress.substring(0, 7) + '...';
	},
	fetch: async () => {
		set({ userAddress: await signer?.getAddress() });
	}
}));
