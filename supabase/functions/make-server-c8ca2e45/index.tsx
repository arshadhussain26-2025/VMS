import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Initialize Supabase client with service role key for admin operations
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  }
);

// Helper function to get authenticated user
async function getAuthUser(authHeader: string | undefined) {
  if (!authHeader) {
    console.error('No authorization header provided');
    return { error: 'Unauthorized: No access token provided', status: 401 };
  }

  const token = authHeader.replace('Bearer ', '').trim();
  
  if (!token) {
    console.error('Empty token after extracting from header');
    return { error: 'Unauthorized: Invalid token format', status: 401 };
  }

  try {
    // Use admin client to get user - this works with any valid JWT
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    
    if (error) {
      console.error('Auth error:', error.message);
      return { error: 'Unauthorized: ' + error.message, status: 401 };
    }
    
    if (!user) {
      console.error('No user returned from getUser');
      return { error: 'Unauthorized: Invalid token', status: 401 };
    }

    console.log('Auth successful for user:', user.email);
    return { user };
  } catch (error) {
    console.error('Exception in getAuthUser:', error);
    return { error: 'Unauthorized: Authentication failed', status: 401 };
  }
}

// Helper function to get user profile
async function getUserProfile(authUserId: string) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('auth_user_id', authUserId)
    .single();

  return { data, error };
}

// Helper function to log audit trail
async function logAudit(userId: string, action: string, entityType: string, entityId: string, oldValues: any = null, newValues: any = null) {
  await supabaseAdmin
    .from('audit_logs')
    .insert({
      user_id: userId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      old_values: oldValues,
      new_values: newValues,
    });
}

// =====================================================
// HEALTH CHECK
// =====================================================
app.get("/make-server-c8ca2e45/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// =====================================================
// DEBUG ENDPOINT - Test JWT validation
// =====================================================
app.post("/make-server-c8ca2e45/debug/auth", async (c) => {
  const authHeader = c.req.header('Authorization');
  
  console.log('=== DEBUG AUTH ===');
  console.log('Authorization header:', authHeader);
  console.log('SUPABASE_URL:', Deno.env.get('SUPABASE_URL') ? 'Set' : 'NOT SET');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ? 'Set (length: ' + (Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '').length + ')' : 'NOT SET');
  
  if (!authHeader) {
    return c.json({ error: 'No Authorization header', debug: true });
  }
  
  const token = authHeader.replace('Bearer ', '').trim();
  console.log('Token extracted, length:', token.length);
  console.log('Token first 20 chars:', token.substring(0, 20));
  
  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    
    console.log('Auth result - Error:', error);
    console.log('Auth result - User:', user ? user.email : 'null');
    
    if (error) {
      return c.json({ 
        error: error.message, 
        errorDetails: error,
        debug: true 
      });
    }
    
    if (!user) {
      return c.json({ 
        error: 'No user returned',
        debug: true 
      });
    }
    
    return c.json({ 
      success: true, 
      user: {
        id: user.id,
        email: user.email,
        role: user.user_metadata?.role
      },
      debug: true 
    });
  } catch (error) {
    console.log('Exception:', error);
    return c.json({ 
      error: 'Exception: ' + error.message,
      debug: true 
    });
  }
});

// =====================================================
// AUTHENTICATION ENDPOINTS
// =====================================================

// User signup endpoint
app.post("/make-server-c8ca2e45/signup", async (c) => {
  try {
    const { email, password, name, role, department, phone } = await c.req.json();

    // Validate input
    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }

    if (password.length < 6) {
      return c.json({ error: 'Password must be at least 6 characters long' }, 400);
    }

    // Create auth user with Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, role: role || 'host' }
    });

    if (authError) {
      console.error('Auth creation error:', authError);
      return c.json({ error: authError.message }, 400);
    }

    // Create user profile in database
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        email,
        name,
        role: role || 'host',
        department: department || null,
        phone: phone || null,
        auth_user_id: authData.user.id,
      })
      .select()
      .single();

    if (userError) {
      console.error('User profile creation error:', userError);
      return c.json({ error: 'Failed to create user profile' }, 500);
    }

    return c.json({ 
      success: true, 
      user: userData,
      message: 'Account created successfully' 
    });
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ error: 'Internal server error during signup' }, 500);
  }
});

