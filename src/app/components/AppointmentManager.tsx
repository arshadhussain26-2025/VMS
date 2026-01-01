import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { Calendar, Plus } from 'lucide-react';
import { demoAPI } from '../utils/demoMode';

interface Appointment {
  id: string;
  visitor_name: string;
  visitor_email: string;
  visitor_phone: string;
  scheduled_time: string;
  purpose: string;
  status: string;
  created_at: string;
}

interface AppointmentManagerProps {
  accessToken: string;
  projectId: string;
  isDemoMode?: boolean;
}

export function AppointmentManager({ accessToken, projectId, isDemoMode }: AppointmentManagerProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    visitor_name: '',
    visitor_email: '',
    visitor_phone: '',
    scheduled_time: '',
    purpose: '',
  });

  useEffect(() => {
    fetchAppointments();
  }, [isDemoMode]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      if (isDemoMode) {
        // Use demo mode
        const demoAppointments = await demoAPI.getAppointments();
        setAppointments(demoAppointments);
        setLoading(false);
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c8ca2e45/appointments`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAppointments(data.appointments);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isDemoMode) {
        // Use demo mode
        const newAppointment = await demoAPI.createAppointment(formData);
        toast.success('✅ Appointment created successfully! (Demo Mode)', { duration: 5000 });
        setFormData({
          visitor_name: '',
          visitor_email: '',
          visitor_phone: '',
          scheduled_time: '',
          purpose: '',
        });
        setDialogOpen(false);
        fetchAppointments();
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c8ca2e45/appointments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        toast.success('Appointment created successfully');
        setFormData({
          visitor_name: '',
          visitor_email: '',
          visitor_phone: '',
          scheduled_time: '',
          purpose: '',
        });
        setDialogOpen(false);
        fetchAppointments();
      } else {
        const data = await response.json();
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create appointment');
    }
  };

  const handleUpdateStatus = async (appointmentId: string, newStatus: string) => {
    try {
      if (isDemoMode) {
        // In demo mode, just update the local state
        setAppointments(prev => 
          prev.map(apt => 
            apt.id === appointmentId 
              ? { ...apt, status: newStatus } 
              : apt
          )
        );
        toast.success(`✅ Appointment ${newStatus}! (Demo Mode)`, { duration: 3000 });
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c8ca2e45/appointments/${appointmentId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        toast.success(`Appointment ${newStatus}`);
        fetchAppointments();
      } else {
        const data = await response.json();
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update appointment');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: 'default' | 'secondary' | 'destructive' } = {
      pending: 'default',
      approved: 'secondary',
      completed: 'secondary',
      rejected: 'destructive',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  if (loading) {
    return <div className="p-6">Loading appointments...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Appointments</CardTitle>
            <CardDescription>Schedule and manage visitor appointments</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Appointment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule Appointment</DialogTitle>
                <DialogDescription>
                  Create a new appointment for an upcoming visitor
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateAppointment} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="visitor_name">Visitor Name *</Label>
                  <Input
                    id="visitor_name"
                    value={formData.visitor_name}
                    onChange={(e) =>
                      setFormData({ ...formData, visitor_name: e.target.value })
                    }
                    required
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="visitor_email">Visitor Email</Label>
                  <Input
                    id="visitor_email"
                    type="email"
                    value={formData.visitor_email}
                    onChange={(e) =>
                      setFormData({ ...formData, visitor_email: e.target.value })
                    }
                    placeholder="john@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="visitor_phone">Visitor Phone</Label>
                  <Input
                    id="visitor_phone"
                    value={formData.visitor_phone}
                    onChange={(e) =>
                      setFormData({ ...formData, visitor_phone: e.target.value })
                    }
                    placeholder="+1-555-0123"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scheduled_time">Scheduled Time *</Label>
                  <Input
                    id="scheduled_time"
                    type="datetime-local"
                    value={formData.scheduled_time}
                    onChange={(e) =>
                      setFormData({ ...formData, scheduled_time: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose *</Label>
                  <Textarea
                    id="purpose"
                    value={formData.purpose}
                    onChange={(e) =>
                      setFormData({ ...formData, purpose: e.target.value })
                    }
                    required
                    placeholder="Meeting with..."
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">Create Appointment</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setFormData({
                        visitor_name: '',
                        visitor_email: '',
                        visitor_phone: '',
                        scheduled_time: '',
                        purpose: '',
                      });
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Visitor</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Scheduled Time</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No appointments scheduled
                  </TableCell>
                </TableRow>
              ) : (
                appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="font-medium">{appointment.visitor_name}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {appointment.visitor_email && <div>{appointment.visitor_email}</div>}
                        {appointment.visitor_phone && (
                          <div className="text-muted-foreground">{appointment.visitor_phone}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(appointment.scheduled_time)}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{appointment.purpose}</TableCell>
                    <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                    <TableCell>
                      {appointment.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateStatus(appointment.id, 'approved')}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateStatus(appointment.id, 'rejected')}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                      {appointment.status === 'approved' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(appointment.id, 'completed')}
                        >
                          Mark Complete
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}