import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';
import { UserPlus, CheckCircle } from 'lucide-react';
import { demoAPI } from '../utils/demoMode';

interface VisitorCheckInProps {
  accessToken: string;
  projectId: string;
  onCheckInComplete: () => void;
  isDemoMode?: boolean;
}

export function VisitorCheckIn({ accessToken, projectId, onCheckInComplete, isDemoMode }: VisitorCheckInProps) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    company: '',
    purpose: '',
    id_proof_type: 'drivers_license',
    id_proof_number: '',
  });
  const [loading, setLoading] = useState(false);
  const [recentCheckIn, setRecentCheckIn] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Try demo mode first if enabled
      if (isDemoMode) {
        const visitor = await demoAPI.checkInVisitor(formData);
        toast.success('✅ Visitor checked in successfully! (Demo Mode - Data saved locally)', { duration: 5000 });
        setRecentCheckIn(visitor);
        
        // Reset form
        setFormData({
          full_name: '',
          email: '',
          phone: '',
          company: '',
          purpose: '',
          id_proof_type: 'drivers_license',
          id_proof_number: '',
        });

        onCheckInComplete();
        setTimeout(() => setRecentCheckIn(null), 5000);
        return;
      }

      console.log('=== CHECK-IN DEBUG ===');
      console.log('Access Token:', accessToken ? accessToken.substring(0, 30) + '...' : 'MISSING');
      console.log('Project ID:', projectId);
      console.log('Form Data:', formData);

      const url = `https://${projectId}.supabase.co/functions/v1/make-server-c8ca2e45/visitors/checkin`;
      console.log('Request URL:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      console.log('Response Status:', response.status);
      console.log('Response OK:', response.ok);

      const data = await response.json();
      console.log('Response Data:', data);

      if (!response.ok) {
        const errorMessage = data.error || 'Failed to check in visitor';
        console.error('Check-in error response:', data);
        
        // Special handling for JWT errors - suggest enabling demo mode
        if (response.status === 401 || data.message === 'Invalid JWT') {
          throw new Error(`❌ BACKEND NOT DEPLOYED\n\nThe Edge Function hasn't been deployed to Supabase.\n\n🎭 The app is now in DEMO MODE with simulated data.\n\n🔧 To use real database:\n1. Open: https://supabase.com/dashboard/project/${projectId}/functions\n2. Deploy 'make-server-c8ca2e45' function\n3. Set environment variables\n4. Refresh page\n\n📖 See CRITICAL_INSTRUCTIONS.md for details.`);
        }
        
        throw new Error(errorMessage);
      }

      toast.success('Visitor checked in successfully!');
      setRecentCheckIn(data.visitor);
      
      // Reset form
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        company: '',
        purpose: '',
        id_proof_type: 'drivers_license',
        id_proof_number: '',
      });

      onCheckInComplete();

      // Clear recent check-in after 5 seconds
      setTimeout(() => setRecentCheckIn(null), 5000);
    } catch (error: any) {
      console.error('Check-in error:', error);
      const errorMessage = error.message || 'Failed to check in visitor';
      toast.error(errorMessage, { duration: 10000 });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-gray-600 mb-2">Visitor Check-In</h1>
        <p className="text-sm text-gray-500">Register a new visitor to the premises</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Check-In Form */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="border-b border-gray-200 bg-gray-50">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <UserPlus className="h-5 w-5 text-blue-600" />
              Visitor Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="full_name" className="text-gray-700 font-medium">
                    Full Name *
                  </Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                    placeholder="Enter visitor's full name"
                    className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="visitor@company.com"
                    className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-700 font-medium">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+1 (555) 123-4567"
                    className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company" className="text-gray-700 font-medium">
                    Company
                  </Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Company name"
                    className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="id_proof_type" className="text-gray-700 font-medium">
                    ID Proof Type *
                  </Label>
                  <select
                    id="id_proof_type"
                    name="id_proof_type"
                    value={formData.id_proof_type}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="drivers_license">Driver's License</option>
                    <option value="passport">Passport</option>
                    <option value="national_id">National ID</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="id_proof_number" className="text-gray-700 font-medium">
                    ID Proof Number *
                  </Label>
                  <Input
                    id="id_proof_number"
                    name="id_proof_number"
                    value={formData.id_proof_number}
                    onChange={handleChange}
                    required
                    placeholder="Enter ID number"
                    className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose" className="text-gray-700 font-medium">
                  Purpose of Visit *
                </Label>
                <Textarea
                  id="purpose"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  required
                  placeholder="Describe the reason for visiting"
                  rows={3}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setFormData({
                      full_name: '',
                      email: '',
                      phone: '',
                      company: '',
                      purpose: '',
                      id_proof_type: 'drivers_license',
                      id_proof_number: '',
                    })
                  }
                >
                  Clear Form
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                >
                  {loading ? 'Processing...' : 'Check In Visitor'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Success Message / Instructions */}
        <div className="space-y-6">
          {recentCheckIn ? (
            <Card className="shadow-sm border-green-200 bg-green-50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  Check-In Successful!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-green-700 font-medium">
                    {recentCheckIn.full_name}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Badge: {recentCheckIn.badge_number}
                  </p>
                </div>
                <div className="pt-3 border-t border-green-200">
                  <p className="text-xs text-green-700">
                    Checked in at {new Date(recentCheckIn.check_in_time).toLocaleTimeString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-gray-800">Check-In Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
                      1
                    </div>
                    <p>Collect visitor's personal information and ID proof</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
                      2
                    </div>
                    <p>Fill in all required fields marked with asterisk (*)</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
                      3
                    </div>
                    <p>Submit the form to generate a visitor badge</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
                      4
                    </div>
                    <p>Provide the badge number to the visitor</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="shadow-sm bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <p className="text-sm text-blue-800 font-medium mb-2">Quick Tips</p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Verify ID proof before check-in</li>
                <li>• Take a photo if required by policy</li>
                <li>• Notify the host of visitor arrival</li>
                <li>• Ensure visitor signs any required forms</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}