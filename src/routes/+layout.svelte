<script lang="ts">
	import '../app.postcss';
	import {
		AppShell,
		AppBar,
		getDrawerStore,
		initializeStores,
		Drawer,
		Toast,
		Modal
	} from '@skeletonlabs/skeleton';
	import Navigation from '$lib/components/Navigation.svelte';
	import { onMount } from 'svelte';

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
	import { modalRegistry } from '$lib/ModalRegistry';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	initializeStores();
	const drawerStore = getDrawerStore();

	const navOpen = () => {
		drawerStore.open({});
	};

	$: classesSidebar =
		($page.url.pathname === '/' ||
			$page.url.pathname === '/admin/initial-setup' ||
			$page.url.pathname === '/signup' ||
			$page.url.pathname === '/login') &&
		'!hidden';

	let mapsScript;

	onMount(() => {
		const script = document.createElement('script');
		script.src =
			'https://maps.googleapis.com/maps/api/js?key=AIzaSyB7EdZYIgR4SxMikrHBWC3YxTWFft1oLz0&libraries=places';
		script.async = true;
		script.defer = true;
		mapsScript = script;
		document.head.appendChild(script);
	});
</script>

<Drawer width="w-[20em]">
	<h2 class="p-4">Enlive Manager</h2>
	<hr />
	<Navigation />
</Drawer>

<Toast />
<Modal components={modalRegistry} />

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead">
				<div class="flex items-center">
					<button class="{classesSidebar} lg:hidden block btn btn-sm mr-4" on:click={navOpen}>
						<span>
							<svg viewBox="0 0 100 80" class="fill-token w-4 h-4">
								<rect width="100" height="20" />
								<rect y="30" width="100" height="20" />
								<rect y="60" width="100" height="20" />
							</svg>
						</span>
					</button>
					<strong class="text-xl uppercase">
						<a href="/"> Enlive Manager </a>
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

	<slot />
</AppShell>
