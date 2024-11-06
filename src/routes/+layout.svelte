<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="my-10 min-h-screen">
	<div class="flex justify-center">
		<div class="container px-8">
			{@render children()}
		</div>
	</div>
</div>
