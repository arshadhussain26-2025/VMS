import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  Book, 
  Users, 
  UserCheck, 
  Calendar, 
  FileText, 
  Settings, 
  HelpCircle,
  Search,
  X,
  ChevronRight,
  Home,
  LogIn,
  UserPlus,
  CheckCircle2,
  BarChart3
} from 'lucide-react';

interface HelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userRole?: string;
}

export function HelpDialog({ open, onOpenChange, userRole = 'admin' }: HelpDialogProps) {
  const [selectedSection, setSelectedSection] = useState<string>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const sections = [
    { id: 'overview', title: 'Overview', icon: Home },
    { id: 'login', title: 'Login & Authentication', icon: LogIn },
    { id: 'dashboard', title: 'Dashboard', icon: BarChart3 },
    { id: 'visitors', title: 'Visitor Management', icon: Users },
    { id: 'checkin', title: 'Check-In Process', icon: UserCheck },
    { id: 'appointments', title: 'Appointments', icon: Calendar },
    { id: 'reports', title: 'Reports', icon: FileText },
    { id: 'users', title: 'User Management', icon: UserPlus },
    { id: 'settings', title: 'Company Settings', icon: Settings },
    { id: 'faq', title: 'FAQ', icon: HelpCircle },
  ];

  const getContent = () => {
    switch (selectedSection) {
      case 'overview':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Welcome to Visitor Management System</h3>
            <p className="text-gray-700">
              A comprehensive enterprise solution designed to streamline visitor tracking, appointment scheduling, 
              and reception desk operations.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Key Features</h4>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span><strong>Real-time Visitor Tracking</strong> - Monitor who is currently on premises</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span><strong>Digital Check-In/Check-Out</strong> - Quick and efficient visitor processing</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span><strong>Appointment Scheduling</strong> - Manage scheduled visits and meetings</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span><strong>Role-Based Access Control</strong> - Different permissions for different roles</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span><strong>Analytics Dashboard</strong> - Visual insights into visitor patterns</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Your Current Role: {userRole?.toUpperCase()}</h4>
              <p className="text-sm text-gray-600">
                {userRole === 'admin' && 'You have full access to all features including user management and settings.'}
                {userRole === 'receptionist' && 'You can check-in visitors, manage appointments, and access reports.'}
                {userRole === 'security' && 'You can view active visitors and check-in/check-out visitors.'}
                {userRole === 'host' && 'You can view your own appointments and scheduled visitors.'}
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 mb-2">💡 Quick Tip</h4>
              <p className="text-sm text-yellow-800">
                Use the navigation tabs at the top to access different modules. Click on any section in this help dialog to learn more!
              </p>
            </div>
          </div>
        );

      case 'login':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Login & Authentication</h3>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Demo Mode Credentials</h4>
              <div className="space-y-1 text-sm text-blue-800">
                <p><strong>Email:</strong> <code className="bg-blue-100 px-2 py-1 rounded">admin@demo.com</code></p>
                <p><strong>Password:</strong> <code className="bg-blue-100 px-2 py-1 rounded">admin123</code></p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Login Process</h4>
              <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
                <li>Enter your email address (work email provided by administrator)</li>
                <li>Enter your password (case-sensitive)</li>
                <li>Click "Log In" button</li>
                <li>You'll be redirected to the dashboard upon successful login</li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Creating New Account</h4>
              <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
                <li>Click "Need an account? Sign up" on login screen</li>
                <li>Fill in: Full Name, Email, Password, Role</li>
                <li>Click "Sign Up"</li>
                <li>You'll be automatically logged in</li>
              </ol>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 mb-2">Forgot Password?</h4>
              <p className="text-sm text-yellow-800">
                Contact your system administrator to reset your password. They can reset it from the User Management section.
              </p>
            </div>
          </div>
        );

      case 'dashboard':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Dashboard Overview</h3>
            
            <p className="text-gray-700">
              The dashboard is your central hub for monitoring visitor activity and accessing system features.
            </p>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Dashboard Cards</h4>
              <div className="space-y-3">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <h5 className="font-semibold text-sm text-gray-900 mb-1">1. Active Visitors</h5>
                  <p className="text-xs text-gray-600">Shows currently checked-in visitors with details on today's total and awaiting check-in.</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <h5 className="font-semibold text-sm text-gray-900 mb-1">2. Appointments</h5>
                  <p className="text-xs text-gray-600">Displays upcoming appointments with counts for upcoming, in-progress, and completed.</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <h5 className="font-semibold text-sm text-gray-900 mb-1">3. Check-Ins Today</h5>
                  <p className="text-xs text-gray-600">Total check-ins for today with breakdown of scheduled vs walk-ins.</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <h5 className="font-semibold text-sm text-gray-900 mb-1">4. Recent Check-Ins</h5>
                  <p className="text-xs text-gray-600">List of the last 3 visitor check-ins with names and companies.</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <h5 className="font-semibold text-sm text-gray-900 mb-1">5. Overall Statistics</h5>
                  <p className="text-xs text-gray-600">Total visitors, daily average, and check-in success rate.</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">💡 Quick Actions</h4>
              <p className="text-sm text-blue-800">
                Each card has a "View" button that takes you directly to that section for more details.
              </p>
            </div>
          </div>
        );

      case 'visitors':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Visitor Management</h3>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Adding a New Visitor</h4>
              <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
                <li>Click the "Add Visitor" button (top right of Visitors page)</li>
                <li>Fill in required fields: Full Name, Company, Phone, Email, Purpose, Host Name</li>
                <li>Optionally add: Badge Number, Vehicle Registration, Notes</li>
                <li>Click "Save"</li>
                <li>Visitor appears in list with "Awaiting Check-In" status</li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Viewing Visitors</h4>
              <ul className="space-y-1 text-sm text-gray-700 list-disc list-inside">
                <li>All visitors displayed in table format</li>
                <li>🟢 Green dot = Currently checked in</li>
                <li>⚫ Gray dot = Checked out</li>
                <li>Use search bar to find specific visitors</li>
                <li>Filter by date range, status, company, or purpose</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Editing Visitor Information</h4>
              <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
                <li>Locate visitor in the list</li>
                <li>Click the Edit icon (pencil) next to their name</li>
                <li>Update necessary information</li>
                <li>Click "Save Changes"</li>
              </ol>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">💡 Pro Tip</h4>
              <p className="text-sm text-blue-800">
                You can export visitor data to CSV or Excel format using the "Export" button. Great for reporting!
              </p>
            </div>
          </div>
        );

      case 'checkin':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Check-In Process</h3>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Walk-In Visitor Check-In</h4>
              <p className="text-sm text-gray-600 mb-2">For visitors without prior appointments:</p>
              <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
                <li>Click "Check-In" tab</li>
                <li>Click "Walk-In Visitor" button</li>
                <li>Fill in visitor information: Name, Company, Phone, Email, Purpose, Host</li>
                <li>Click "Check In" button</li>
                <li>Visitor is now checked in! 🟢</li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Scheduled Visitor Check-In</h4>
              <p className="text-sm text-gray-600 mb-2">For visitors with appointments:</p>
              <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
                <li>Click "Check-In" tab</li>
                <li>View today's scheduled arrivals</li>
                <li>Locate the visitor in the list</li>
                <li>Click "Check In" button next to their name</li>
                <li>Confirm check-in</li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Visitor Check-Out</h4>
              <p className="text-sm text-gray-600 mb-2">When a visitor is leaving:</p>
              <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
                <li>Go to "Visitors" tab or "Check-In" tab</li>
                <li>Locate the checked-in visitor (green dot 🟢)</li>
                <li>Click "Check Out" button</li>
                <li>Confirm check-out</li>
                <li>Check-out time is automatically recorded</li>
              </ol>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Important</h4>
              <p className="text-sm text-yellow-800">
                Always check out visitors at the end of the day for accurate tracking and security compliance.
              </p>
            </div>
          </div>
        );

      case 'appointments':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Appointments</h3>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Creating a New Appointment</h4>
              <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
                <li>Click "Appointments" tab</li>
                <li>Click "New Appointment" button</li>
                <li>Fill in visitor information: Name, Company, Email, Phone</li>
                <li>Set appointment details: Date, Time, Duration, Purpose</li>
                <li>Specify host and location</li>
                <li>Add any special requirements or notes</li>
                <li>Click "Create Appointment"</li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Appointment Status Colors</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-gray-700"><strong>Blue:</strong> Pending approval</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-gray-700"><strong>Green:</strong> Approved/Confirmed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-gray-700"><strong>Red:</strong> Rejected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                  <span className="text-gray-700"><strong>Gray:</strong> Completed</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Managing Appointments</h4>
              <ul className="space-y-1 text-sm text-gray-700 list-disc list-inside">
                <li><strong>Edit:</strong> Click edit icon to modify appointment details</li>
                <li><strong>Cancel:</strong> Click cancel button and provide reason</li>
                <li><strong>Approve:</strong> Review and approve pending appointments (Admin/Receptionist)</li>
                <li><strong>Check-In:</strong> When visitor arrives, check them in from the appointment</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">💡 Quick Tip</h4>
              <p className="text-sm text-blue-800">
                Email notifications are sent automatically when appointments are created, approved, or cancelled!
              </p>
            </div>
          </div>
        );

      case 'reports':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Reports & Analytics</h3>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Available Reports</h4>
              <div className="space-y-3">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <h5 className="font-semibold text-sm text-gray-900 mb-1">Daily Visitor Report</h5>
                  <p className="text-xs text-gray-600">Total visitors, peak hours, check-in vs check-out count, average visit duration</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <h5 className="font-semibold text-sm text-gray-900 mb-1">Weekly Summary</h5>
                  <p className="text-xs text-gray-600">Visitor trends, busiest days, department distribution, appointment ratios</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <h5 className="font-semibold text-sm text-gray-900 mb-1">Monthly Analytics</h5>
                  <p className="text-xs text-gray-600">Monthly statistics, month-over-month comparison, visitor type breakdown</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <h5 className="font-semibold text-sm text-gray-900 mb-1">Custom Reports</h5>
                  <p className="text-xs text-gray-600">Create reports with specific date ranges, filters, and criteria</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Exporting Reports</h4>
              <p className="text-sm text-gray-600 mb-2">All reports can be exported in multiple formats:</p>
              <ul className="space-y-1 text-sm text-gray-700 list-disc list-inside">
                <li><strong>PDF:</strong> Best for printing and viewing</li>
                <li><strong>Excel:</strong> Best for data analysis</li>
                <li><strong>CSV:</strong> Best for data processing</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">✅ Access Levels</h4>
              <p className="text-sm text-green-800">
                Admin and Receptionist have full report access. Security has limited access. Host users cannot access reports.
              </p>
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">
                <strong>⚠️ Admin Only:</strong> This feature is only available to users with Admin role.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Creating a New User</h4>
              <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
                <li>Click "Users" tab</li>
                <li>Click "Create User" button</li>
                <li>Fill in: Full Name, Email, Phone, Role, Password</li>
                <li>Optionally add: Department, Employee ID, Notes</li>
                <li>Click "Create User"</li>
                <li>User receives welcome email with credentials</li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">User Roles</h4>
              <div className="space-y-2 text-sm">
                <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                  <strong className="text-red-900">Admin:</strong>
                  <span className="text-red-800"> Full system access, user management, settings</span>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                  <strong className="text-blue-900">Receptionist:</strong>
                  <span className="text-blue-800"> Visitor management, appointments, reports</span>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                  <strong className="text-yellow-900">Security:</strong>
                  <span className="text-yellow-800"> View visitors, check-in/out, limited access</span>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                  <strong className="text-green-900">Host:</strong>
                  <span className="text-green-800"> View own appointments only</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Managing Users</h4>
              <ul className="space-y-1 text-sm text-gray-700 list-disc list-inside">
                <li><strong>Edit:</strong> Update user details, change role</li>
                <li><strong>Deactivate:</strong> Disable login without deleting user</li>
                <li><strong>Reset Password:</strong> Generate temporary password for user</li>
                <li><strong>Reactivate:</strong> Re-enable deactivated users</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Important</h4>
              <p className="text-sm text-yellow-800">
                You cannot edit your own role to prevent accidental loss of admin permissions!
              </p>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Company Settings</h3>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">
                <strong>⚠️ Admin Only:</strong> Settings are only available to users with Admin role.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Company Information</h4>
              <p className="text-sm text-gray-600 mb-2">Update your organization details:</p>
              <ul className="space-y-1 text-sm text-gray-700 list-disc list-inside">
                <li>Company Name</li>
                <li>Address (Street, City, State, ZIP)</li>
                <li>Phone Number and Email</li>
                <li>Website URL</li>
                <li>Operating Hours and Time Zone</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Uploading Company Logo</h4>
              <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
                <li>Go to Settings → Company Information</li>
                <li>Click "Choose File" under Logo Upload</li>
                <li>Select your logo file (PNG, JPG, or SVG)</li>
                <li>Image preview appears</li>
                <li>Scroll down and click "Save Settings"</li>
                <li>Logo appears in header immediately</li>
              </ol>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                <p className="text-xs text-blue-800">
                  <strong>Best practices:</strong> Use 200×200px square logo, PNG with transparent background, max 2MB
                </p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-900 mb-2">🚨 Critical: Save Your Changes!</h4>
              <p className="text-sm text-red-800">
                After making ANY changes, you MUST click "Save Settings" button at the bottom! 
                If you don't save, your changes will be lost!
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Notification Settings</h4>
              <p className="text-sm text-gray-600 mb-2">Configure email notifications for:</p>
              <ul className="space-y-1 text-sm text-gray-700 list-disc list-inside">
                <li>Appointment confirmations and reminders</li>
                <li>Check-in notifications to hosts</li>
                <li>Daily and weekly summaries</li>
                <li>System maintenance alerts</li>
              </ul>
            </div>
          </div>
        );

      case 'faq':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Frequently Asked Questions</h3>
            
            <div className="space-y-3">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <h4 className="font-semibold text-sm text-gray-900 mb-1">Q: What browsers are supported?</h4>
                <p className="text-xs text-gray-600">
                  A: Chrome (90+), Firefox (88+), Edge (90+), and Safari (14+). Chrome is recommended for best performance.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <h4 className="font-semibold text-sm text-gray-900 mb-1">Q: Can I access from my phone?</h4>
                <p className="text-xs text-gray-600">
                  A: Yes! The system is fully responsive and works on mobile devices, though desktop is recommended.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <h4 className="font-semibold text-sm text-gray-900 mb-1">Q: How do I change my password?</h4>
                <p className="text-xs text-gray-600">
                  A: Contact your system administrator to reset your password. They can do this from User Management.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <h4 className="font-semibold text-sm text-gray-900 mb-1">Q: How do I handle a walk-in visitor?</h4>
                <p className="text-xs text-gray-600">
                  A: Go to Check-In tab → Click "Walk-In Visitor" → Fill in details → Click Check In.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <h4 className="font-semibold text-sm text-gray-900 mb-1">Q: Can I edit visitor info after check-in?</h4>
                <p className="text-xs text-gray-600">
                  A: Yes! Go to Visitors tab → Find visitor → Click Edit icon → Make changes → Save.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <h4 className="font-semibold text-sm text-gray-900 mb-1">Q: What if visitor doesn't check out?</h4>
                <p className="text-xs text-gray-600">
                  A: Manually check them out at end of day. Go to Visitors → Find visitor → Click Check Out.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <h4 className="font-semibold text-sm text-gray-900 mb-1">Q: Who can access reports?</h4>
                <p className="text-xs text-gray-600">
                  A: Admin and Receptionist have full access. Security has limited access. Host users cannot access reports.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <h4 className="font-semibold text-sm text-gray-900 mb-1">Q: Can I customize the logo?</h4>
                <p className="text-xs text-gray-600">
                  A: Yes (Admin only). Go to Settings → Company Information → Upload Logo → Save Settings.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <h4 className="font-semibold text-sm text-gray-900 mb-1">Q: Is my data secure?</h4>
                <p className="text-xs text-gray-600">
                  A: Yes. The system uses JWT authentication, encrypted transmission, and role-based access control.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <h4 className="font-semibold text-sm text-gray-900 mb-1">Q: Can I export visitor data?</h4>
                <p className="text-xs text-gray-600">
                  A: Yes! Use the Export button in Visitors or Reports sections. Available as PDF, Excel, or CSV.
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Need More Help?</h4>
              <p className="text-sm text-blue-800">
                Contact your system administrator or IT support team for additional assistance.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const filteredSections = sections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[85vh] p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Book className="h-6 w-6 text-blue-600" />
            User Guide & Help
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Find answers to common questions and learn how to use the Visitor Management System.
          </DialogDescription>
          <div className="mt-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search help topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r bg-gray-50 overflow-y-auto">
            <div className="p-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2 px-3">Topics</h3>
              <nav className="space-y-1">
                {filteredSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setSelectedSection(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedSection === section.id
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span className="flex-1 text-left">{section.title}</span>
                      {selectedSection === section.id && (
                        <ChevronRight className="h-4 w-4 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {getContent()}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-3 bg-gray-50">
          <p className="text-xs text-gray-600 text-center">
            Visitor Management System v1.0 • For additional support, contact your system administrator
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}