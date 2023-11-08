<script lang="ts">
	import dayjs from 'dayjs';
	import Calendar from '$lib/components/Calendar.svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';

	const modalStore = getModalStore();
	const newScheduleModal = () => {
		modalStore.trigger({ type: 'component', component: 'ScheduleModal', title: 'Scheduler' });
	};

	let date = dayjs();
</script>

<div class="card p-4 h-full w-60 flex flex-col gap-2">
	<button class="btn variant-form-material w-full btn-sm" on:click={newScheduleModal}>
		Create Schedule
	</button>
	<Calendar bind:date />
</div>