// Get user profile
app.get("/make-server-c8ca2e45/user/profile", async (c) => {
  try {
    const authResult = await getAuthUser(c.req.header('Authorization'));
    if (authResult.error) {
      return c.json({ error: authResult.error }, authResult.status);
    }

    const profileResult = await getUserProfile(authResult.user.id);
    if (profileResult.error) {
      return c.json({ error: 'User profile not found' }, 404);
    }

    return c.json({ user: profileResult.data });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return c.json({ error: 'Failed to fetch user profile' }, 500);
  }
});

// =====================================================
// USERS MANAGEMENT
// =====================================================

// Get all users
app.get("/make-server-c8ca2e45/users", async (c) => {
  try {
    const authResult = await getAuthUser(c.req.header('Authorization'));
    if (authResult.error) {
      return c.json({ error: authResult.error }, authResult.status);
    }

    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      return c.json({ error: 'Failed to fetch users' }, 500);
    }

    return c.json({ users: data || [] });
  } catch (error) {
    console.error('Error fetching users:', error);
    return c.json({ error: 'Failed to fetch users' }, 500);
  }
});

// =====================================================
// VISITORS ENDPOINTS
// =====================================================

// Check in visitor
app.post("/make-server-c8ca2e45/visitors/checkin", async (c) => {
  try {
    const authResult = await getAuthUser(c.req.header('Authorization'));
    if (authResult.error) {
      return c.json({ error: authResult.error }, authResult.status);
    }

    const userProfile = await getUserProfile(authResult.user.id);
    
    // If user profile doesn't exist, create it
    let userId = userProfile.data?.id;
    if (!userId) {
      console.log('User profile not found, creating one for auth user:', authResult.user.id);
      
      const { data: newUser, error: createError } = await supabaseAdmin
        .from('users')
        .insert({
          email: authResult.user.email,
          name: authResult.user.user_metadata?.name || authResult.user.email,
          role: authResult.user.user_metadata?.role || 'receptionist',
          auth_user_id: authResult.user.id,
        })
        .select()
        .single();
      
      if (createError) {
        console.error('Error creating user profile:', createError);
        return c.json({ error: 'Failed to create user profile: ' + createError.message }, 500);
      }
      
      userId = newUser.id;
    }
    
    const visitorData = await c.req.json();

    // Generate badge number
    const badgeNumber = 'VMS-' + Math.random().toString(36).substring(2, 8).toUpperCase();

    const { data, error } = await supabaseAdmin
      .from('visitors')
      .insert({
        full_name: visitorData.full_name,
        email: visitorData.email,
        phone: visitorData.phone,
        company: visitorData.company || null,
        purpose: visitorData.purpose,
        id_proof_type: visitorData.id_proof_type,
        id_proof_number: visitorData.id_proof_number,
        badge_number: badgeNumber,
        status: 'checked_in',
        checked_in_by: userId,
        host_name: visitorData.host_name || null,
        host_department: visitorData.host_department || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Check-in database error:', error);
      return c.json({ error: 'Failed to check in visitor: ' + error.message }, 500);
    }

    // Log audit
    try {
      await logAudit(userId, 'visitor_checkin', 'visitor', data.id, null, data);
    } catch (auditError) {
      console.error('Audit log error:', auditError);
      // Don't fail the check-in if audit fails
    }

    return c.json({ 
      success: true, 
      visitor: data,
      message: 'Visitor checked in successfully' 
    });
  } catch (error) {
    console.error('Check-in error:', error);
    return c.json({ error: 'Failed to check in visitor: ' + (error.message || 'Unknown error') }, 500);
  }
});

// Get all visitors
app.get("/make-server-c8ca2e45/visitors", async (c) => {
  try {
    const authResult = await getAuthUser(c.req.header('Authorization'));
    if (authResult.error) {
      return c.json({ error: authResult.error }, authResult.status);
    }

    const { data, error } = await supabaseAdmin
      .from('visitors')
      .select('*')
      .order('check_in_time', { ascending: false });

    if (error) {
      console.error('Error fetching visitors:', error);
      return c.json({ error: 'Failed to fetch visitors' }, 500);
    }

    return c.json({ visitors: data || [] });
  } catch (error) {
    console.error('Error fetching visitors:', error);
    return c.json({ error: 'Failed to fetch visitors' }, 500);
  }
});

// Check out visitor
app.post("/make-server-c8ca2e45/visitors/:id/checkout", async (c) => {
  try {
    const authResult = await getAuthUser(c.req.header('Authorization'));
    if (authResult.error) {
      return c.json({ error: authResult.error }, authResult.status);
    }

    const userProfile = await getUserProfile(authResult.user.id);
    const visitorId = c.req.param('id');

    const { data, error } = await supabaseAdmin
      .from('visitors')
      .update({
        status: 'checked_out',
        check_out_time: new Date().toISOString(),
        checked_out_by: userProfile.data?.id,
      })
      .eq('id', visitorId)
      .select()
      .single();

    if (error) {
      console.error('Check-out error:', error);
      return c.json({ error: 'Failed to check out visitor' }, 500);
    }

    // Log audit
    await logAudit(userProfile.data?.id, 'visitor_checkout', 'visitor', visitorId, null, data);

    return c.json({ 
      success: true, 
      visitor: data,
      message: 'Visitor checked out successfully' 
    });
  } catch (error) {
    console.error('Check-out error:', error);
    return c.json({ error: 'Failed to check out visitor' }, 500);
  }
});

// =====================================================
// APPOINTMENTS ENDPOINTS
// =====================================================

// Create appointment
app.post("/make-server-c8ca2e45/appointments", async (c) => {
  try {
    const authResult = await getAuthUser(c.req.header('Authorization'));
    if (authResult.error) {
      return c.json({ error: authResult.error }, authResult.status);
    }

    const userProfile = await getUserProfile(authResult.user.id);
    const appointmentData = await c.req.json();

    const { data, error } = await supabaseAdmin
      .from('appointments')
      .insert({
        visitor_name: appointmentData.visitor_name,
        visitor_email: appointmentData.visitor_email,
        visitor_phone: appointmentData.visitor_phone || null,
        visitor_company: appointmentData.visitor_company || null,
        host_name: appointmentData.host_name,
        host_email: appointmentData.host_email,
        host_department: appointmentData.host_department || null,
        scheduled_time: appointmentData.scheduled_time,
        duration_minutes: appointmentData.duration_minutes || 60,
        purpose: appointmentData.purpose,
        status: 'pending',
        created_by: userProfile.data?.id,
        notes: appointmentData.notes || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Appointment creation error:', error);
      return c.json({ error: 'Failed to create appointment' }, 500);
    }

    // Log audit
    await logAudit(userProfile.data?.id, 'appointment_created', 'appointment', data.id, null, data);

    return c.json({ 
      success: true, 
      appointment: data,
      message: 'Appointment created successfully' 
    });
  } catch (error) {
    console.error('Appointment creation error:', error);
    return c.json({ error: 'Failed to create appointment' }, 500);
  }
});

// Get all appointments
app.get("/make-server-c8ca2e45/appointments", async (c) => {
  try {
    const authResult = await getAuthUser(c.req.header('Authorization'));
    if (authResult.error) {
      return c.json({ error: authResult.error }, authResult.status);
    }

    const { data, error } = await supabaseAdmin
      .from('appointments')
      .select('*')
      .order('scheduled_time', { ascending: true });

    if (error) {
      console.error('Error fetching appointments:', error);
      return c.json({ error: 'Failed to fetch appointments' }, 500);
    }

    return c.json({ appointments: data || [] });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return c.json({ error: 'Failed to fetch appointments' }, 500);
  }
});

// Cancel appointment
app.post("/make-server-c8ca2e45/appointments/:id/cancel", async (c) => {
  try {
    const authResult = await getAuthUser(c.req.header('Authorization'));
    if (authResult.error) {
      return c.json({ error: authResult.error }, authResult.status);
    }

    const userProfile = await getUserProfile(authResult.user.id);
    const appointmentId = c.req.param('id');

    const { data, error } = await supabaseAdmin
      .from('appointments')
      .update({ status: 'cancelled' })
      .eq('id', appointmentId)
      .select()
      .single();

    if (error) {
      console.error('Appointment cancellation error:', error);
      return c.json({ error: 'Failed to cancel appointment' }, 500);
    }

    // Log audit
    await logAudit(userProfile.data?.id, 'appointment_cancelled', 'appointment', appointmentId, null, data);

    return c.json({ 
      success: true, 
      appointment: data,
      message: 'Appointment cancelled successfully' 
    });
  } catch (error) {
    console.error('Appointment cancellation error:', error);
    return c.json({ error: 'Failed to cancel appointment' }, 500);
  }
});

// =====================================================
// DASHBOARD STATISTICS
// =====================================================

app.get("/make-server-c8ca2e45/stats", async (c) => {
  try {
    const authResult = await getAuthUser(c.req.header('Authorization'));
    if (authResult.error) {
      return c.json({ error: authResult.error }, authResult.status);
    }

    // Get currently checked in visitors
    const { count: checkedInCount } = await supabaseAdmin
      .from('visitors')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'checked_in');

    // Get today's visitors
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { count: todayCount } = await supabaseAdmin
      .from('visitors')
      .select('*', { count: 'exact', head: true })
      .gte('check_in_time', today.toISOString());

    // Get total visitors
    const { count: totalCount } = await supabaseAdmin
      .from('visitors')
      .select('*', { count: 'exact', head: true });

    // Get upcoming appointments
    const { count: upcomingCount } = await supabaseAdmin
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .gte('scheduled_time', new Date().toISOString())
      .in('status', ['pending', 'confirmed']);

    const stats = {
      currently_checked_in: checkedInCount || 0,
      total_today: todayCount || 0,
      total_all_time: totalCount || 0,
      upcoming_appointments: upcomingCount || 0,
    };

    return c.json({ stats });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return c.json({ error: 'Failed to fetch statistics' }, 500);
  }
});

// =====================================================
// COMPANY SETTINGS
// =====================================================

app.get("/make-server-c8ca2e45/company/settings", async (c) => {
  try {
    const authResult = await getAuthUser(c.req.header('Authorization'));
    if (authResult.error) {
      return c.json({ error: authResult.error }, authResult.status);
    }

    const { data, error } = await supabaseAdmin
      .from('company_settings')
      .select('*')
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching company settings:', error);
      return c.json({ error: 'Failed to fetch company settings' }, 500);
    }

    return c.json({ company: data || {} });
  } catch (error) {
    console.error('Error fetching company settings:', error);
    return c.json({ error: 'Failed to fetch company settings' }, 500);
  }
});

