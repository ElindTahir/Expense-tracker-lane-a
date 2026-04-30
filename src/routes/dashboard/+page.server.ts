import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    throw redirect(303, '/login');
  }

  const [{ data: categories, error: categoryError }, { data: transactions, error: transactionError }] =
    await Promise.all([
      locals.supabase.from('categories').select('*').order('name'),
      locals.supabase
        .from('transactions')
        .select('id, amount, description, spent_at, categories(id, name, color)')
        .order('spent_at', { ascending: false })
    ]);

  if (categoryError || transactionError) {
    return {
      categories: [],
      transactions: [],
      total: 0,
      categoryTotals: [],
      error: categoryError?.message ?? transactionError?.message
    };
  }

  const total = transactions.reduce((sum, item) => sum + Number(item.amount), 0);

  const categoryMap = new Map<string, { name: string; color: string; total: number }>();
  for (const transaction of transactions) {
    const category = Array.isArray(transaction.categories)
      ? transaction.categories[0]
      : transaction.categories;

    const key = category?.name ?? 'Uncategorized';
    const existing = categoryMap.get(key) ?? {
      name: key,
      color: category?.color ?? '#d1d5db',
      total: 0
    };

    existing.total += Number(transaction.amount);
    categoryMap.set(key, existing);
  }

  return {
    categories,
    transactions,
    total,
    categoryTotals: Array.from(categoryMap.values()).sort((a, b) => b.total - a.total),
    error: null
  };
};

export const actions: Actions = {
  addTransaction: async ({ request, locals }) => {
    if (!locals.user) throw redirect(303, '/login');

    const formData = await request.formData();
    const amount = Number(formData.get('amount'));
    const description = String(formData.get('description') ?? '').trim();
    const category_id = String(formData.get('category_id') ?? '');
    const spent_at = String(formData.get('spent_at') ?? '');

    if (!amount || amount <= 0 || !description || !category_id || !spent_at) {
      return fail(400, { message: 'Please fill in all transaction fields correctly.' });
    }

    const { error } = await locals.supabase.from('transactions').insert({
      amount,
      description,
      category_id,
      spent_at,
      user_id: locals.user.id
    });

    if (error) return fail(400, { message: error.message });

    return { success: true };
  },

  addCategory: async ({ request, locals }) => {
    if (!locals.user) throw redirect(303, '/login');

    const formData = await request.formData();
    const name = String(formData.get('name') ?? '').trim();
    const color = String(formData.get('color') ?? '#6366f1');

    if (!name) {
      return fail(400, { message: 'Category name is required.' });
    }

    const { error } = await locals.supabase.from('categories').insert({
      name,
      color,
      user_id: locals.user.id
    });

    if (error) return fail(400, { message: error.message });

    return { success: true };
  },

  deleteCategory: async ({ request, locals }) => {
    if (!locals.user) throw redirect(303, '/login');

    const formData = await request.formData();
    const id = String(formData.get('id') ?? '');

    const { error } = await locals.supabase.from('categories').delete().eq('id', id);

    if (error) return fail(400, { message: 'Category can only be deleted if no expenses use it.' });

    return { success: true };
  }
};
