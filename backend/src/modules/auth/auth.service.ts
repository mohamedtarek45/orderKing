import {supabase , supabaseAuth} from "../../config/supabase";
export async function registerUser(
  email: string,
  password: string,
  name: string,
) {
  const { data, error } = await supabaseAuth.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  if (data.user) {
    await supabase.from("profiles").insert({
      id: data.user?.id,
      email,
      name,
      role: "user",
    });
  }

  return data;
}

export async function loginUser(email: string, password: string) {
  const { data, error } = await supabaseAuth.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data;
}

export async function sendResetPasswordEmail(email: string) {
  const { error } = await supabaseAuth.auth.resetPasswordForEmail(email);

  if (error) throw error;

  return true;
}
export async function getCurrentUser(id: string) {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", id).single();
  console.log("user data", data);
  if (error) throw error;
  return data;
}

