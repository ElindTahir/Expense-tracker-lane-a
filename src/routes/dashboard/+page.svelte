<script lang="ts">
  let { data, form } = $props();

  const euro = new Intl.NumberFormat("de-AT", {
    style: "currency",
    currency: "EUR",
  });
</script>

<main class="dashboard">
  <section class="dashboard-header">
    <div>
      <p class="eyebrow">Protected dashboard</p>
      <h1>Your expenses TEEEEST</h1>
      <p>
        Server-rendered overview loaded from Supabase before the page reaches
        the browser.
      </p>
    </div>
    <div class="total-card">
      <span>Total tracked</span>
      <strong>{euro.format(data.total)}</strong>
    </div>
  </section>

  {#if data.error || form?.message}
    <p class="error-message">{data.error ?? form?.message}</p>
  {/if}

  <section class="grid-two">
    <article class="panel">
      <h2>Add expense</h2>
      <form method="POST" action="?/addTransaction" class="stack-form">
        <label>
          Description
          <input name="description" placeholder="e.g. Groceries" required />
        </label>

        <label>
          Amount
          <input
            name="amount"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="24.90"
            required
          />
        </label>

        <label>
          Category
          <select name="category_id" required>
            <option value="">Select category</option>
            {#each data.categories as category}
              <option value={category.id}>{category.name}</option>
            {/each}
          </select>
        </label>

        <label>
          Date
          <input name="spent_at" type="date" required />
        </label>

        <button class="button primary full" type="submit">Save expense</button>
      </form>
    </article>

    <article class="panel">
      <h2>Categories</h2>
      <form method="POST" action="?/addCategory" class="inline-form">
        <input name="name" placeholder="New category" required />
        <input
          name="color"
          type="color"
          value="#6366f1"
          aria-label="Category color"
        />
        <button class="button secondary" type="submit">Add</button>
      </form>

      <div class="category-list">
        {#each data.categories as category}
          <form method="POST" action="?/deleteCategory" class="category-pill">
            <span style={`--dot:${category.color}`}>{category.name}</span>
            <input type="hidden" name="id" value={category.id} />
            <button type="submit" aria-label={`Delete ${category.name}`}
              >x</button
            >
          </form>
        {/each}
      </div>
    </article>
  </section>

  <section class="grid-two">
    <article class="panel">
      <h2>Spending by category</h2>
      {#if data.categoryTotals.length === 0}
        <p class="empty">No category data yet.</p>
      {:else}
        <div class="summary-list">
          {#each data.categoryTotals as category}
            <div>
              <span
                ><i style={`--dot:${category.color}`}></i>{category.name}</span
              >
              <strong>{euro.format(category.total)}</strong>
            </div>
          {/each}
        </div>
      {/if}
    </article>

    <article class="panel">
      <h2>Recent expenses</h2>
      {#if data.transactions.length === 0}
        <p class="empty">Add your first expense to start tracking.</p>
      {:else}
        <div class="transaction-list">
          {#each data.transactions as transaction}
            <a
              class="transaction-row"
              href={`/transactions/${transaction.id}/edit`}
            >
              <span>
                <strong>{transaction.description}</strong>
                <small>
                  {new Date(transaction.spent_at).toLocaleDateString("de-AT")}
                  ·
                  {transaction.categories?.[0]?.name ?? "Uncategorized"}
                </small>
              </span>
              <strong>{euro.format(Number(transaction.amount))}</strong>
            </a>
          {/each}
        </div>
      {/if}
    </article>
  </section>
</main>
