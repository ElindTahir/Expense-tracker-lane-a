<script lang="ts">
  let { data, form } = $props();
</script>

<main class="edit-page">
  <section class="panel edit-card">
    <a class="back-link" href="/dashboard">← Back to dashboard</a>
    <p class="eyebrow">Edit expense</p>
    <h1>{data.transaction.description}</h1>

    {#if form?.message}
      <p class="error-message">{form.message}</p>
    {/if}

    <form method="POST" action="?/update" class="stack-form">
      <label>
        Description
        <input name="description" required value={data.transaction.description} />
      </label>

      <label>
        Amount
        <input
          name="amount"
          type="number"
          min="0.01"
          step="0.01"
          required
          value={data.transaction.amount}
        />
      </label>

      <label>
        Category
        <select name="category_id" required>
          {#each data.categories as category}
            <option value={category.id} selected={category.id === data.transaction.category_id}>
              {category.name}
            </option>
          {/each}
        </select>
      </label>

      <label>
        Date
        <input name="spent_at" type="date" required value={data.transaction.spent_at} />
      </label>

      <button class="button primary full" type="submit">Update expense</button>
    </form>

    <form method="POST" action="?/delete">
      <button class="danger-button full" type="submit">Delete expense</button>
    </form>
  </section>
</main>
