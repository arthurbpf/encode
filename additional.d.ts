interface Window {
	ethereum: any;
}

declare namespace NodeJS {
	export interface ProcessEnv {
		readonly NEXT_PUBLIC_CONTRACT_ADDRESS: string;
	}
}
