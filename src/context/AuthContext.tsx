import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Profile } from '../types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  continueAsGuest: () => Promise<User>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfile = async (
    userId: string,
    email: string,
    name?: string,
    avatar?: string
  ) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create it
        const newProfile = {
          id: userId,
          email,
          full_name: name || null,
          avatar_url: avatar || null,
          welcome_email_sent: false,
        };

        const { data: insertedData, error: insertError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single();

        if (!insertError && insertedData) {
          setProfile(insertedData);

          // Trigger welcome email via Edge Function
          triggerWelcomeEmail(insertedData);
        }
      } else if (data) {
        setProfile(data);

        // Check if welcome email was never sent
        if (!data.welcome_email_sent) {
          triggerWelcomeEmail(data);
        }
      }
    } catch (err) {
      console.error('Error handling user profile:', err);
    }
  };

  const triggerWelcomeEmail = async (userProfile: Profile) => {
    try {
      const { error } = await supabase.functions.invoke('send-email', {
        body: {
          type: 'welcome',
          email: userProfile.email,
          name: userProfile.full_name || 'Valued Customer',
        },
      });

      if (!error) {
        // Mark welcome email as sent
        await supabase
          .from('profiles')
          .update({ welcome_email_sent: true })
          .eq('id', userProfile.id);

        setProfile((prev) =>
          prev ? { ...prev, welcome_email_sent: true } : null
        );
      }
    } catch (e) {
      console.error('Failed to dispatch welcome email invoke:', e);
    }
  };

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      // Only create/fetch a profile for normal Google/authenticated users.
      // Anonymous users will create their profile during guest checkout,
      // after the customer provides their name and email.
      if (session?.user && !session.user.is_anonymous) {
        fetchProfile(
          session.user.id,
          session.user.email || '',
          session.user.user_metadata?.full_name,
          session.user.user_metadata?.avatar_url
        );
      }

      setLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      // Anonymous users should NOT have a profile automatically created.
      // Their profile is created during checkout with the customer's
      // actual name and email.
      if (session?.user && !session.user.is_anonymous) {
        await fetchProfile(
          session.user.id,
          session.user.email || '',
          session.user.user_metadata?.full_name,
          session.user.user_metadata?.avatar_url
        );
      } else if (!session?.user) {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}`,
      },
    });

    if (error) {
      console.error('OAuth Login Error:', error.message);
      throw error;
    }
  };

  const continueAsGuest = async (): Promise<User> => {
    const { data, error } = await supabase.auth.signInAnonymously();

    if (error || !data.user) {
      console.error('Guest checkout error:', error?.message);

      throw new Error('Could not start guest checkout. Please try again.');
    }

    return data.user;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signInWithGoogle,
        continueAsGuest,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
