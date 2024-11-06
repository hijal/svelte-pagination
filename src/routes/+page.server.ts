import type { PageServerLoad } from './$types';

interface User {
	id: number;
	email: string;
	username: string;
	password: string;
	name: {
		firstname: string;
		lastname: string;
	};
	address: {
		city: string;
		street: string;
		number: string;
		zipcode: string;
		geolocation: {
			lat: number;
			long: number;
		};
	};
	phone: string;
}

export const load: PageServerLoad = async ({ url, fetch }) => {
	const query: Record<string, string | number> = {
		limit: 10
	};

	const page = url.searchParams.get('page');

	if (page) {
		query.page = page;
	}

	const response = await fetch(
		`https://fakestoreapi.in/api/users?limit=${query.limit}&page=${query.page || 1}`
	);

	const data = await response.json();
	const users: User[] = data.users;

	return {
		users,
		has_more: page && +page === 5 ? false : true
	};
};
