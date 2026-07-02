import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hapvskhbunsibtytudat.supabase.co';
const supabaseKey = 'sb_publishable_ZS-GBPZ7awi4L24vxnzHVQ_wDoIVvlH';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testSignup() {
  const email = `testuser_${Date.now()}@example.com`;
  const password = "password123";
  const name = "Test User";

  console.log("Signing up:", email);
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } }
  });

  if (error) {
    console.error("SignUp Error:", error);
    return;
  }
  
  console.log("SignUp Success. User ID:", data.user?.id);

  if (data.user) {
    const newUser = {
      id: data.user.id,
      name: name,
      email: email,
      plan: "None"
    };
    console.log("Upserting into public.users...");
    const { error: dbError } = await supabase.from("users").upsert(newUser);
    if (dbError) {
      console.error("Upsert Error:", dbError);
    } else {
      console.log("Upsert Success!");
    }
  }
}

testSignup();
