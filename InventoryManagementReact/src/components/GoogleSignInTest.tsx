import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DEV_GOOGLE_OAUTH } from '@/config/google-oauth';

export function GoogleSignInTest() {
  const { loginWithGoogle, user, isAuthenticated } = useAuth();

  const handleTestGoogleSignIn = async () => {
    try {
      await loginWithGoogle(DEV_GOOGLE_OAUTH.mockUser);
      console.log('Google sign-in successful!');
    } catch (error) {
      console.error('Google sign-in failed:', error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Google Sign-In Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Test Google OAuth integration in development mode
          </p>
          <Button onClick={handleTestGoogleSignIn} className="w-full">
            Test Google Sign-In
          </Button>
        </div>
        
        {isAuthenticated && user && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <h3 className="font-medium text-green-800">Authentication Successful!</h3>
            <div className="mt-2 text-sm text-green-700">
              <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p><strong>ID:</strong> {user.id}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
