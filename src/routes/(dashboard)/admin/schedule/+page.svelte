<script lang="ts">
	import dayjs from 'dayjs';
	import Calendar from '$lib/components/Calendar.svelte';
	let date = dayjs();
</script>

<div class="card p-4 h-full w-60 flex flex-col gap-2">
	<button class="btn variant-form-material w-full btn-sm"> Create Schedule </button>
	<Calendar bind:date />
</div>
