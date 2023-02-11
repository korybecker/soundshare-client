import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

import axios from 'axios';

export const useSignup = () => {
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState<boolean | null>(null);

	const { dispatch } = useAuthContext();

	const signup = async (data) => {
		// const { email, name, username, password } = formState;
		setIsLoading(true);
		setError(null);

		axios
			.post(`${process.env.SERVER_URL}/api/v1/user/signup`, data, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})
			.then((res) => {
				dispatch({ type: 'LOGIN', payload: res });
				setIsLoading(false);
			})
			.catch((err) => console.error(err));
	};
	return { signup, isLoading, error };
};
