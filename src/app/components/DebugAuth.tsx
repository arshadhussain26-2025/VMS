import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { projectId } from '../../../utils/supabase/info';
import { supabase } from '../../../utils/supabase/client';

interface DebugAuthProps {
  accessToken?: string;
  projectId?: string;
}

export function DebugAuth({ accessToken, projectId: propProjectId }: DebugAuthProps) {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const pid = propProjectId || projectId;

  const testAuth = async () => {
    setLoading(true);
    setResult(null);

    try {
      // Step 1: Get session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      console.log('Session:', session);
      console.log('Session error:', sessionError);

      if (!session?.access_token) {
        setResult({
          step: 'Get Session',
          error: 'No active session found. Please log in.',
          sessionError
        });
        setLoading(false);
        return;
      }

      const token = accessToken || session.access_token;

      // Step 2: Test debug endpoint
      const response = await fetch(
        `https://${pid}.supabase.co/functions/v1/make-server-c8ca2e45/debug/auth`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      
      setResult({
        step: 'Debug Auth Test',
        status: response.status,
        ok: response.ok,
        token: token.substring(0, 30) + '...',
        tokenLength: token.length,
        response: data
      });

    } catch (error: any) {
      setResult({
        step: 'Exception',
        error: error.message,
        stack: error.stack
      });
    }

    setLoading(false);
  };

  return (
    <Card className="p-6 space-y-4">
      <h3 className="font-semibold">Debug Authentication</h3>
      
      <Button onClick={testAuth} disabled={loading}>
        {loading ? 'Testing...' : 'Test Auth'}
      </Button>

      {result && (
        <div className="bg-gray-100 p-4 rounded text-xs font-mono overflow-auto max-h-96">
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

      <div className="text-sm text-gray-600 space-y-2">
        <p><strong>Instructions:</strong></p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Make sure you're logged in</li>
          <li>Click "Test Auth" button</li>
          <li>Check the result below</li>
          <li>If error, check browser console (F12)</li>
          <li>Check Supabase Edge Function logs</li>
        </ol>
      </div>
    </Card>
  );
}