<script lang="ts">
	import { configuration } from '$lib/Stores';
	import { closeModal } from 'svelte-modals';
	import Modal from './Modal.svelte';

	let token = '';
	let error = '';

	function handleSubmit() {
		if (!token) {
			error = '请输入访问令牌';
			return;
		}

		$configuration = {
			...$configuration,
			token
		};

		closeModal();
	}
</script>

<Modal>
	<h1 slot="title">输入长期访问令牌</h1>

	<div class="content">
		<p>
			由于您正在使用Home Assistant Companion App，需要手动输入长期访问令牌。
			您可以在Home Assistant的个人资料 > 长期访问令牌中创建。
		</p>

		<div class="input-group">
			<input
				type="password"
				bind:value={token}
				placeholder="请输入长期访问令牌"
				on:keydown={(e) => e.key === 'Enter' && handleSubmit()}
			/>
			{#if error}
				<div class="error">{error}</div>
			{/if}
		</div>

		<div class="buttons">
			<button class="primary" on:click={handleSubmit}>确认</button>
			<button on:click={closeModal}>取消</button>
		</div>
	</div>
</Modal>

<style>
	.content {
		padding: 1rem;
	}

	.input-group {
		margin: 1rem 0;
	}

	input {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	.error {
		color: red;
		margin-top: 0.5rem;
		font-size: 0.9rem;
	}

	.buttons {
		display: flex;
		gap: 1rem;
		justify-content: flex-end;
		margin-top: 1rem;
	}

	button {
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		background-color: #e0e0e0;
	}

	button.primary {
		background-color: #4CAF50;
		color: white;
	}

	button:hover {
		opacity: 0.9;
	}
</style>
