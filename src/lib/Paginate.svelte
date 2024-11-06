<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { ArrowLeft, ArrowRight } from 'lucide-svelte';

	const dispatch = createEventDispatcher();

	interface PaginationParams {
		limit?: number;
		starting_after?: number;
		ending_after?: number;
		page?: number;
	}
	interface Props {
		page: number;
		hasMore: boolean;
		params: PaginationParams;
		onUpdateParams: (params: PaginationParams) => void;
		firstId: number | undefined;
		lastId: number | undefined;
	}

	let { page, params, onUpdateParams, firstId, lastId, hasMore }: Props = $props();

	const prevPage = async (e: Event) => {
		e.preventDefault();
		const newPage = page - 1;

		if (firstId) {
			const updatedParams = {
				...params,
				page: newPage,
				ending_before: firstId,
				starting_after: undefined
			};

			onUpdateParams(updatedParams);
			dispatch('pageChange', { newPage });
		}
	};

	const nextPage = (e: Event) => {
		e.preventDefault();
		const newPage = page + 1;

		if (lastId) {
			const updatedParams = {
				...params,
				page: newPage,
				starting_after: lastId,
				ending_before: undefined
			};

			onUpdateParams(updatedParams);
			dispatch('pageChange', { newPage });
		}
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
