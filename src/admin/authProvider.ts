import { supabase } from "../lib/supabase";

export const authProvider = {
  login: async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error,
      };
    }

    if (data?.session) {
      return {
        success: true,
        redirectTo: "/admin",
      };
    }

    // fallback code
    return {
      success: false,
      error: {
        name: "LoginError",
        message: "Invalid username or password",
      },
    };
  },
  logout: async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        error,
      };
    }

    return {
      success: true,
      redirectTo: "/admin/login",
    };
  },
  check: async () => {
    const { data } = await supabase.auth.getSession();
    const { session } = data;

    if (!session) {
      return {
        authenticated: false,
      };
    }

    return {
      authenticated: true,
    };
  },
  getPermissions: async () => {
    const { data } = await supabase.auth.getUser();

    if (data?.user) {
      return data.user.role;
    }

    return null;
  },
  getIdentity: async () => {
    const { data } = await supabase.auth.getUser();

    if (data?.user) {
      return {
        ...data.user,
        name: data.user.email,
      };
    }

    return null;
  },
  onError: async (error) => {
    console.error(error);
    return { error };
  },
};
