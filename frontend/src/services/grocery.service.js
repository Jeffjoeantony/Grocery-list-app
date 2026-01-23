import { supabase } from "../supeabaseClient";

async function getAuthenticatedUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("User not authenticated");
  }

  return user;
}

export async function fetchGroceryItems() {
  const user = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function addGroceryItem({ name, quantity, note }) {
  const user = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("items")
    .insert([
      {
        user_id: user.id,
        name,
        quantity,
        note,
        purchased: false,
      },
    ])
    .select(); 

  if (error) throw error;
  return data; 
}

/* ================= TOGGLE ================= */
export async function togglePurchased(itemId, currentStatus) {
  const user = await getAuthenticatedUser();

  const { error } = await supabase
    .from("items")
    .update({ purchased: !currentStatus })
    .eq("id", itemId)
    .eq("user_id", user.id);

  if (error) throw error;
}

export async function deleteGroceryItem(itemId) {
  const user = await getAuthenticatedUser();

  const { error } = await supabase
    .from("items")
    .delete()
    .eq("id", itemId)
    .eq("user_id", user.id);

  if (error) throw error;
}
