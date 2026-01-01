import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { UserPlus, Mail, Phone, Briefcase, Shield, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface UserManagementProps {
  accessToken: string;
  projectId: string;
  currentUser: any;
  isDemoMode?: boolean;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  department: string;
  phone: string;
  created_at: string;
}

const roleColors: Record<string, string> = {
  admin: 'bg-red-100 text-red-800 border-red-200',
  receptionist: 'bg-blue-100 text-blue-800 border-blue-200',
  security: 'bg-green-100 text-green-800 border-green-200',
  host: 'bg-purple-100 text-purple-800 border-purple-200',
};

const rolePermissions: Record<string, string[]> = {
  admin: ['All Modules', 'User Management', 'Company Settings', 'Reports', 'Visitor Management', 'Appointments'],
  receptionist: ['Visitor Check-In', 'Visitor Log', 'Appointments', 'Dashboard'],
  security: ['Visitor Check-In', 'Visitor Check-Out', 'Visitor Log', 'Dashboard'],
  host: ['Appointments', 'Dashboard', 'Visitor Log (Own Only)'],
};

export function UserManagement({ accessToken, projectId, currentUser, isDemoMode }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    name: '',
    role: 'host',
    department: '',
    phone: '',
  });

  useEffect(() => {
    fetchUsers();
  }, [isDemoMode]);

  const fetchUsers = async () => {
    try {
      if (isDemoMode) {
        // Load users from localStorage for demo mode
        const storedUsers = localStorage.getItem('demo_users');
        if (storedUsers) {
          setUsers(JSON.parse(storedUsers));
        } else {
          // Initialize with current user
          const initialUsers = [
            {
              id: 'demo-user-1',
              email: currentUser?.email || 'admin@demo.com',
              name: currentUser?.name || 'Admin User',
              role: currentUser?.role || 'admin',
              department: 'Administration',
              phone: '+1 (555) 123-4567',
              created_at: new Date().toISOString(),
            }
          ];
          setUsers(initialUsers);
          localStorage.setItem('demo_users', JSON.stringify(initialUsers));
        }
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c8ca2e45/users`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAddUser = async () => {
    if (!newUser.email || !newUser.password || !newUser.name) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      if (isDemoMode) {
        // Demo mode: Add user to localStorage
        const storedUsers = localStorage.getItem('demo_users');
        const currentUsers = storedUsers ? JSON.parse(storedUsers) : [];
        
        // Check if user already exists
        const userExists = currentUsers.some((u: User) => u.email === newUser.email);
        if (userExists) {
          toast.error('User with this email already exists');
          setLoading(false);
          return;
        }
        
        const newUserData: User = {
          id: `demo-user-${Date.now()}`,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          department: newUser.department,
          phone: newUser.phone,
          created_at: new Date().toISOString(),
        };
        
        const updatedUsers = [...currentUsers, newUserData];
        localStorage.setItem('demo_users', JSON.stringify(updatedUsers));
        setUsers(updatedUsers);
        
        toast.success(`✅ User created successfully! (Demo Mode)\nEmail: ${newUser.email}\nRole: ${newUser.role}`, { duration: 4000 });
        setShowAddUser(false);
        setNewUser({
          email: '',
          password: '',
          name: '',
          role: 'host',
          department: '',
          phone: '',
        });
        setLoading(false);
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c8ca2e45/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(newUser),
        }
      );

      if (response.ok) {
        toast.success('User created successfully');
        setShowAddUser(false);
        setNewUser({
          email: '',
          password: '',
          name: '',
          role: 'host',
          department: '',
          phone: '',
        });
        fetchUsers();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold mb-1">User Management</h2>
          <p className="text-sm text-muted-foreground">
            Manage users and assign roles with specific permissions
          </p>
        </div>
        <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account and assign role permissions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="new-name">Full Name *</Label>
                <Input
                  id="new-name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-email">Email *</Label>
                <Input
                  id="new-email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="john@company.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">Password *</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="••••••••"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-role">Role *</Label>
                  <Select
                    id="new-role"
                    value={newUser.role}
                    onValueChange={(e) => setNewUser({ ...newUser, role: e })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <SelectTrigger className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      <SelectValue>{newUser.role}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="receptionist">Receptionist</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="host">Host</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-department">Department</Label>
                  <Input
                    id="new-department"
                    value={newUser.department}
                    onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                    placeholder="IT"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-phone">Phone</Label>
                <Input
                  id="new-phone"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm font-medium mb-2">Role Permissions: {newUser.role}</p>
                <div className="flex flex-wrap gap-1">
                  {rolePermissions[newUser.role]?.map((perm, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {perm}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setShowAddUser(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddUser} disabled={loading}>
                  {loading ? 'Creating...' : 'Create User'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Users List */}
      <div className="grid grid-cols-1 gap-4">
        {users.map((user) => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold">{user.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={roleColors[user.role] || 'bg-gray-100 text-gray-800'}>
                          {user.role}
                        </Badge>
                        {user.id === currentUser?.id && (
                          <Badge variant="outline" className="text-xs">You</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {user.email}
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        {user.phone}
                      </div>
                    )}
                    {user.department && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Briefcase className="h-4 w-4" />
                        {user.department}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium">Permissions:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {rolePermissions[user.role]?.map((perm, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs bg-white">
                          {perm}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {users.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <UserPlus className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-muted-foreground">No users found. Add your first user to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}