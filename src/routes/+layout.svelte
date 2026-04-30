<script lang="ts">
  import '../styles.css';

  let { data, children } = $props();
</script>

<div class="app-shell">
  <header class="topbar">
    <a class="brand" href="/">
      <span class="brand-mark">€</span>
      <span>SpendWise</span>
    </a>

    <nav>
      <a href="/">Home</a>
      {#if data.session}
        <a href="/dashboard">Dashboard</a>
        <form method="POST" action="/logout">
          <button class="link-button">Logout</button>
        </form>
      {:else}
        <a class="nav-cta" href="/login">Login</a>
      {/if}
    </nav>
  </header>

  {@render children()}
</div>
