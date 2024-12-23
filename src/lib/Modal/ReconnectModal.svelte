<script lang="ts">
	import { lang, ripple } from '$lib/Stores';
	import { onMount } from 'svelte';
	import Ripple from 'svelte-ripple';
	import Modal from '$lib/Modal/Index.svelte';

	export let confirm: any;
	export let cancel: any;
	export let isOpen: boolean;

	let cancelButton: HTMLButtonElement;
	let haUrlInput: HTMLInputElement;
	let errorMessage = '';

	onMount(() => {
		if (haUrlInput) {
			const savedUrl = localStorage.getItem('hassUrl') || 'http://localhost:8123';
			haUrlInput.value = savedUrl;
		}
		if (cancelButton) cancelButton.focus();
	});

	function handleConfirm() {
		if (!haUrlInput?.value) {
			errorMessage = '请输入 Home Assistant 地址';
			return;
		}

		try {
			const url = new URL(haUrlInput.value);
			localStorage.setItem('hassUrl', haUrlInput.value);
			confirm(haUrlInput.value);
		} catch (e) {
			errorMessage = '请输入有效的 URL 地址';
		}
	}
</script>

{#if isOpen}
	<Modal backdropImage={false}>
		<h1 slot="title">{$lang('log_out')}</h1>

		<p>{$lang('confirm_log_out')}</p>

		<div class="message">
			<p>重新连接将会：</p>
			<ul>
				<li>清除当前的连接信息</li>
				<li>跳转到授权页面</li>
				<li>重新授权插件访问 Home Assistant</li>
			</ul>
		</div>

		<div class="input-container">
			<label for="haUrl">Home Assistant 地址：</label>
			<input
				id="haUrl"
				bind:this={haUrlInput}
				type="text"
				placeholder="例如：http://localhost:8123"
			/>
			{#if errorMessage}
				<p class="error">{errorMessage}</p>
			{/if}
		</div>

		<div class="bottom-buttons">
			<button
				on:click={handleConfirm}
				style:background-color="#ae2e2e"
				use:Ripple={{ ...$ripple, color: 'rgba(0, 0, 0, 0.35)' }}
			>
				{$lang('ok')}
			</button>

			<button bind:this={cancelButton} on:click={cancel} use:Ripple={$ripple}>
				{$lang('cancel')}
			</button>
		</div>
	</Modal>
{/if}

<style>
	.message {
		margin: 1rem 0;
		font-size: 0.9rem;
	}

	.message ul {
		margin: 0.5rem 0 0 1.2rem;
		opacity: 0.8;
	}

	.message li {
		margin: 0.3rem 0;
	}

	.input-container {
		margin: 1.5rem 0;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		font-size: 0.9rem;
	}

	input {
		width: 100%;
		padding: 0.5rem;
		border-radius: 4px;
		border: 1px solid rgba(255, 255, 255, 0.1);
		background: rgba(0, 0, 0, 0.1);
		color: inherit;
		font-size: 0.9rem;
	}

	.error {
		color: #ff5252;
		font-size: 0.85rem;
		margin-top: 0.4rem;
		margin-bottom: 0;
	}

	.bottom-buttons {
		display: flex;
		justify-content: flex-end;
		gap: 0.4rem;
	}

	.bottom-buttons button {
		border-radius: 0.4em;
		background-color: rgba(255, 255, 255, 0.15);
		border: none;
		color: white;
		padding: 0.55em 0.9em;
		cursor: pointer;
		font-family: inherit;
		margin-top: 0.7rem;
		font-size: 0.9rem;
	}
</style> 