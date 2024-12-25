<script lang="ts">
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { configuration } from '$lib/Stores';
	import { authentication } from '$lib/Socket';

	onMount(async () => {
		const params = new URLSearchParams(window.location.search);
		const code = params.get('code');
		const state = params.get('state');

		if (!code) {
			console.error('No code found in URL');
			window.location.href = `${base}/`;
			return;
		}

		try {
			const hassUrl = $configuration?.hassUrl || import.meta.env.VITE_HASS_URL;
			const clientId = new URL(hassUrl).origin + base + '/';
			const redirectUri = new URL(hassUrl).origin + base + '/auth/callback';

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
				}).toString()
			});

			if (!response.ok) {
				throw new Error(`Failed to get token: ${response.statusText}`);
			}

			const data = await response.json();
			const tokens = {
				access_token: data.access_token,
				expires: Date.now() + data.expires_in * 1000,
				refresh_token: data.refresh_token,
				hassUrl: hassUrl
			};

			// 保存令牌
			localStorage.hassTokens = JSON.stringify(tokens);

			// 更新配置
			$configuration = {
				...$configuration,
				hassUrl: hassUrl
			};

			// 初始化认证
			await authentication($configuration);

			// 重定向回原始页面
			let returnTo = '/';
			if (state) {
				try {
					const stateData = JSON.parse(decodeURIComponent(state));
					if (stateData.return_to) {
						returnTo = stateData.return_to;
					}
				} catch (e) {
					console.error('Failed to parse state:', e);
				}
			}

			window.location.href = `${new URL(hassUrl).origin}${base}${returnTo}`;
		} catch (error) {
			console.error('Failed to authenticate:', error);
			// 清除无效的令牌
			localStorage.removeItem('hassTokens');
			window.location.href = `${base}/`;
		}
	});
</script>

<div class="container">
	<h1>Authenticating...</h1>
</div>

<style>
	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		width: 100vw;
	}

	h1 {
		font-size: 1.5rem;
		color: var(--theme-text-color);
	}
</style> 