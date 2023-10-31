<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	export let data;

	const modalStore = getModalStore();

	const newJobModal = () => {
		modalStore.trigger({ type: 'component', component: 'JobModal', title: 'Create Job' });
	};
</script>

<div class="flex sticky top-0 flex-row card w-full rounded-sm items-center p-4 gap-4 z-10">
	<button class="btn variant-outline-secondary variant-form-material" on:click={newJobModal}
		>New Job</button
	>
	<input placeholder="Search" class="input variant-form-material" />
</div>
