<script lang="ts">
	import { page } from '$app/stores';
	import {
		Autocomplete,
		getModalStore,
		type AutocompleteOption,
		type PopupSettings,
		popup
	} from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	export let parent: any;

	const modalStore = getModalStore();
	// const JobForm: SuperValidated<ClientSchema> = $page.data.JobForm;

	const clientOptions: AutocompleteOption<string>[] = $page.data.clientList.map((c) => ({
		label: `${c.first_name} ${c.last_name}`,
		value: c.id
	}));

	let selectedSearch = { label: '', value: '' };

	let offsetWidth = 0;

	$: search = `card max-h-60 overflow-auto w-[${offsetWidth + 'px'}]`;

	$: console.log(offsetWidth);

	const popupClient: PopupSettings = {
		event: 'focus-blur',
		target: 'client-popup',
		placement: 'bottom'
	};
</script>

{#if $modalStore[0]}
	<div class="card p-4 w-modal shadow-xl space-y-4">
		<h2 class="h2">{$modalStore[0].title}</h2>
		<form class="grid lg:grid-cols-2 gap-4" action="?/CreateClient" method="post">
			<div bind:offsetWidth>
				<input type="text" style="display:none" />

				<input
					class="input variant-form-material"
					type="search"
					autocomplete="off"
					id="client-search"
					bind:value={selectedSearch.label}
					use:popup={popupClient}
					placeholder="Select Client"
				/>
				<div data-popup="client-popup" class=" w-full">
					<div class={search}>
						<Autocomplete
							bind:input={selectedSearch.label}
							options={clientOptions}
							on:selection={(e) => {
								selectedSearch.value = e.detail.value;
								selectedSearch.label = e.detail.label;
							}}
						/>
					</div>
				</div>
				<!-- {#if $errors.first_name}
					<span class="text-xs text-red-500">{$errors.first_name}</span>{/if} -->
			</div>
		</form>
		<footer class="modal-footer float-right">
			<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}
				>{parent.buttonTextCancel}</button
			>
			<button type="submit" class="btn {parent.buttonPositive}">Submit Form</button>
		</footer>
	</div>
{/if}
