import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { useEthersStore, getTrimmedUserAddress } from '@/stores/ethers';
import { connectWallet } from '@/lib/ethers';

const AvatarPill = () => {
	const userAddress = useEthersStore((state) => state.userAddress);
	const isLoggedIn = !!userAddress;

	const avatarInfo = {
		src: isLoggedIn ? '/user.svg' : 'lock.svg',
		alt: isLoggedIn ? 'User' : 'Lock'
	};

	const AvatarComponent = () => {
		return (
			<div className="flex items-center gap-2">
				<Avatar>
					<AvatarImage src={avatarInfo.src} alt={avatarInfo.alt} />
					<AvatarFallback>CN</AvatarFallback>
				</Avatar>

				<span>{getTrimmedUserAddress()}</span>
			</div>
		);
	};

	return isLoggedIn ? (
		<Link href={`${userAddress}/tokens`}>
			<AvatarComponent />
		</Link>
	) : (
		<div className="cursor-pointer" onClick={connectWallet}>
			<AvatarComponent />
		</div>
	);
};

const Navbar = () => {
	return (
		<nav>
			<div className="align-center flex items-center justify-between p-4">
				<div className="align-center flex items-center justify-center gap-10 text-xl font-semibold tracking-tight">
					<Link href="/">Home</Link>
					<Link href="/mint">Mint</Link>
					<Link href="/tokens">Tokens</Link>
				</div>

				<AvatarPill />
			</div>
			<Separator />
		</nav>
	);
};

export default Navbar;
