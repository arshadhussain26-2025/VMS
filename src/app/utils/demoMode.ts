// Demo mode utilities - simulates backend when Edge Function is not deployed

export interface DemoVisitor {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  company: string;
  purpose: string;
  id_proof_type: string;
  id_proof_number: string;
  badge_number: string;
  status: 'checked_in' | 'checked_out';
  check_in_time: string;
  check_out_time: string | null;
  checked_in_by: string;
  host_name: string | null;
  host_department: string | null;
}

export interface DemoAppointment {
  id: string;
  visitor_name: string;
  visitor_email: string;
  visitor_phone: string | null;
  visitor_company: string | null;
  host_name: string;
  host_email: string;
  host_department: string | null;
  scheduled_time: string;
  duration_minutes: number;
  purpose: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes: string | null;
  created_at: string;
}

// Local storage keys
const DEMO_VISITORS_KEY = 'vms_demo_visitors';
const DEMO_APPOINTMENTS_KEY = 'vms_demo_appointments';

// Initialize demo data
function initializeDemoData() {
  if (!localStorage.getItem(DEMO_VISITORS_KEY)) {
    const demoVisitors: DemoVisitor[] = [
      {
        id: 'demo-1',
        full_name: 'John Demo',
        email: 'john@demo.com',
        phone: '+1-555-0001',
        company: 'Demo Corp',
        purpose: 'Business Meeting',
        id_proof_type: 'drivers_license',
        id_proof_number: 'DEMO123',
        badge_number: 'VMS-DEMO01',
        status: 'checked_in',
        check_in_time: new Date(Date.now() - 3600000).toISOString(),
        check_out_time: null,
        checked_in_by: 'demo-user',
        host_name: 'Jane Smith',
        host_department: 'Sales',
      },
      {
        id: 'demo-2',
        full_name: 'Sarah Test',
        email: 'sarah@test.com',
        phone: '+1-555-0002',
        company: 'Test Industries',
        purpose: 'Interview',
        id_proof_type: 'passport',
        id_proof_number: 'TEST456',
        badge_number: 'VMS-DEMO02',
        status: 'checked_out',
        check_in_time: new Date(Date.now() - 7200000).toISOString(),
        check_out_time: new Date(Date.now() - 3600000).toISOString(),
        checked_in_by: 'demo-user',
        host_name: 'Bob Johnson',
        host_department: 'HR',
      },
    ];
    localStorage.setItem(DEMO_VISITORS_KEY, JSON.stringify(demoVisitors));
  }

  if (!localStorage.getItem(DEMO_APPOINTMENTS_KEY)) {
    const demoAppointments: DemoAppointment[] = [
      {
        id: 'appt-demo-1',
        visitor_name: 'Mike Wilson',
        visitor_email: 'mike@example.com',
        visitor_phone: '+1-555-0003',
        visitor_company: 'Example LLC',
        host_name: 'Alice Brown',
        host_email: 'alice@company.com',
        host_department: 'Engineering',
        scheduled_time: new Date(Date.now() + 86400000).toISOString(),
        duration_minutes: 60,
        purpose: 'Project Discussion',
        status: 'confirmed',
        notes: 'Demo appointment',
        created_at: new Date().toISOString(),
      },
    ];
    localStorage.setItem(DEMO_APPOINTMENTS_KEY, JSON.stringify(demoAppointments));
  }
}

