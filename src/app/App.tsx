import { useState, useEffect } from 'react';
import { LoginForm } from './components/LoginForm';
import { Dashboard } from './components/Dashboard';
import { VisitorCheckIn } from './components/VisitorCheckIn';
import { VisitorList } from './components/VisitorList';
import { AppointmentManager } from './components/AppointmentManager';
import { CompanySettings } from './components/CompanySettings';
import { UserManagement } from './components/UserManagement';
import { Reports } from './components/Reports';
import { DebugAuth } from './components/DebugAuth';
import { DeploymentWarning } from './components/DeploymentWarning';
import { DemoModeBanner } from './components/DemoModeBanner';
import { HelpDialog } from './components/HelpDialog';
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/sonner';
import { 
  LogOut, 
  Users, 
  Calendar, 
  ClipboardList, 
  Home, 
  Settings, 
  UserCog, 
  FileText, 
  Building2, 
  Menu,
  Search,
  Bell,
  HelpCircle,
  User
} from 'lucide-react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { supabase } from '../../utils/supabase/client';
import { isBackendAvailable } from './utils/demoMode';

export default function App() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [companyInfo, setCompanyInfo] = useState<any>(null);
  const [activeView, setActiveView] = useState('home');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isCheckingBackend, setIsCheckingBackend] = useState(true);
  const [showHelpDialog, setShowHelpDialog] = useState(false);

  useEffect(() => {
    checkBackend();
    checkSession();
  }, []);

  useEffect(() => {
    if (accessToken) {
      if (isDemoMode) {
        // Load company info from localStorage in demo mode
        const storedCompanyInfo = localStorage.getItem('demo_company_info');
        if (storedCompanyInfo) {
          setCompanyInfo(JSON.parse(storedCompanyInfo));
        }
      } else {
        fetchCompanyInfo();
      }
    }
  }, [accessToken, isDemoMode]);

  const checkBackend = async () => {
    setIsCheckingBackend(true);
    const available = await isBackendAvailable(projectId);
    setIsDemoMode(!available);
    setIsCheckingBackend(false);
    
    if (!available) {
      console.log('ℹ️ Running in demo mode - backend will be connected after deployment');
    } else {
      console.log('✅ Backend connected - using production database');
    }
  };

  const checkSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session?.access_token) {
        setAccessToken(session.access_token);
        fetchUserProfile(session.access_token);
      }
    } catch (error) {
      console.error('Session check error:', error);
    }
  };

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c8ca2e45/user/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      // In demo mode, use local authentication
      if (isDemoMode) {
        // Check for demo users in localStorage
        const demoUsers = JSON.parse(localStorage.getItem('demo_users') || '[]');
        
        // If no users exist, create a default admin user
        if (demoUsers.length === 0) {
          const defaultUser = {
            id: 'demo-admin-1',
            email: 'admin@demo.com',
            password: 'admin123',
            name: 'Demo Admin',
            role: 'admin',
            phone: '+1-555-0000',
            created_at: new Date().toISOString(),
          };
          demoUsers.push(defaultUser);
          localStorage.setItem('demo_users', JSON.stringify(demoUsers));
        }
        
        // Find user with matching email and password
        const user = demoUsers.find((u: any) => 
          u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        
        if (!user) {
          throw new Error('Invalid login credentials. Try: admin@demo.com / admin123');
        }
        
        // Set a demo token
        const demoToken = 'demo-token-' + Date.now();
        setAccessToken(demoToken);
        setUser({
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          phone: user.phone,
        });
        
        console.log('✅ Demo login successful:', user.email);
        return;
      }
      
      // Production mode - use Supabase auth
      const { data: { session }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (session?.access_token) {
        setAccessToken(session.access_token);
        await fetchUserProfile(session.access_token);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Failed to login');
    }
  };

  const handleSignup = async (email: string, password: string, name: string, role: string) => {
    try {
      // In demo mode, use local storage
      if (isDemoMode) {
        const demoUsers = JSON.parse(localStorage.getItem('demo_users') || '[]');
        
        // Check if user already exists
        const existingUser = demoUsers.find((u: any) => 
          u.email.toLowerCase() === email.toLowerCase()
        );
        
        if (existingUser) {
          throw new Error('User with this email already exists');
        }
        
        // Create new demo user
        const newUser = {
          id: 'demo-user-' + Date.now(),
          email,
          password,
          name,
          role,
          phone: '',
          created_at: new Date().toISOString(),
        };
        
        demoUsers.push(newUser);
        localStorage.setItem('demo_users', JSON.stringify(demoUsers));
        
        console.log('✅ Demo user created:', email);
        
        // Auto-login after signup
        await handleLogin(email, password);
        return;
      }
      
      // Production mode - use backend API
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c8ca2e45/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ email, password, name, role }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      await handleLogin(email, password);
    } catch (error: any) {
      console.error('Signup error:', error);
      throw new Error(error.message || 'Failed to create account');
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setAccessToken(null);
      setUser(null);
      setActiveView('home');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleCheckInComplete = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const fetchCompanyInfo = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c8ca2e45/company/info`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCompanyInfo(data.company);
      }
    } catch (error) {
      console.error('Error fetching company info:', error);
    }
  };

  if (!accessToken) {
    return (
      <>
        <LoginForm onLogin={handleLogin} onSignup={handleSignup} />
        <Toaster />
      </>
    );
  }

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'visitors', label: 'Visitors', icon: Users },
    { id: 'checkin', label: 'Check-In', icon: ClipboardList },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'users', label: 'Users', icon: UserCog },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'debug', label: 'Debug', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 h-14">
          {/* Left Section - Company Logo and Name */}
          <div className="flex items-center gap-3">
            {/* Company Logo */}
            {companyInfo?.logo_url ? (
              <img
                src={companyInfo.logo_url}
                alt="Company Logo"
                className="h-10 w-10 object-contain"
              />
            ) : (
              <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
            )}
            
            {/* Company Name */}
            <div className="border-r border-gray-200 pr-4">
              <div className="font-semibold text-gray-800 text-sm">
                {companyInfo?.name || 'Company Name'}
              </div>
              <div className="text-xs text-gray-500">Organization</div>
            </div>
          </div>

          {/* Center Section - Software Logo and Name */}
          <div className="flex items-center gap-3 absolute left-1/2 transform -translate-x-1/2">
            <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="hidden md:block">
              <div className="font-semibold text-gray-800 text-sm">
                Visitor Management
              </div>
              <div className="text-xs text-gray-500">Reception System</div>
            </div>
          </div>

          {/* Right Section - User Info and Actions */}
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="hidden md:flex" 
              title="Help & User Guide"
              onClick={() => setShowHelpDialog(true)}
            >
              <HelpCircle className="h-5 w-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="sm" className="hidden md:flex" title="Notifications">
              <Bell className="h-5 w-5 text-gray-600" />
            </Button>
            
            {/* User Profile */}
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                <span className="text-white font-medium">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-medium text-gray-800">{user?.name || 'User'}</div>
                <div className="text-xs text-gray-500 capitalize">{user?.role || 'Staff'}</div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                title="Logout"
                className="ml-1"
              >
                <LogOut className="h-4 w-4 text-gray-600" />
              </Button>
            </div>
          </div>
        </div>

        {/* Secondary Navigation */}
        <div className="border-t border-gray-200 bg-white">
          <div className="flex items-center gap-1 px-4 overflow-x-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeView === item.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Show only demo mode banner when in demo mode */}
        {isDemoMode ? (
          <DemoModeBanner projectId={projectId} />
        ) : (
          <DeploymentWarning projectId={projectId} />
        )}

        {activeView === 'home' && (
          <Dashboard
            accessToken={accessToken}
            projectId={projectId}
            publicAnonKey={publicAnonKey}
            companyInfo={companyInfo}
            userName={user?.name}
            isDemoMode={isDemoMode}
            onNavigate={setActiveView}
          />
        )}

        {activeView === 'checkin' && (
          <VisitorCheckIn
            accessToken={accessToken}
            projectId={projectId}
            onCheckInComplete={handleCheckInComplete}
            isDemoMode={isDemoMode}
          />
        )}

        {activeView === 'visitors' && (
          <VisitorList
            accessToken={accessToken}
            projectId={projectId}
            refreshTrigger={refreshTrigger}
            isDemoMode={isDemoMode}
          />
        )}

        {activeView === 'appointments' && (
          <AppointmentManager 
            accessToken={accessToken} 
            projectId={projectId}
            isDemoMode={isDemoMode}
          />
        )}

        {activeView === 'settings' && (
          <CompanySettings
            accessToken={accessToken}
            projectId={projectId}
            isDemoMode={isDemoMode}
          />
        )}

        {activeView === 'users' && (
          <UserManagement
            accessToken={accessToken}
            projectId={projectId}
            currentUser={user}
            isDemoMode={isDemoMode}
          />
        )}

        {activeView === 'reports' && (
          <Reports
            accessToken={accessToken}
            projectId={projectId}
            isDemoMode={isDemoMode}
          />
        )}

        {activeView === 'debug' && (
          <DebugAuth
            accessToken={accessToken}
            projectId={projectId}
          />
        )}
      </main>

      {/* Help Dialog */}
      <HelpDialog 
        open={showHelpDialog} 
        onOpenChange={setShowHelpDialog}
        userRole={user?.role}
      />
    </div>
  );
}