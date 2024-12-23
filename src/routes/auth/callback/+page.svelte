<script lang="ts">
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { initConnection } from '$lib/Stores';

	async function getAccessToken(hassUrl: string, code: string, clientId: string, redirectUri: string) {
		try {
			const response = await fetch(`${hassUrl}/auth/token`, {
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

			const data = await response.json();
			return data;
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
				const { hassUrl, return_to } = stateData;

				if (hassUrl) {
					localStorage.setItem('hassUrl', hassUrl);
					
					// 获取访问令牌
					const redirectUri = `${window.location.origin}${base}/auth/callback`;
					const clientId = `${window.location.origin}${base}/`;
					
					const tokenData = await getAccessToken(hassUrl, code, clientId, redirectUri);
					
					// 保存令牌信息
					localStorage.setItem('hassTokens', JSON.stringify({
						access_token: tokenData.access_token,
						expires_in: tokenData.expires_in,
						refresh_token: tokenData.refresh_token,
						token_type: tokenData.token_type,
						timestamp: Date.now()
					}));

					// 初始化 WebSocket 连接
					await initConnection();

					// 重定向回插件页面
					window.location.href = `${base}/`;
				} else {
					console.error('No hassUrl in state');
					window.location.href = `${base}/`;
				}
			} catch (e) {
				console.error('Failed to process authentication:', e);
				
				// 如果认证失败，重定向回插件页面
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