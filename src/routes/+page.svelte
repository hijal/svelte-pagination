<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types.js';
	import Paginate from '$lib/Paginate.svelte';
	import type { PaginationParams, User } from '../types.js';

	interface Props {
		data: PageData;
	}

	const { data }: Props = $props();
	const users = $derived(data.users);
	const hasMore = $derived(data.has_more);

	let page = $state(1);
	let firstId = $state<number>();
	let lastId = $state<number>();
	let isLoading = $state(false);

	const tableColumns = [
		{ key: 'id', label: 'ID' },
		{ key: 'email', label: 'Email' },
		{ key: 'username', label: 'Username' },
		{ key: 'name.firstname', label: 'First Name' },
		{ key: 'name.lastname', label: 'Last Name' },
		{ key: 'address.city', label: 'City' },
		{ key: 'address.street', label: 'Street' },
		{ key: 'address.number', label: 'Number' },
		{ key: 'address.zipcode', label: 'Zip Code' },
		{ key: 'address.geolocation.lat', label: 'Latitude' },
		{ key: 'address.geolocation.long', label: 'Longitude' },
		{ key: 'phone', label: 'Phone' }
	];

	const params: PaginationParams = $state({
		limit: 10
	});

	function getNestedValue<T, K extends keyof T>(obj: T, path: K): T[K] | undefined;
	function getNestedValue<T>(obj: T, path: string): unknown {
		const pathArray = path.split('.');
		return pathArray.reduce((acc, part) => {
			if (!acc) return acc;
			return (acc as any)[part];
		}, obj);
	}

	async function updateUrlParams(newParams: Partial<PaginationParams>) {
		isLoading = true;
		try {
			const url = new URL(window.location.href);
			const currentParams = new URLSearchParams();

			Object.entries({ ...params, ...newParams }).forEach(([key, value]) => {
				if (value !== undefined) {
					currentParams.set(key, value.toString());
				}
			});

			url.search = currentParams.toString();
			await goto(url.toString(), { replaceState: true });
		} catch (error) {
			console.error('Error updating URL parameters:', error);
		} finally {
			isLoading = false;
		}
	}

	function handlePageChange(e: CustomEvent<{ newPage: number }>) {
		page = e.detail.newPage;
	}

	$effect(() => {
		if (users.length > 0) {
			firstId = users[0].id;
			lastId = users[users.length - 1].id;
		}

		if (page > 1) {
			updateUrlParams({
				starting_after: lastId,
				ending_after: firstId,
				page,
				...params
			});
		} else {
			goto(window.location.pathname, { replaceState: true });
		}
	});
</script>

<div class="flex flex-col flex-wrap justify-center gap-3">
	{#if isLoading}
		<div class="flex justify-center p-4">
			<div class="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
		</div>
	{/if}

	<div class="my-6 flex items-center justify-between border-b pb-2 capitalize">
		<div>
			<p>Current Page: <span class="font-bold">{page}</span></p>
			<p>Records: <span class="font-bold">{users.length}</span></p>
		</div>
		<div>
			<p>First ID: <span class="text-blue-500">{firstId}</span></p>
			<p>Last ID: <span class="text-blue-500">{lastId}</span></p>
		</div>
	</div>

	<div class="overflow-x-auto rounded-lg shadow-md">
		<table class="max-h-screen min-w-full divide-y divide-gray-200">
			<thead class="bg-gray-50">
				<tr>
					{#each tableColumns as column}
						<th
							class="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100"
						>
							{column.label}
						</th>
					{/each}
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-200 bg-white">
				{#each users as user (user.id)}
					<tr class="transition-colors hover:bg-gray-50">
						{#each tableColumns as column}
							<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
								{getNestedValue(user, column.key as keyof User)}
							</td>
						{/each}
					</tr>
				{/each}
				{#if users.length === 0}
					<tr>
						<td colspan={tableColumns.length} class="px-6 py-4 text-center text-gray-500">
							No users found
						</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>

	<div class="mt-4">
		<Paginate
			{page}
			{hasMore}
			{params}
			onUpdateParams={updateUrlParams}
			on:pageChange={handlePageChange}
			{firstId}
			{lastId}
		/>
	</div>
</div>
