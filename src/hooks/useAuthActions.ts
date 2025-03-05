
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useAuthActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('Attempting to sign in with email:', email);
      
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('Sign in error:', error.message);
        throw error;
      }

      console.log('Sign in successful, navigating to home');
      navigate('/');
    } catch (error: any) {
      console.error('Authentication error in signIn:', error);
      toast({
        title: "Authentication failed",
        description: error.message || "Failed to sign in. Please try again.",
        variant: "destructive"
      });
      
      // Ensure loading state is always reset on error
      setIsLoading(false);
    } finally {
      // Set a timeout to ensure loading state is reset even if there's an unexpected issue
      setTimeout(() => {
        if (isLoading) {
          console.log('Forcing reset of loading state after timeout');
          setIsLoading(false);
        }
      }, 5000); // 5 second safety timeout
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      console.log('Attempting to sign up with email:', email);
      
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name
          }
        }
      });
      
      if (error) {
        console.error('Sign up error:', error.message);
        throw error;
      }

      console.log('Sign up successful');
      toast({
        title: "Success!",
        description: "Please check your email to confirm your account.",
      });
      
    } catch (error: any) {
      console.error('Authentication error in signUp:', error);
      toast({
        title: "Registration failed",
        description: error.message || "Failed to register. Please try again.",
        variant: "destructive"
      });
    } finally {
      // Always reset loading state when operation is complete
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      console.log('Attempting to sign out');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error.message);
        throw error;
      }

      console.log('Sign out successful, navigating to login');
      navigate('/login');
    } catch (error: any) {
      console.error('Authentication error in signOut:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. " + (error.message || "Please try again."),
        variant: "destructive"
      });
    } finally {
      // Always reset loading state when operation is complete
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    signIn,
    signUp,
    signOut
  };
};