app.get("/make-server-c8ca2e45/company/info", async (c) => {
  try {
    const authResult = await getAuthUser(c.req.header('Authorization'));
    if (authResult.error) {
      return c.json({ error: authResult.error }, authResult.status);
    }

    const { data, error } = await supabaseAdmin
      .from('company_settings')
      .select('*')
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching company info:', error);
      return c.json({ error: 'Failed to fetch company info' }, 500);
    }

    return c.json({ company: data || {} });
  } catch (error) {
    console.error('Error fetching company info:', error);
    return c.json({ error: 'Failed to fetch company info' }, 500);
  }
});

app.post("/make-server-c8ca2e45/company/settings", async (c) => {
  try {
    const authResult = await getAuthUser(c.req.header('Authorization'));
    if (authResult.error) {
      return c.json({ error: authResult.error }, authResult.status);
    }

    const userProfile = await getUserProfile(authResult.user.id);
    if (!userProfile.data || userProfile.data.role !== 'admin') {
      return c.json({ error: 'Forbidden: Admin access required' }, 403);
    }

    const companyData = await c.req.json();

    // Check if settings exist
    const { data: existing } = await supabaseAdmin
      .from('company_settings')
      .select('id')
      .limit(1)
      .single();

    let data, error;

    if (existing) {
      // Update existing
      const result = await supabaseAdmin
        .from('company_settings')
        .update(companyData)
        .eq('id', existing.id)
        .select()
        .single();
      data = result.data;
      error = result.error;
    } else {
      // Insert new
      const result = await supabaseAdmin
        .from('company_settings')
        .insert(companyData)
        .select()
        .single();
      data = result.data;
      error = result.error;
    }

    if (error) {
      console.error('Error saving company settings:', error);
      return c.json({ error: 'Failed to save company settings' }, 500);
    }

    return c.json({ success: true, company: data });
  } catch (error) {
    console.error('Error saving company settings:', error);
    return c.json({ error: 'Failed to save company settings' }, 500);
  }
});