// Demo API functions
export const demoAPI = {
  // Check in visitor
  async checkInVisitor(visitorData: any): Promise<DemoVisitor> {
    initializeDemoData();
    
    const visitors = JSON.parse(localStorage.getItem(DEMO_VISITORS_KEY) || '[]');
    const newVisitor: DemoVisitor = {
      id: `demo-${Date.now()}`,
      ...visitorData,
      badge_number: 'VMS-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      status: 'checked_in',
      check_in_time: new Date().toISOString(),
      check_out_time: null,
      checked_in_by: 'demo-user',
    };
    
    visitors.unshift(newVisitor);
    localStorage.setItem(DEMO_VISITORS_KEY, JSON.stringify(visitors));
    
    return newVisitor;
  },

  // Get all visitors
  async getVisitors(): Promise<DemoVisitor[]> {
    initializeDemoData();
    return JSON.parse(localStorage.getItem(DEMO_VISITORS_KEY) || '[]');
  },

  // Check out visitor
  async checkOutVisitor(visitorId: string): Promise<DemoVisitor> {
    const visitors = JSON.parse(localStorage.getItem(DEMO_VISITORS_KEY) || '[]');
    const index = visitors.findIndex((v: DemoVisitor) => v.id === visitorId);
    
    if (index === -1) {
      throw new Error('Visitor not found');
    }
    
    visitors[index].status = 'checked_out';
    visitors[index].check_out_time = new Date().toISOString();
    
    localStorage.setItem(DEMO_VISITORS_KEY, JSON.stringify(visitors));
    return visitors[index];
  },

  // Get statistics
  async getStats() {
    initializeDemoData();
    const visitors = JSON.parse(localStorage.getItem(DEMO_VISITORS_KEY) || '[]');
    const appointments = JSON.parse(localStorage.getItem(DEMO_APPOINTMENTS_KEY) || '[]');
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return {
      stats: {
        currently_checked_in: visitors.filter((v: DemoVisitor) => v.status === 'checked_in').length,
        total_today: visitors.filter((v: DemoVisitor) => 
          new Date(v.check_in_time) >= today
        ).length,
        total_all_time: visitors.length,
        upcoming_appointments: appointments.filter((a: DemoAppointment) => 
          new Date(a.scheduled_time) > new Date() && 
          ['pending', 'confirmed'].includes(a.status)
        ).length,
      }
    };
  },

  // Create appointment
  async createAppointment(appointmentData: any): Promise<DemoAppointment> {
    initializeDemoData();
    
    const appointments = JSON.parse(localStorage.getItem(DEMO_APPOINTMENTS_KEY) || '[]');
    const newAppointment: DemoAppointment = {
      id: `appt-demo-${Date.now()}`,
      visitor_name: appointmentData.visitor_name,
      visitor_email: appointmentData.visitor_email || null,
      visitor_phone: appointmentData.visitor_phone || null,
      visitor_company: appointmentData.visitor_company || null,
      host_name: appointmentData.host_name || 'Demo Host',
      host_email: appointmentData.host_email || 'host@demo.com',
      host_department: appointmentData.host_department || null,
      scheduled_time: appointmentData.scheduled_time,
      duration_minutes: appointmentData.duration_minutes || 60,
      purpose: appointmentData.purpose,
      status: 'pending',
      notes: appointmentData.notes || null,
      created_at: new Date().toISOString(),
    };
    
    appointments.unshift(newAppointment);
    localStorage.setItem(DEMO_APPOINTMENTS_KEY, JSON.stringify(appointments));
    
    console.log('✅ Demo appointment created:', newAppointment);
    
    return newAppointment;
  },

  // Get all appointments
  async getAppointments(): Promise<DemoAppointment[]> {
    initializeDemoData();
    return JSON.parse(localStorage.getItem(DEMO_APPOINTMENTS_KEY) || '[]');
  },

  // Cancel appointment
  async cancelAppointment(appointmentId: string): Promise<DemoAppointment> {
    const appointments = JSON.parse(localStorage.getItem(DEMO_APPOINTMENTS_KEY) || '[]');
    const index = appointments.findIndex((a: DemoAppointment) => a.id === appointmentId);
    
    if (index === -1) {
      throw new Error('Appointment not found');
    }
    
    appointments[index].status = 'cancelled';
    
    localStorage.setItem(DEMO_APPOINTMENTS_KEY, JSON.stringify(appointments));
    return appointments[index];
  },

  // Clear all demo data
  clearDemoData() {
    localStorage.removeItem(DEMO_VISITORS_KEY);
    localStorage.removeItem(DEMO_APPOINTMENTS_KEY);
  },
};

// Check if backend is available
export async function isBackendAvailable(projectId: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-c8ca2e45/health`,
      { 
        method: 'GET',
        signal: AbortSignal.timeout(5000), // 5 second timeout
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      return data.status === 'ok';
    }
    return false;
  } catch (error) {
    return false;
  }
}