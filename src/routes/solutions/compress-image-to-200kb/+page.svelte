<script lang="ts">
	import CompressToKbPage from '$lib/components/CompressToKbPage.svelte';
	import { kbSizes } from '$lib/data/compressToKb';

	const size = kbSizes.find((s) => s.kb === 200)!;
</script>

<CompressToKbPage {size} />