// =====================================================
// REPORTS
// =====================================================

app.get("/make-server-c8ca2e45/reports/visitors", async (c) => {
  try {
    const authResult = await getAuthUser(c.req.header('Authorization'));
    if (authResult.error) {
      return c.json({ error: authResult.error }, authResult.status);
    }

    const startDate = c.req.query('start');
    const endDate = c.req.query('end');

    if (!startDate || !endDate) {
      return c.json({ error: 'Start and end dates are required' }, 400);
    }

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const { data: visitors, error } = await supabaseAdmin
      .from('visitors')
      .select('*')
      .gte('check_in_time', start.toISOString())
      .lte('check_in_time', end.toISOString())
      .order('check_in_time', { ascending: false });

    if (error) {
      console.error('Error fetching report:', error);
      return c.json({ error: 'Failed to generate report' }, 500);
    }

    // Calculate statistics
    const totalVisitors = visitors?.length || 0;
    const completedVisits = visitors?.filter(v => v.check_out_time) || [];
    
    let avgDuration = 'N/A';
    if (completedVisits.length > 0) {
      const totalDuration = completedVisits.reduce((sum, v) => {
        const duration = new Date(v.check_out_time).getTime() - new Date(v.check_in_time).getTime();
        return sum + duration;
      }, 0);
      const avgMs = totalDuration / completedVisits.length;
      const hours = Math.floor(avgMs / (1000 * 60 * 60));
      const minutes = Math.floor((avgMs % (1000 * 60 * 60)) / (1000 * 60));
      avgDuration = `${hours}h ${minutes}m`;
    }

    // Find busiest hour
    const hourCounts: Record<number, number> = {};
    visitors?.forEach(v => {
      const hour = new Date(v.check_in_time).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    const busiestHour = Object.entries(hourCounts).reduce((max, [hour, count]) => 
      count > (hourCounts[Number(max)] || 0) ? Number(hour) : max, 0
    );

    // Find peak day
    const dayCounts: Record<string, number> = {};
    visitors?.forEach(v => {
      const day = new Date(v.check_in_time).toLocaleDateString();
      dayCounts[day] = (dayCounts[day] || 0) + 1;
    });
    const peakDay = Object.entries(dayCounts).reduce((max, [day, count]) =>
      count > (dayCounts[max] || 0) ? day : max, Object.keys(dayCounts)[0] || 'N/A'
    );

    // Find most common purpose
    const purposeCounts: Record<string, number> = {};
    visitors?.forEach(v => {
      const purpose = v.purpose || 'Not specified';
      purposeCounts[purpose] = (purposeCounts[purpose] || 0) + 1;
    });
    const mostCommonPurpose = Object.entries(purposeCounts).reduce((max, [purpose, count]) =>
      count > (purposeCounts[max] || 0) ? purpose : max, 'N/A'
    );

    // Add duration to each visitor
    const visitorsWithDuration = visitors?.map(v => {
      let duration = 'N/A';
      if (v.check_out_time) {
        const durationMs = new Date(v.check_out_time).getTime() - new Date(v.check_in_time).getTime();
        const hours = Math.floor(durationMs / (1000 * 60 * 60));
        const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
        duration = `${hours}h ${minutes}m`;
      }
      return { ...v, duration };
    }) || [];

    const stats = {
      total_visitors: totalVisitors,
      avg_visit_duration: avgDuration,
      busiest_hour: `${busiestHour}:00 - ${busiestHour + 1}:00`,
      most_common_purpose: mostCommonPurpose,
      peak_day: peakDay,
    };

    return c.json({ visitors: visitorsWithDuration, stats });
  } catch (error) {
    console.error('Error generating report:', error);
    return c.json({ error: 'Failed to generate report' }, 500);
  }
});

// =====================================================
// START SERVER
// =====================================================

Deno.serve(app.fetch);