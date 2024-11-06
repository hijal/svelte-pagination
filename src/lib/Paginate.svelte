<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { ArrowLeft, ArrowRight } from 'lucide-svelte';
	import type { PaginationParams } from '../types';

	const dispatch = createEventDispatcher();

	interface Props {
		page: number;
		hasMore: boolean;
		params: PaginationParams;
		onUpdateParams: (params: PaginationParams) => void;
	}

	let { page, params, onUpdateParams, hasMore }: Props = $props();
	$inspect(params);

	const prevPage = async (e: Event) => {
		e.preventDefault();
		const newPage = page - 1;

		const updatedParams = {
			...params,
			page: newPage
		};

		onUpdateParams(updatedParams);
		dispatch('pageChange', { newPage });
	};

	const nextPage = (e: Event) => {
		e.preventDefault();
		const newPage = page + 1;

		const updatedParams = {
			...params,
			page: newPage
		};

		onUpdateParams(updatedParams);
		dispatch('pageChange', { newPage });
	};
</script>

<div class="join flex items-center justify-end gap-1">
	<div class="flex items-center gap-2">
		<span>Page {page}</span>
		<div class="join">
			<button
				type="button"
				class="btn join-item btn-sm {page <= 1 ? 'btn-disabled' : ''}"
				onclick={prevPage}
			>
				<ArrowLeft size={16} />
			</button>
			<button
				type="button"
				class="btn join-item btn-sm {!hasMore ? 'btn-disabled' : ''}"
				onclick={nextPage}
			>
				<ArrowRight size={16} />
			</button>
		</div>
	</div>
</div>
