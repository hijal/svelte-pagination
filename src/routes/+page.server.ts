import type { User } from '../types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, fetch }) => {
	const queryParams = new URLSearchParams({ limit: '10' });
	const page = url.searchParams.get('page') ?? '1';
	queryParams.set('page', page);

	try {
		const response = await fetch(`https://fakestoreapi.in/api/users?${queryParams.toString()}`);

		if (!response.ok) {
			throw new Error(`Failed to fetch users: HTTP status ${response.status}`);
		}

		const data = await response.json();
		const users: User[] = data.users;
		const has_more = +page < 5;

		return {
			users,
			has_more
		};
	} catch (error) {
		console.error(error);
		throw error;
	}
};
