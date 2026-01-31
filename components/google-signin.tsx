'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';

declare global {
  interface Window {
    google?: any;
  }
}

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  size?: 'large' | 'medium' | 'small';
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  width?: number;
}

export function GoogleSignInButton({
  onSuccess,
  onError,
  text = 'signin_with',
  size = 'large',
  theme = 'outline',
  width = 400,
}: GoogleSignInButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google && buttonRef.current) {
        // Initialize Google Sign-In
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });

        // Render the button
        window.google.accounts.id.renderButton(buttonRef.current, {
          type: 'standard',
          theme,
          size,
          text,
          width,
          logo_alignment: 'left',
        });
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleGoogleRedirect = () => {
    // Redirect to backend OAuth flow
    const BASE_URL = 'http://localhost:3002';
    const backendUrl = (
      process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || BASE_URL
    ).replace(/\/+$/, '');
    window.location.href = `${backendUrl}/api/auth/google`;
  };

  const handleGoogleResponse = async (response: any) => {
    try {
      if (!response.credential) {
        throw new Error('No credential received from Google');
      }

      // Send ID token to backend
      await login(response.credential);

      toast({
        title: 'Welcome!',
        description: 'You have been successfully signed in.',
      });

      // Call success callback
      if (onSuccess) {
        onSuccess();
      } else {
        // Default: redirect to home page
        router.push('/');
      }
    } catch (error: any) {
      console.error('Google Sign-In error:', error);

      const errorMessage = error.message || 'Failed to sign in with Google';

      toast({
        title: 'Sign-In Failed',
        description: errorMessage,
        variant: 'destructive',
      });

      if (onError) {
        onError(errorMessage);
      }
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div ref={buttonRef} />
    </div>
  );
}

// One-Tap Sign-In Component
interface GoogleOneTapProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function GoogleOneTap({ onSuccess, onError }: GoogleOneTapProps) {
  const { login, isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Don't show One Tap if user is already authenticated
    if (isAuthenticated) return;

    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google) {
        // Initialize Google One Tap
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Display One Tap prompt
        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed()) {
            console.log(
              'One Tap not displayed:',
              notification.getNotDisplayedReason()
            );
          } else if (notification.isSkippedMoment()) {
            console.log('One Tap skipped:', notification.getSkippedReason());
          }
        });
      }
    };

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [isAuthenticated]);

  const handleGoogleResponse = async (response: any) => {
    try {
      if (!response.credential) {
        throw new Error('No credential received from Google');
      }

      // Send ID token to backend
      await login(response.credential);

      toast({
        title: 'Welcome back!',
        description: 'You have been automatically signed in.',
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Google One Tap error:', error);

      if (onError) {
        onError(error.message || 'Failed to sign in with Google');
      }
    }
  };

  return null; // One Tap doesn't render anything visible
}
