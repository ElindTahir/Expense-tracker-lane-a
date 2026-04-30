import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
  if (!locals.user) throw redirect(303, '/login');

  const [{ data: transaction, error: transactionError }, { data: categories }] = await Promise.all([
    locals.supabase
      .from('transactions')
      .select('id, amount, description, spent_at, category_id')
      .eq('id', params.id)
      .single(),
    locals.supabase.from('categories').select('*').order('name')
  ]);

  if (transactionError || !transaction) {
    throw error(404, 'Transaction not found');
  }

  return {
    transaction,
    categories: categories ?? []
  };
};

export const actions: Actions = {
  update: async ({ request, locals, params }) => {
    if (!locals.user) throw redirect(303, '/login');

    const formData = await request.formData();
    const amount = Number(formData.get('amount'));
    const description = String(formData.get('description') ?? '').trim();
    const category_id = String(formData.get('category_id') ?? '');
    const spent_at = String(formData.get('spent_at') ?? '');

    if (!amount || amount <= 0 || !description || !category_id || !spent_at) {
      return fail(400, { message: 'Please fill in all fields correctly.' });
    }

    const { error } = await locals.supabase
      .from('transactions')
      .update({ amount, description, category_id, spent_at })
      .eq('id', params.id);

    if (error) return fail(400, { message: error.message });

    throw redirect(303, '/dashboard');
  },

  delete: async ({ locals, params }) => {
    if (!locals.user) throw redirect(303, '/login');

    const { error } = await locals.supabase.from('transactions').delete().eq('id', params.id);

    if (error) return fail(400, { message: error.message });

    throw redirect(303, '/dashboard');
  }
};
