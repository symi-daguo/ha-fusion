<script lang="ts">
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { initConnection } from '$lib/Stores';

	async function getAccessToken(code: string, clientId: string, redirectUri: string) {
		try {
			const response = await fetch(`/auth/token`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: new URLSearchParams({
					grant_type: 'authorization_code',
					code,
					client_id: clientId,
					redirect_uri: redirectUri
				})
			});

			if (!response.ok) {
				throw new Error('Failed to get access token');
			}

			return await response.json();
		} catch (error) {
			console.error('Error getting access token:', error);
			throw error;
		}
	}

	onMount(async () => {
		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get('code');
		const state = urlParams.get('state');

		if (code && state) {
			try {
				const stateData = JSON.parse(decodeURIComponent(state));
				const { return_to = '/' } = stateData;

				// 获取访问令牌
				const redirectUri = `${window.location.origin}${base}/auth/callback`;
				const clientId = `${window.location.origin}${base}/`;
				
				const tokenData = await getAccessToken(code, clientId, redirectUri);
				
				// 保存令牌信息
				localStorage.setItem('hassTokens', JSON.stringify({
					access_token: tokenData.access_token,
					expires_in: tokenData.expires_in,
					refresh_token: tokenData.refresh_token,
					token_type: tokenData.token_type,
					timestamp: Date.now()
				}));

				// 初始化连接
				await initConnection();

				// 重定向回原页面
				window.location.href = `${base}${return_to}`;
			} catch (e) {
				console.error('Failed to process authentication:', e);
				window.location.href = `${base}/`;
			}
		} else {
			window.location.href = `${base}/`;
		}
	});
</script>

<div class="container">
	<h1>授权处理中...</h1>
	<p>请稍候，正在完成授权流程</p>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
		text-align: center;
		color: white;
	}

	h1 {
		margin-bottom: 1rem;
	}

	p {
		opacity: 0.8;
	}
</style> 