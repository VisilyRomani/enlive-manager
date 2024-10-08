<script lang="ts">
	import '../app.postcss';
	import {
		AppShell,
		AppBar,
		getDrawerStore,
		initializeStores,
		Drawer,
		Toast,
		Modal,
		Avatar,
		ProgressRadial
	} from '@skeletonlabs/skeleton';
	import Navigation from '$lib/components/Navigation.svelte';
	import { onMount } from 'svelte';
	import { navigating } from '$app/stores';

	import ArrowBack from '$lib/photos/aback.svelte';

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
	import { modalRegistry } from '$lib/ModalRegistry';
	import { goto } from '$app/navigation';
	import { PUBLIC_GOOGLE_MAPS } from '$env/static/public';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
	initializeStores();
	const drawerStore = getDrawerStore();

	const navOpen = () => {
		drawerStore.open({});
	};

	$: classesSidebar =
		[
			'/signup',
			'/login',
			'/',
			'/admin/initial-setup',
			'/admin/initial-setup/create',
			'/admin/initial-setup/connect'
		].includes($page.url.pathname) && '!hidden';
	let mapsScript;

	onMount(() => {
		const script = document.createElement('script');
		script.src = `https://maps.googleapis.com/maps/api/js?key=${PUBLIC_GOOGLE_MAPS}&loading=async&libraries=places`;
		script.async = true;
		script.defer = true;
		mapsScript = script;
		document.head.appendChild(script);
	});
</script>

<Drawer width="w-[20em]">
	<h2 class="font-bold p-4">Enlive Manager</h2>
	<hr />
	<Navigation />
</Drawer>

<Toast zIndex="z-[1000]" />
<Modal components={modalRegistry} />

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead">
				<div class="flex items-center">
					{#if $page.url.pathname.includes('/app/daily') && !!$page.params.slug}
						<button
							class="{classesSidebar} lg:hidden block btn btn-sm mr-4"
							on:click={() => goto('/app/daily')}
						>
							<ArrowBack fill="white" />
						</button>
					{:else}
						<button class="{classesSidebar} lg:hidden block btn btn-sm mr-4" on:click={navOpen}>
							<span>
								<svg viewBox="0 0 100 80" class="fill-token w-4 h-4">
									<rect width="100" height="20" />
									<rect y="30" width="100" height="20" />
									<rect y="60" width="100" height="20" />
								</svg>
							</span>
						</button>
					{/if}
					<strong class="text-xl uppercase flex flex-row justify-center item-center h-fit gap-3">
						<Avatar src="/drawing.png" width="w-12" />

						<a href="/" class="mt-auto mb-auto"> Enlive Manager </a>
					</strong>
				</div>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft"
		><div class=" hidden {classesSidebar} lg:block w-[15em] h-full">
			<Navigation />
		</div>
	</svelte:fragment>
	{#if $navigating}
		<div class="w-full h-full flex justify-center items-center">
			<ProgressRadial />
		</div>
	{:else}
		<slot />
	{/if}
</AppShell>
