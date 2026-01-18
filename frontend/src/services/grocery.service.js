import { supabase } from '../supeabaseClient';

export async function addGroceryItem({ name, quantity, note }) {
  const { data: { user }, error: userError } =
    await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('items')
    .insert([
      {
        user_id: user.id, 
        name,
        quantity,
        note
      }
    ]);

  if (error) throw error;

  return data;
}
