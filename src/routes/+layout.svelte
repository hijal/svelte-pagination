<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="my-10 min-h-screen">
	<div class="flex justify-center">
		{@render children()}
	</div>
</div>
