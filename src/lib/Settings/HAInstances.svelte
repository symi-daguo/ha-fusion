<script lang="ts">
  import { haInstances, currentInstance, switchHAInstance } from '$lib/Stores';
  import { base } from '$app/paths';

  function handleAddInstance() {
    const hassUrl = prompt('请输入 Home Assistant 地址');
    if (hassUrl) {
      const instanceName = prompt('请输入实例名称', 'Home Assistant');
      const clientId = `${window.location.origin}${base}/`;
      const redirectUri = `${window.location.origin}${base}/auth/callback`;
      
      const state = encodeURIComponent(JSON.stringify({
        hassUrl,
        instanceName
      }));

      const authUrl = `${hassUrl}/auth/authorize?client_id=${encodeURIComponent(
        clientId
      )}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=code&state=${state}`;

      window.location.href = authUrl;
    }
  }
</script>

<div class="instances">
  <h2>Home Assistant 实例</h2>
  
  {#each $haInstances as instance}
    <div class="instance" class:active={$currentInstance?.url === instance.url}>
      <div class="info">
        <h3>{instance.name}</h3>
        <p>{instance.url}</p>
      </div>
      <button on:click={() => switchHAInstance(instance.url)}>
        切换
      </button>
    </div>
  {/each}

  <button on:click={handleAddInstance}>
    添加新实例
  </button>
</div>

<style>
  .instances {
    padding: 1rem;
  }

  .instance {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    margin-bottom: 1rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
  }

  .instance.active {
    background: rgba(255, 255, 255, 0.2);
  }

  .info h3 {
    margin: 0;
    margin-bottom: 0.5rem;
  }

  .info p {
    margin: 0;
    opacity: 0.8;
  }

  button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    cursor: pointer;
  }

  button:hover {
    background: rgba(255, 255, 255, 0.3);
  }
</style> 