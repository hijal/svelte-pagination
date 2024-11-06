<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types.js';
	import Paginate from '$lib/Paginate.svelte';

	interface Props {
		data: PageData;
	}

	const { data }: Props = $props();
	const users = $derived(data.users);

	let hasMore = $derived(data.has_more);
	let page = $state(1);

	let firstId = $state<number>();
	let lastId = $state<number>();

	// other params
	const params = $state({
		limit: 10
	});

	const updateUrlParams = async (params: { [key: string]: string | number | undefined }) => {
		const url = new URL(window.location.href);
		const currentParams = new URLSearchParams();

		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined) {
				currentParams.set(key, value.toString());
			}
		});

		url.search = currentParams.toString();
		await goto(url.toString(), { replaceState: true });
	};

	function handlePageChange(e: CustomEvent<{ newPage: number }>) {
		page = e.detail.newPage;
	}

	$effect(() => {
		if (users.length > 0) {
			firstId = users[0].id;
			lastId = users[users.length - 1].id;
		}

		if (page > 1) {
			updateUrlParams({ starting_after: lastId, ending_after: firstId, page, ...params });
		} else {
			goto(window.location.pathname, { replaceState: true });
		}
	});
</script>

{#snippet pagination()}
	<Paginate
		{page}
		{hasMore}
		{params}
		onUpdateParams={updateUrlParams}
		on:pageChange={handlePageChange}
		{firstId}
		{lastId}
	/>
{/snippet}

<div class="flex flex-col flex-wrap justify-center gap-3">
	<div class="border-b pb-2 capitalize">
		<p>ending_after: <span class="text-red-500">{firstId}</span></p>
		<p>starting_after: <span class="text-red-500">{lastId}</span></p>
	</div>
	<div class="overflow-x-auto">
		<table class="table table-zebra w-full">
			<thead>
				<tr class="bg-gray-200 text-gray-700">
					<th class="p-4">ID</th>
					<th class="p-4">Email</th>
					<th class="p-4">Username</th>
					<th class="p-4">Password</th>
					<th class="p-4">First Name</th>
					<th class="p-4">Last Name</th>
					<th class="p-4">City</th>
					<th class="p-4">Street</th>
					<th class="p-4">Number</th>
					<th class="p-4">Zip Code</th>
					<th class="p-4">Latitude</th>
					<th class="p-4">Longitude</th>
					<th class="p-4">Phone</th>
				</tr>
			</thead>
			<tbody>
				{#each users as user}
					<tr>
						<td class="p-4">{user.id}</td>
						<td class="p-4">{user.email}</td>
						<td class="p-4">{user.username}</td>
						<td class="p-4">{user.password}</td>
						<td class="p-4">{user.name.firstname}</td>
						<td class="p-4">{user.name.lastname}</td>
						<td class="p-4">{user.address.city}</td>
						<td class="p-4">{user.address.street}</td>
						<td class="p-4">{user.address.number}</td>
						<td class="p-4">{user.address.zipcode}</td>
						<td class="p-4">{user.address.geolocation.lat}</td>
						<td class="p-4">{user.address.geolocation.long}</td>
						<td class="p-4">{user.phone}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<div>
		{@render pagination()}
	</div>
</div>
