<script lang="ts">
  let { data } = $props();
</script>

<main class="hero">
  <section class="hero-copy">
    <p class="eyebrow">Personal Finance · Server-Side MPA</p>
    <h1>Track your expenses without losing control of your budget.</h1>
    <p class="hero-text">
      SpendWise helps you record expenses, organize them by category and understand your monthly
      spending through a clean, focused dashboard.
    </p>

    <div class="hero-actions">
      {#if data.session}
        <a class="button primary" href="/dashboard">Open dashboard</a>
      {:else}
        <a class="button primary" href="/login">Start tracking</a>
        <a class="button secondary" href="#features">View features</a>
      {/if}
    </div>
  </section>

  <section class="preview-card">
    <div class="preview-header">
      <span>April overview</span>
      <strong>€1,284.50</strong>
    </div>

    <div class="chart-bars" aria-hidden="true">
      <span style="height: 42%"></span>
      <span style="height: 68%"></span>
      <span style="height: 34%"></span>
      <span style="height: 82%"></span>
      <span style="height: 55%"></span>
    </div>

    <div class="mini-list">
      <div><span>Groceries</span><strong>€240.20</strong></div>
      <div><span>Transport</span><strong>€89.90</strong></div>
      <div><span>Subscriptions</span><strong>€42.99</strong></div>
    </div>
  </section>
</main>

<section id="features" class="feature-grid">
  <article>
    <h2>Private by design</h2>
    <p>Every user sees only their own expenses thanks to Supabase authentication and RLS.</p>
  </article>
  <article>
    <h2>Full CRUD</h2>
    <p>Create, read, update and delete expenses through server-side SvelteKit form actions.</p>
  </article>
  <article>
    <h2>Useful summaries</h2>
    <p>See total spending, category totals and recent transactions on one protected page.</p>
  </article>
</section>
