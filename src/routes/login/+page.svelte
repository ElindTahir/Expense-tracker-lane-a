<script lang="ts">
  let { form } = $props();
</script>

<main class="auth-page">
  <section class="auth-card">
    <p class="eyebrow">Welcome back</p>
    <h1>Login to your tracker</h1>

    {#if form?.message}
      <p class="error-message">{form.message}</p>
    {/if}

    <form method="POST" action="?/login" class="stack-form">
      <label>
        Email
        <input name="email" type="email" autocomplete="email" required value={form?.email ?? ''} />
      </label>

      <label>
        Password
        <input name="password" type="password" autocomplete="current-password" required />
      </label>

      <button class="button primary full" type="submit">Login</button>
    </form>
  </section>

  <section class="auth-card muted-card">
    <p class="eyebrow">New here?</p>
    <h2>Create an account</h2>
    <p>Your dashboard is protected and connected to your personal Supabase user account.</p>

    <form method="POST" action="?/register" class="stack-form">
      <label>
        Email
        <input name="email" type="email" autocomplete="email" required />
      </label>

      <label>
        Password
        <input name="password" type="password" autocomplete="new-password" minlength="6" required />
      </label>

      <button class="button secondary full" type="submit">Register</button>
    </form>
  </section>
</main>
