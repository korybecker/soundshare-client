import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

// change global state and remove jwt from local storage
export const useLogout = () => {
	const { dispatch } = useAuthContext();

	const logout = () => {
		localStorage.removeItem('user');
		dispatch({ type: 'LOGOUT' });
	};
	return { logout };
};
