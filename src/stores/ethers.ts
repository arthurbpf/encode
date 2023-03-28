import { create } from 'zustand';

interface EthersStore {
	userAddress: string;
	setUserAddress: (userAddress: string) => void;
	getTrimmedUserAddress(): string;
}

export const useEthersStore = create<EthersStore>((set, get) => ({
	userAddress: '',
	setUserAddress: (userAddress) => set({ userAddress }),
	getTrimmedUserAddress: () => {
		return get().userAddress.substring(0, 7) + '...';
	}
}));

export const setUserAddress = useEthersStore.getState().setUserAddress;
