import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { toast } from 'sonner';
import {
  Database,
  Download,
  Upload,
  Save,
  TestTube,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Server,
  HardDrive,
  Clock,
  Trash2,
  Plus,
  RefreshCw
} from 'lucide-react';

interface DatabaseConnection {
  id: string;
  name: string;
  type: 'postgresql' | 'mysql';
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  isActive: boolean;
  isDefault: boolean;
  createdAt: string;
  lastBackup?: string;
}

interface BackupFile {
  id: string;
  filename: string;
  databaseName: string;
  databaseType: 'postgresql' | 'mysql';
  size: string;
  createdAt: string;
  includesStructure: boolean;
  includesData: boolean;
  includesApplication: boolean;
}

interface DatabaseSettingsProps {
  accessToken: string;
  projectId: string;
  isDemoMode?: boolean;
}

export function DatabaseSettings({ accessToken, projectId, isDemoMode }: DatabaseSettingsProps) {
  const [activeTab, setActiveTab] = useState('connections');
  const [connections, setConnections] = useState<DatabaseConnection[]>([]);
  const [backups, setBackups] = useState<BackupFile[]>([]);
  const [showAddConnection, setShowAddConnection] = useState(false);
  const [showBackupDialog, setShowBackupDialog] = useState(false);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<BackupFile | null>(null);
  const [restoreMode, setRestoreMode] = useState<'overwrite' | 'new'>('overwrite');
  const [newDatabaseName, setNewDatabaseName] = useState('');
  const [testingConnection, setTestingConnection] = useState(false);
  const [backingUp, setBackingUp] = useState(false);
  const [restoring, setRestoring] = useState(false);

  // Form state for new connection
  const [formData, setFormData] = useState({
    name: '',
    type: 'postgresql' as 'postgresql' | 'mysql',
    host: 'localhost',
    port: 5432,
    database: '',
    username: '',
    password: '',
  });

  // Backup options
  const [backupOptions, setBackupOptions] = useState({
    includeStructure: true,
    includeData: true,
    includeApplication: true,
    compression: true,
  });

  useEffect(() => {
    loadConnections();
    loadBackups();
  }, []);

  const loadConnections = async () => {
    try {
      // In demo mode, load from localStorage
      const saved = localStorage.getItem('database_connections');
      if (saved) {
        setConnections(JSON.parse(saved));
      } else {
        // Default Supabase connection
        const defaultConnection: DatabaseConnection = {
          id: 'default',
          name: 'Supabase (Default)',
          type: 'postgresql',
          host: 'db.supabase.co',
          port: 5432,
          database: 'postgres',
          username: 'postgres',
          password: '••••••••',
          isActive: true,
          isDefault: true,
          createdAt: new Date().toISOString(),
        };
        setConnections([defaultConnection]);
      }
    } catch (error) {
      console.error('Error loading connections:', error);
      toast.error('Failed to load database connections');
    }
  };

  const loadBackups = async () => {
    try {
      const saved = localStorage.getItem('database_backups');
      if (saved) {
        setBackups(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading backups:', error);
    }
  };

  const saveConnections = (newConnections: DatabaseConnection[]) => {
    localStorage.setItem('database_connections', JSON.stringify(newConnections));
    setConnections(newConnections);
  };

  const saveBackups = (newBackups: BackupFile[]) => {
    localStorage.setItem('database_backups', JSON.stringify(newBackups));
    setBackups(newBackups);
  };

  const handleAddConnection = () => {
    setFormData({
      name: '',
      type: 'postgresql',
      host: 'localhost',
      port: 5432,
      database: '',
      username: '',
      password: '',
    });
    setShowAddConnection(true);
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    try {
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In production, this would actually test the connection
      toast.success('Connection test successful!', {
        description: `Connected to ${formData.type.toUpperCase()} database at ${formData.host}:${formData.port}`,
      });
    } catch (error) {
      toast.error('Connection test failed', {
        description: 'Please check your credentials and try again',
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSaveConnection = async () => {
    if (!formData.name || !formData.database || !formData.username) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newConnection: DatabaseConnection = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type,
      host: formData.host,
      port: formData.port,
      database: formData.database,
      username: formData.username,
      password: formData.password,
      isActive: false,
      isDefault: false,
      createdAt: new Date().toISOString(),
    };

    const updatedConnections = [...connections, newConnection];
    saveConnections(updatedConnections);
    setShowAddConnection(false);
    toast.success('Database connection added successfully!');
  };

  const handleSetDefault = (connectionId: string) => {
    const updatedConnections = connections.map(conn => ({
      ...conn,
      isDefault: conn.id === connectionId,
      isActive: conn.id === connectionId ? true : conn.isActive,
    }));
    saveConnections(updatedConnections);
    toast.success('Default database connection updated');
  };

  const handleDeleteConnection = (connectionId: string) => {
    const connection = connections.find(c => c.id === connectionId);
    if (connection?.isDefault) {
      toast.error('Cannot delete default connection');
      return;
    }

    const updatedConnections = connections.filter(c => c.id !== connectionId);
    saveConnections(updatedConnections);
    toast.success('Database connection deleted');
  };

  const handleCreateBackup = async () => {
    setBackingUp(true);
    try {
      // Simulate backup creation
      await new Promise(resolve => setTimeout(resolve, 3000));

      const defaultConnection = connections.find(c => c.isDefault);
      if (!defaultConnection) {
        throw new Error('No default connection found');
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `backup_${defaultConnection.database}_${timestamp}.sql${backupOptions.compression ? '.gz' : ''}`;

      const newBackup: BackupFile = {
        id: Date.now().toString(),
        filename,
        databaseName: defaultConnection.database,
        databaseType: defaultConnection.type,
        size: '12.5 MB',
        createdAt: new Date().toISOString(),
        includesStructure: backupOptions.includeStructure,
        includesData: backupOptions.includeData,
        includesApplication: backupOptions.includeApplication,
      };

      const updatedBackups = [newBackup, ...backups];
      saveBackups(updatedBackups);

      // Update last backup time
      const updatedConnections = connections.map(conn =>
        conn.isDefault ? { ...conn, lastBackup: new Date().toISOString() } : conn
      );
      saveConnections(updatedConnections);

      // In production, this would create an actual downloadable backup file
      const backupData = {
        metadata: {
          version: '1.0',
          created: new Date().toISOString(),
          database: defaultConnection.database,
          type: defaultConnection.type,
        },
        structure: backupOptions.includeStructure ? '-- Database structure SQL --' : null,
        data: backupOptions.includeData ? '-- Database data SQL --' : null,
        application: backupOptions.includeApplication ? '-- Application files --' : null,
      };

      // Download backup file
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);

      setShowBackupDialog(false);
      toast.success('Backup created successfully!', {
        description: `${filename} has been downloaded`,
      });
    } catch (error) {
      console.error('Backup error:', error);
      toast.error('Failed to create backup');
    } finally {
      setBackingUp(false);
    }
  };

  const handleRestoreBackup = async () => {
    if (!selectedBackup) return;

    if (restoreMode === 'new' && !newDatabaseName) {
      toast.error('Please enter a name for the new database');
      return;
    }

    setRestoring(true);
    try {
      // Simulate restore process
      await new Promise(resolve => setTimeout(resolve, 4000));

      if (restoreMode === 'overwrite') {
        toast.success('Database restored successfully!', {
          description: 'All data has been restored from the backup',
        });
      } else {
        // Create new database connection
        const newConnection: DatabaseConnection = {
          id: Date.now().toString(),
          name: newDatabaseName,
          type: selectedBackup.databaseType,
          host: 'localhost',
          port: selectedBackup.databaseType === 'postgresql' ? 5432 : 3306,
          database: newDatabaseName.toLowerCase().replace(/\s+/g, '_'),
          username: 'admin',
          password: '••••••••',
          isActive: true,
          isDefault: false,
          createdAt: new Date().toISOString(),
        };

        const updatedConnections = [...connections, newConnection];
        saveConnections(updatedConnections);

        toast.success('New database created successfully!', {
          description: 'You can now select it from the login screen',
        });
      }

      setShowRestoreDialog(false);
      setSelectedBackup(null);
      setRestoreMode('overwrite');
      setNewDatabaseName('');
    } catch (error) {
      console.error('Restore error:', error);
      toast.error('Failed to restore backup');
    } finally {
      setRestoring(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Database Management</h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage database connections, create backups, and restore data
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="connections">
            <Database className="h-4 w-4 mr-2" />
            Connections
          </TabsTrigger>
          <TabsTrigger value="backup">
            <Download className="h-4 w-4 mr-2" />
            Backup
          </TabsTrigger>
          <TabsTrigger value="restore">
            <Upload className="h-4 w-4 mr-2" />
            Restore
          </TabsTrigger>
        </TabsList>

        {/* Connections Tab */}
        <TabsContent value="connections" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Manage database connections for PostgreSQL and MySQL
            </p>
            <Button onClick={handleAddConnection}>
              <Plus className="h-4 w-4 mr-2" />
              Add Connection
            </Button>
          </div>

          <div className="grid gap-4">
            {connections.map((connection) => (
              <Card key={connection.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        connection.type === 'postgresql' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        <Database className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {connection.name}
                          {connection.isDefault && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              Default
                            </span>
                          )}
                        </CardTitle>
                        <CardDescription>
                          {connection.type.toUpperCase()} • {connection.host}:{connection.port}/{connection.database}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {connection.isActive ? (
                        <span className="flex items-center gap-1 text-xs text-green-600">
                          <CheckCircle2 className="h-4 w-4" />
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <AlertCircle className="h-4 w-4" />
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-gray-500">Username:</span>
                      <span className="ml-2 font-medium">{connection.username}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Created:</span>
                      <span className="ml-2 font-medium">
                        {new Date(connection.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {connection.lastBackup && (
                      <div className="col-span-2">
                        <span className="text-gray-500">Last Backup:</span>
                        <span className="ml-2 font-medium">
                          {new Date(connection.lastBackup).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {!connection.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(connection.id)}
                      >
                        Set as Default
                      </Button>
                    )}
                    {!connection.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteConnection(connection.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Backup Tab */}
        <TabsContent value="backup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Backup</CardTitle>
              <CardDescription>
                Backup your database structure, data, and application files
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>Backup Options</Label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={backupOptions.includeStructure}
                      onChange={(e) =>
                        setBackupOptions({ ...backupOptions, includeStructure: e.target.checked })
                      }
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">Include database structure (tables, indexes, constraints)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={backupOptions.includeData}
                      onChange={(e) =>
                        setBackupOptions({ ...backupOptions, includeData: e.target.checked })
                      }
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">Include all data (visitors, appointments, users)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={backupOptions.includeApplication}
                      onChange={(e) =>
                        setBackupOptions({ ...backupOptions, includeApplication: e.target.checked })
                      }
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">Include application files and settings</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={backupOptions.compression}
                      onChange={(e) =>
                        setBackupOptions({ ...backupOptions, compression: e.target.checked })
                      }
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">Compress backup file (.gz)</span>
                  </label>
                </div>
              </div>

              <Button onClick={handleCreateBackup} disabled={backingUp} className="w-full">
                {backingUp ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating Backup...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Create Backup Now
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Backup History</CardTitle>
              <CardDescription>
                View and manage your backup files
              </CardDescription>
            </CardHeader>
            <CardContent>
              {backups.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <HardDrive className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No backups created yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {backups.map((backup) => (
                    <div
                      key={backup.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <HardDrive className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-sm">{backup.filename}</p>
                          <p className="text-xs text-gray-500">
                            {backup.databaseName} • {backup.size} • {new Date(backup.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedBackup(backup);
                            setShowRestoreDialog(true);
                          }}
                        >
                          <Upload className="h-4 w-4 mr-1" />
                          Restore
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const updatedBackups = backups.filter(b => b.id !== backup.id);
                            saveBackups(updatedBackups);
                            toast.success('Backup deleted');
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Restore Tab */}
        <TabsContent value="restore" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Restore from Backup</CardTitle>
              <CardDescription>
                Upload a backup file to restore your database
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="backup-file">Select Backup File</Label>
                <Input
                  id="backup-file"
                  type="file"
                  accept=".sql,.gz,.zip,.json"
                  className="mt-1"
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-700 flex-shrink-0" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-semibold mb-1">Important:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Restoring will affect your database</li>
                      <li>Create a backup before restoring</li>
                      <li>Choose whether to overwrite or create new database</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Upload and Restore Backup
              </Button>
            </CardContent>
          </Card>

          {backups.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Available Backups</CardTitle>
                <CardDescription>
                  Restore from previously created backups
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {backups.slice(0, 5).map((backup) => (
                    <div
                      key={backup.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-sm">{backup.filename}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(backup.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedBackup(backup);
                          setShowRestoreDialog(true);
                        }}
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Restore
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Add Connection Dialog */}
      <Dialog open={showAddConnection} onOpenChange={setShowAddConnection}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Database Connection</DialogTitle>
            <DialogDescription>
              Configure a new PostgreSQL or MySQL database connection
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="conn-name">Connection Name *</Label>
                <Input
                  id="conn-name"
                  placeholder="My Database"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="conn-type">Database Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: 'postgresql' | 'mysql') => {
                    setFormData({
                      ...formData,
                      type: value,
                      port: value === 'postgresql' ? 5432 : 3306,
                    });
                  }}
                >
                  <SelectTrigger id="conn-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="postgresql">PostgreSQL</SelectItem>
                    <SelectItem value="mysql">MySQL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="conn-host">Host *</Label>
                <Input
                  id="conn-host"
                  placeholder="localhost"
                  value={formData.host}
                  onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="conn-port">Port *</Label>
                <Input
                  id="conn-port"
                  type="number"
                  value={formData.port}
                  onChange={(e) => setFormData({ ...formData, port: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="conn-database">Database Name *</Label>
              <Input
                id="conn-database"
                placeholder="visitor_management"
                value={formData.database}
                onChange={(e) => setFormData({ ...formData, database: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="conn-username">Username *</Label>
                <Input
                  id="conn-username"
                  placeholder="admin"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="conn-password">Password *</Label>
                <Input
                  id="conn-password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleTestConnection}
              disabled={testingConnection}
              className="w-full"
            >
              {testingConnection ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Testing Connection...
                </>
              ) : (
                <>
                  <TestTube className="h-4 w-4 mr-2" />
                  Test Connection
                </>
              )}
            </Button>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddConnection(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveConnection}>
              <Save className="h-4 w-4 mr-2" />
              Save Connection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restore Dialog */}
      <Dialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restore Database</DialogTitle>
            <DialogDescription>
              Choose how to restore the backup: {selectedBackup?.filename}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <RadioGroup value={restoreMode} onValueChange={(v: any) => setRestoreMode(v)}>
              <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="overwrite" id="overwrite" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="overwrite" className="font-medium cursor-pointer">
                    Overwrite Existing Database
                  </Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Replace all current data with the backup data. This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="new" id="new" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="new" className="font-medium cursor-pointer">
                    Create New Database
                  </Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Create a separate database from this backup. You can switch between databases at login.
                  </p>
                </div>
              </div>
            </RadioGroup>

            {restoreMode === 'new' && (
              <div className="space-y-2 ml-9">
                <Label htmlFor="new-db-name">New Database Name *</Label>
                <Input
                  id="new-db-name"
                  placeholder="e.g., visitor_db_backup_2024"
                  value={newDatabaseName}
                  onChange={(e) => setNewDatabaseName(e.target.value)}
                />
              </div>
            )}

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex gap-2">
                <AlertCircle className="h-5 w-5 text-red-700 flex-shrink-0" />
                <div className="text-sm text-red-800">
                  <p className="font-semibold">Warning:</p>
                  <p className="mt-1">
                    {restoreMode === 'overwrite'
                      ? 'All existing data will be permanently replaced. Create a backup first!'
                      : 'A new database connection will be created. You can select it at login.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRestoreDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRestoreBackup} disabled={restoring}>
              {restoring ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Restoring...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Restore Database
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}