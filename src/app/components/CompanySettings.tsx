import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Building2, Upload, Save, Database } from 'lucide-react';
import { toast } from 'sonner';
import { DatabaseSettings } from './DatabaseSettings';

interface CompanySettingsProps {
  accessToken: string;
  projectId: string;
  isDemoMode?: boolean;
}

interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logo_url: string;
}

export function CompanySettings({ accessToken, projectId, isDemoMode }: CompanySettingsProps) {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    logo_url: '',
  });
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>('');

  useEffect(() => {
    fetchCompanyInfo();
  }, [isDemoMode]);

  const fetchCompanyInfo = async () => {
    try {
      if (isDemoMode) {
        // Load from localStorage for demo mode
        const storedCompanyInfo = localStorage.getItem('demo_company_info');
        if (storedCompanyInfo) {
          const parsed = JSON.parse(storedCompanyInfo);
          setCompanyInfo(parsed);
          setLogoPreview(parsed.logo_url || '');
        } else {
          // Set default demo company info
          const defaultInfo = {
            name: 'Demo Corporation',
            address: '123 Business Avenue, Suite 100, Tech City, TC 12345',
            phone: '+1 (555) 987-6543',
            email: 'info@democorp.com',
            website: 'www.democorp.com',
            logo_url: '',
          };
          setCompanyInfo(defaultInfo);
          localStorage.setItem('demo_company_info', JSON.stringify(defaultInfo));
        }
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c8ca2e45/company/settings`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.company) {
          setCompanyInfo(data.company);
          setLogoPreview(data.company.logo_url || '');
        }
      }
    } catch (error) {
      console.error('Error fetching company info:', error);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setLogoPreview(base64String);
        setCompanyInfo({ ...companyInfo, logo_url: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!companyInfo.name) {
      toast.error('Company name is required');
      return;
    }

    setLoading(true);
    try {
      if (isDemoMode) {
        // Demo mode: Save to localStorage
        localStorage.setItem('demo_company_info', JSON.stringify(companyInfo));
        
        // Also trigger a page reload to update the header
        window.dispatchEvent(new Event('storage'));
        
        toast.success('✅ Company settings saved successfully! (Demo Mode)\nRefresh page to see logo in header.', { 
          duration: 5000 
        });
        setLoading(false);
        
        // Suggest refresh to see changes
        setTimeout(() => {
          if (confirm('Settings saved! Refresh the page to see your company logo and name in the header?')) {
            window.location.reload();
          }
        }, 1000);
        
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c8ca2e45/company/settings`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(companyInfo),
        }
      );

      if (response.ok) {
        toast.success('Company settings saved successfully');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving company info:', error);
      toast.error('Failed to save company settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold mb-1">Company Settings</h2>
        <p className="text-sm text-muted-foreground">
          Configure your organization's details and branding
        </p>
      </div>

      <Tabs defaultValue="company">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
        </TabsList>
        <TabsContent value="company">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Logo Upload */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Company Logo
                </CardTitle>
                <CardDescription>Upload your organization's logo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center">
                  {logoPreview ? (
                    <div className="w-48 h-48 border-2 border-dashed rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
                      <img
                        src={logoPreview}
                        alt="Company Logo"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-48 h-48 border-2 border-dashed rounded-lg flex items-center justify-center bg-gray-50">
                      <div className="text-center">
                        <Building2 className="h-12 w-12 mx-auto text-gray-400" />
                        <p className="mt-2 text-sm text-muted-foreground">No logo uploaded</p>
                      </div>
                    </div>
                  )}
                  
                  <Label htmlFor="logo-upload" className="mt-4 cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                      <Upload className="h-4 w-4" />
                      Choose Logo
                    </div>
                    <Input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Company Details */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Enter your organization's details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name *</Label>
                    <Input
                      id="company-name"
                      value={companyInfo.name}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
                      placeholder="Acme Corporation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company-email">Email</Label>
                    <Input
                      id="company-email"
                      type="email"
                      value={companyInfo.email}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
                      placeholder="contact@company.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company-phone">Phone</Label>
                    <Input
                      id="company-phone"
                      value={companyInfo.phone}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company-website">Website</Label>
                    <Input
                      id="company-website"
                      value={companyInfo.website}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, website: e.target.value })}
                      placeholder="www.company.com"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="company-address">Address</Label>
                    <Input
                      id="company-address"
                      value={companyInfo.address}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                      placeholder="123 Business St, City, State 12345"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleSave} disabled={loading || !companyInfo.name}>
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? 'Saving...' : 'Save Settings'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="database">
          <DatabaseSettings accessToken={accessToken} projectId={projectId} isDemoMode={isDemoMode} />
        </TabsContent>
      </Tabs>
    </div>
  );
}