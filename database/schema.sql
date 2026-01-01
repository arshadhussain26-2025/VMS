-- =====================================================
-- VISITOR MANAGEMENT SYSTEM - DATABASE SCHEMA
-- PostgreSQL Database Setup
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'receptionist', 'security', 'host')),
    department VARCHAR(100),
    phone VARCHAR(50),
    auth_user_id UUID UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_auth_user_id ON users(auth_user_id);

-- =====================================================
-- COMPANY SETTINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS company_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(255),
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default company settings
INSERT INTO company_settings (name, address, phone, email)
VALUES ('Visitor Management System', '123 Business Street', '+1-555-0000', 'info@vms.com')
ON CONFLICT DO NOTHING;

-- =====================================================
-- VISITORS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS visitors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    company VARCHAR(255),
    purpose TEXT NOT NULL,
    id_proof_type VARCHAR(50) NOT NULL,
    id_proof_number VARCHAR(100) NOT NULL,
    badge_number VARCHAR(50) UNIQUE NOT NULL,
    photo_url TEXT,
    check_in_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    check_out_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) NOT NULL DEFAULT 'checked_in' CHECK (status IN ('checked_in', 'checked_out')),
    checked_in_by UUID REFERENCES users(id),
    checked_out_by UUID REFERENCES users(id),
    host_name VARCHAR(255),
    host_department VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_visitors_status ON visitors(status);
CREATE INDEX idx_visitors_check_in_time ON visitors(check_in_time DESC);
CREATE INDEX idx_visitors_badge_number ON visitors(badge_number);
CREATE INDEX idx_visitors_email ON visitors(email);
CREATE INDEX idx_visitors_full_name ON visitors(full_name);

-- =====================================================
-- APPOINTMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    visitor_name VARCHAR(255) NOT NULL,
    visitor_email VARCHAR(255) NOT NULL,
    visitor_phone VARCHAR(50),
    visitor_company VARCHAR(255),
    host_name VARCHAR(255) NOT NULL,
    host_email VARCHAR(255) NOT NULL,
    host_department VARCHAR(100),
    scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    purpose TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    visitor_id UUID REFERENCES visitors(id),
    created_by UUID REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_scheduled_time ON appointments(scheduled_time);
CREATE INDEX idx_appointments_visitor_email ON appointments(visitor_email);
CREATE INDEX idx_appointments_host_email ON appointments(host_email);

-- =====================================================
-- AUDIT LOG TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- =====================================================
-- NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    related_entity_type VARCHAR(50),
    related_entity_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_settings_updated_at BEFORE UPDATE ON company_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visitors_updated_at BEFORE UPDATE ON visitors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate badge number
CREATE OR REPLACE FUNCTION generate_badge_number()
RETURNS VARCHAR AS $$
DECLARE
    badge_num VARCHAR;
    exists_check INTEGER;
BEGIN
    LOOP
        badge_num := 'VMS-' || LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0');
        SELECT COUNT(*) INTO exists_check FROM visitors WHERE badge_number = badge_num;
        EXIT WHEN exists_check = 0;
    END LOOP;
    RETURN badge_num;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- VIEWS FOR REPORTING
-- =====================================================

-- Active visitors view
CREATE OR REPLACE VIEW active_visitors AS
SELECT 
    v.*,
    u.name as checked_in_by_name,
    u.role as checked_in_by_role
FROM visitors v
LEFT JOIN users u ON v.checked_in_by = u.id
WHERE v.status = 'checked_in'
ORDER BY v.check_in_time DESC;

-- Today's visitors view
CREATE OR REPLACE VIEW todays_visitors AS
SELECT 
    v.*,
    u.name as checked_in_by_name
FROM visitors v
LEFT JOIN users u ON v.checked_in_by = u.id
WHERE DATE(v.check_in_time) = CURRENT_DATE
ORDER BY v.check_in_time DESC;

-- Upcoming appointments view
CREATE OR REPLACE VIEW upcoming_appointments AS
SELECT 
    a.*,
    u.name as created_by_name
FROM appointments a
LEFT JOIN users u ON a.created_by = u.id
WHERE a.scheduled_time > NOW()
  AND a.status IN ('pending', 'confirmed')
ORDER BY a.scheduled_time ASC;

-- Visitor statistics view
CREATE OR REPLACE VIEW visitor_statistics AS
SELECT
    DATE(check_in_time) as visit_date,
    COUNT(*) as total_visitors,
    COUNT(CASE WHEN status = 'checked_in' THEN 1 END) as currently_checked_in,
    COUNT(CASE WHEN status = 'checked_out' THEN 1 END) as checked_out,
    AVG(EXTRACT(EPOCH FROM (check_out_time - check_in_time))/3600) as avg_duration_hours
FROM visitors
GROUP BY DATE(check_in_time)
ORDER BY visit_date DESC;

-- =====================================================
-- ROW LEVEL SECURITY (Optional - for enhanced security)
-- =====================================================

-- Enable RLS on tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policies (Examples - adjust based on your needs)
-- Users can read their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT
    USING (auth_user_id = auth.uid());

-- Admins can view all users
CREATE POLICY "Admins can view all users" ON users
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE auth_user_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- All authenticated users can view visitors
CREATE POLICY "Authenticated users can view visitors" ON visitors
    FOR SELECT
    USING (auth.uid() IS NOT NULL);

-- All authenticated users can insert visitors
CREATE POLICY "Authenticated users can create visitors" ON visitors
    FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Insert sample user (admin)
-- Note: This requires a valid auth_user_id from Supabase Auth
-- INSERT INTO users (email, name, role, department, phone, auth_user_id)
-- VALUES ('admin@vms.com', 'System Admin', 'admin', 'IT', '+1-555-1234', 'YOUR_AUTH_USER_ID_HERE');

-- =====================================================
-- GRANTS AND PERMISSIONS
-- =====================================================

-- Grant permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Grant permissions to service role
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Additional composite indexes for complex queries
CREATE INDEX idx_visitors_status_checkin ON visitors(status, check_in_time DESC);
CREATE INDEX idx_appointments_status_time ON appointments(status, scheduled_time);

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE users IS 'System users with role-based access control';
COMMENT ON TABLE visitors IS 'Visitor check-in and check-out records';
COMMENT ON TABLE appointments IS 'Scheduled visitor appointments';
COMMENT ON TABLE audit_logs IS 'System audit trail for all actions';
COMMENT ON TABLE notifications IS 'User notifications and alerts';
COMMENT ON TABLE company_settings IS 'Company branding and configuration';

-- =====================================================
-- END OF SCHEMA
-- =====================================================
