<script lang="ts">
  import { lang } from '$lib/Stores';
  import HAInstances from './HAInstances.svelte';
  import Version from './Version.svelte';
  import Logout from './Logout.svelte';
</script>

<div class="settings">
  <h1>{$lang('settings')}</h1>
  
  <div class="section">
    <HAInstances />
  </div>

  <div class="section">
    <Version />
  </div>

  <div class="section">
    <Logout />
  </div>
</div>

<style>
  .settings {
    padding: 1rem;
    max-width: 800px;
    margin: 0 auto;
  }

  h1 {
    margin-bottom: 2rem;
    color: white;
  }

  .section {
    margin-bottom: 2rem;
    padding: 1rem;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
  }
</style> 