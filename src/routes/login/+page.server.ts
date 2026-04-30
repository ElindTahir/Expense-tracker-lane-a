import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const load = async ({ locals }) => {
  if (locals.session) {
    throw redirect(303, '/dashboard');
  }
};

export const actions: Actions = {
  login: async ({ request, locals }) => {
    const formData = await request.formData();
    const email = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');

    const { error } = await locals.supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return fail(400, { message: error.message, email });
    }

    throw redirect(303, '/dashboard');
  },

  register: async ({ request, locals }) => {
    const formData = await request.formData();
    const email = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');

    if (password.length < 6) {
      return fail(400, { message: 'Password must contain at least 6 characters.', email });
    }

    const { error } = await locals.supabase.auth.signUp({ email, password });

    if (error) {
      return fail(400, { message: error.message, email });
    }

    throw redirect(303, '/dashboard');
  }
};
