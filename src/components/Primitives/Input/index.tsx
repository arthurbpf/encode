import React from 'react';
import styles from './styles.module.scss';

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, ...props }, ref) => {
		return <input className={styles.main} ref={ref} {...props} />;
	}
);
Input.displayName = 'Input';

export { Input };
