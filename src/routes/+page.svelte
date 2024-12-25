<script lang="ts">
	import {
		dashboard,
		configuration,
		editMode,
		motion,
		showDrawer,
		translation,
		drawerSearch,
		focusSearch,
		currentViewId,
		selectedLanguage,
		customJs,
		filterDashboard,
		disableMenuButton,
		clickOriginatedFromMenu,
		connection,
		youtubeAddon
	} from '$lib/Stores';
	import { authentication } from '$lib/Socket';
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { modals } from 'svelte-modals';
	import Theme from '$lib/Components/Theme.svelte';

	export let data;

	let altKeyPressed = false;

	// 从服务器端加载的数据
	$configuration = data?.configuration;
	$dashboard = data?.dashboard;
	$translation = data?.translations;
	$selectedLanguage = data?.configuration?.locale || 'en';
	$customJs = data?.configuration?.custom_js;
	$youtubeAddon = data?.configuration?.addons?.youtube;
	$currentViewId = $dashboard?.views?.[0]?.id;

	const _motion = data?.configuration?.motion;
	$motion = _motion === undefined || _motion === true ? $motion : 0;

	// 计算当前视图
	$: view = $drawerSearch
		? $filterDashboard
		: $dashboard?.views?.find((view) => view?.id === $currentViewId) ||
			$dashboard?.views?.find((view) => view?.isDndShadowItem);

	// WebSocket 连接管理
	let isConnecting = false;
	let retryInterval: ReturnType<typeof setInterval>;

	if (browser) {
		document.documentElement.lang = $selectedLanguage || 'en';
		connect();
		retryInterval = setInterval(connect, 3000);
	}

	async function connect() {
		if (isConnecting) return;
		isConnecting = true;

		try {
			await authentication($configuration);
			clearInterval(retryInterval);
		} catch {
			// catch but don't log
		} finally {
			isConnecting = false;
		}
	}

	$: if ($configuration?.token) updateConnection();

	function updateConnection() {
		if (isConnecting || !browser) return;
		clearInterval(retryInterval);
		connect();
		retryInterval = setInterval(connect, 3000);
	}

	onDestroy(() => clearInterval(retryInterval));

	onMount(async () => {
		const menuParam = new URLSearchParams(window.location.search).get('menu');
		$disableMenuButton = menuParam === 'false';

		if ('serviceWorker' in navigator) {
			try {
				const registrations = await navigator.serviceWorker.getRegistrations();
				for (const registration of registrations) {
						await registration.unregister();
				}
			} catch (error) {
				console.error('Error during service worker unregistration:', error);
			}
		}
	});

	function toggleDrawer() {
		$showDrawer = !$showDrawer;
		$clickOriginatedFromMenu = false;
	}

	function handleClick() {
		if ($editMode) {
			$clickOriginatedFromMenu = true;
			const button = document.querySelector('#editmode') as HTMLButtonElement;
			button?.click();
		} else {
			toggleDrawer();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if ($modals.length) return;

		if (event.key === 'Escape' && !$editMode && document.activeElement) {
			(document.activeElement as HTMLElement).blur();
		}

		if (event.key === 'Alt') {
			altKeyPressed = true;
		}

		if (event.key === 'f' && !$disableMenuButton) {
			if (!$showDrawer || !$focusSearch) {
				$focusSearch = true;
				if (!$showDrawer) $showDrawer = true;
				event.preventDefault();
			}
		} else if (event.key === 'Escape' && $showDrawer && !$editMode) {
			$focusSearch = false;
			if (!$drawerSearch) handleClick();
			$drawerSearch = undefined;
		}
	}

	function handleKeyup(event: KeyboardEvent) {
		if (event.key === 'Alt') {
			altKeyPressed = false;
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} on:keyup={handleKeyup} />

<Theme initial={data?.theme} />

<div
	id="layout"
	style:grid-template-columns="{$dashboard?.hide_sidebar || !$dashboard?.sidebar?.length
		? '0'
		: $dashboard?.sidebarWidth || 350}px auto"
	style:grid-template-rows={$showDrawer ? 'auto auto 1fr' : '0fr auto 1fr'}
	style:transition="grid-template-rows {$motion}ms ease, grid-template-columns {$motion}ms ease"
>
	<!-- nav -->
	{#await import('$lib/Main/Views.svelte') then Views}
		<svelte:component this={Views.default} {view} />
	{/await}

	<!-- main -->
	{#if view?.sections}
		{#await import('$lib/Main/Index.svelte') then Main}
			<svelte:component this={Main.default} {view} {altKeyPressed} />
		{/await}
	{:else if $connection}
		{#await import('$lib/Main/Intro.svelte') then Intro}
			<svelte:component this={Intro.default} {data} />
		{/await}
	{/if}

	<!-- aside -->
	{#await import('$lib/Sidebar/Index.svelte') then Sidebar}
		<svelte:component this={Sidebar.default} {altKeyPressed} />
	{/await}

	<!-- menu -->
	{#if !$disableMenuButton}
		{#await import('$lib/Drawer/MenuButton.svelte') then MenuButton}
			<svelte:component this={MenuButton.default} {handleClick} />
		{/await}
	{/if}

	<!-- header -->
	{#if $showDrawer}
		{#await import('$lib/Drawer/Index.svelte') then Drawer}
			<svelte:component this={Drawer.default} {view} {data} {toggleDrawer} />
		{/await}
	{/if}

	<!-- module -->
	{#if $customJs}
		{#await import('$lib/Components/CustomJs.svelte') then CustomJs}
			<svelte:component this={CustomJs.default} />
		{/await}
	{/if}
</div>

<style>
	#layout {
		display: grid;
		grid-template-areas:
			'header header'
			'aside nav'
			'aside main';
		height: 100%;
		width: 100%;
		overflow: hidden;
	}
</style>
