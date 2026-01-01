# 🏢 Visitor Management System

A comprehensive, enterprise-grade visitor management solution built with React, TypeScript, and Supabase. Features a modern Salesforce-inspired UI with complete visitor tracking, appointment scheduling, and reporting capabilities.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/React-18.3-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Screenshots](#-screenshots)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Database Schema](#-database-schema)
- [API Documentation](#-api-documentation)
- [User Roles & Permissions](#-user-roles--permissions)
- [Security](#-security)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Core Functionality

- **🎫 Visitor Check-In/Out**
  - Quick registration with ID verification
  - Automatic badge number generation
  - Photo capture (optional)
  - Host notification
  - Digital sign-in

- **📅 Appointment Management**
  - Schedule visitor appointments
  - Email notifications to hosts
  - Calendar integration
  - Appointment status tracking
  - Recurring appointments

- **👥 User Management**
  - Role-based access control (Admin, Receptionist, Security, Host)
  - Department-wise organization
  - User creation and management
  - Permission assignment
  - Active directory integration ready

- **🏢 Company Settings**
  - Company branding (logo, colors)
  - Custom fields configuration
  - Multi-location support
  - Customizable visitor badges
  - Email template customization

- **📊 Reports & Analytics**
  - Daily, weekly, monthly reports
  - Custom date range reports
  - Visitor statistics
  - Peak hours analysis
  - Purpose of visit trends
  - Export to CSV/PDF
  - Real-time dashboards

### Advanced Features

- **🔔 Notifications**
  - Email notifications
  - In-app alerts
  - Host notifications on visitor arrival
  - Appointment reminders

- **🔍 Audit Logging**
  - Complete activity trail
  - User action tracking
  - Data change history
  - Compliance reporting

- **📱 Responsive Design**
  - Desktop optimized
  - Tablet friendly
  - Mobile responsive
  - PWA support

- **🔒 Security**
  - JWT authentication
  - Row-level security
  - Role-based permissions
  - Encrypted data storage
  - GDPR compliant

---

## 🛠️ Tech Stack

### Frontend
- **React 18.3** - UI library
- **TypeScript 5.0** - Type safety
- **Tailwind CSS 4.0** - Styling
- **Vite** - Build tool
- **Lucide React** - Icons
- **Recharts** - Data visualization
- **Sonner** - Toast notifications

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL - Database
  - Edge Functions (Deno) - Serverless API
  - Authentication - User management
  - Storage - File storage
  - Real-time subscriptions

### Infrastructure
- **Vercel/Netlify** - Frontend hosting
- **Supabase Cloud** - Backend hosting
- **PostgreSQL 15** - Production database

---

## 🖼️ Screenshots

### Login Page
Clean, professional login interface with company branding.

### Dashboard
Real-time statistics with active visitors, appointments, and analytics.

### Visitor Check-In
Streamlined check-in process with all necessary fields.

### Visitor List
Comprehensive visitor log with filtering and search.

### Reports
Detailed analytics with export capabilities.

---

## 🚀 Quick Start

### Prerequisites

```bash
node --version  # v18.0.0 or higher
npm --version   # v9.0.0 or higher
```

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/visitor-management-system.git

# Navigate to project
cd visitor-management-system

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### First Time Setup

1. Create Supabase account at [supabase.com](https://supabase.com)
2. Create new project
3. Run database schema from `/database/schema.sql`
4. Configure API keys in `/utils/supabase/info.tsx`
5. Deploy Edge Function
6. Create first admin user

📖 **Detailed Instructions**: See [INSTALLATION_GUIDE.md](/INSTALLATION_GUIDE.md)

---

## 📦 Installation

### For Windows

```cmd
# Install Node.js from https://nodejs.org

# Install dependencies
npm install

# Run application
npm run dev
```

### For macOS

```bash
# Install Node.js via Homebrew
brew install node

# Install dependencies
npm install

# Run application
npm run dev
```

### For Linux

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install dependencies
npm install

# Run application
npm run dev
```

📖 **Full Guide**: [INSTALLATION_GUIDE.md](/INSTALLATION_GUIDE.md)

---

## 🗄️ Database Schema

### Tables

1. **users** - System users with roles
2. **visitors** - Visitor check-in/out records
3. **appointments** - Scheduled appointments
4. **company_settings** - Organization configuration
5. **audit_logs** - Activity tracking
6. **notifications** - User notifications

### Key Relationships

```
users (1) ----< (*) visitors (checked_in_by)
users (1) ----< (*) appointments (created_by)
visitors (1) ----< (0,1) appointments (visitor_id)
```

### Views

- `active_visitors` - Currently checked-in visitors
- `todays_visitors` - Today's visitor activity
- `upcoming_appointments` - Future scheduled appointments
- `visitor_statistics` - Aggregated metrics

📖 **Full Schema**: [/database/schema.sql](/database/schema.sql)

---

## 🔌 API Documentation

### Base URL

```
https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-c8ca2e45
```

### Authentication

All endpoints (except `/signup`) require authentication header:

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Endpoints

#### Authentication

```http
POST /signup
POST /login (handled by Supabase Auth)
GET  /user/profile
```

#### Visitors

```http
POST /visitors/checkin
GET  /visitors
POST /visitors/:id/checkout
```

#### Appointments

```http
POST /appointments
GET  /appointments
POST /appointments/:id/cancel
```

#### Reports

```http
GET /reports/visitors?start=YYYY-MM-DD&end=YYYY-MM-DD
```

#### Company

```http
GET  /company/settings
POST /company/settings
GET  /company/info
```

#### Statistics

```http
GET /stats
```

📖 **API Reference**: See backend code in `/supabase/functions/server/index.tsx`

---

## 👤 User Roles & Permissions

### Admin
**Full system access**
- ✅ All modules
- ✅ User management
- ✅ Company settings
- ✅ System configuration
- ✅ All reports
- ✅ Audit logs

### Receptionist
**Front desk operations**
- ✅ Visitor check-in
- ✅ Visitor check-out
- ✅ Visitor log (all)
- ✅ Appointments (create/view)
- ✅ Dashboard
- ❌ User management
- ❌ Company settings

### Security
**Security monitoring**
- ✅ Visitor check-in
- ✅ Visitor check-out
- ✅ Visitor log (all)
- ✅ Dashboard
- ❌ Appointments
- ❌ Reports
- ❌ Settings

### Host
**Appointment management**
- ✅ Dashboard
- ✅ Appointments (own only)
- ✅ Visitor log (own only)
- ❌ Check-in/out
- ❌ All visitors
- ❌ Settings

---

## 🔒 Security

### Authentication
- JWT-based authentication via Supabase Auth
- Secure password hashing (bcrypt)
- Session management
- Token refresh mechanism

### Authorization
- Role-based access control (RBAC)
- Row-level security (RLS) policies
- API endpoint protection
- Frontend route guards

### Data Protection
- Encrypted data at rest
- Encrypted data in transit (HTTPS)
- GDPR compliance ready
- Data retention policies
- Audit logging

### Best Practices
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF tokens
- Rate limiting
- Secure headers

---

## 🌐 Deployment

### Production Deployment

#### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### Option 2: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

#### Option 3: Docker

```bash
# Build image
docker build -t visitor-management .

# Run container
docker run -p 3000:3000 visitor-management
```

### Environment Variables

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Database Setup

1. Create Supabase project
2. Run `/database/schema.sql`
3. Deploy Edge Function
4. Configure environment variables

📖 **Deployment Guide**: [DEPLOYMENT_GUIDE.md](/DEPLOYMENT_GUIDE.md)

---

## 🐛 Troubleshooting

### Common Issues

**Issue: "Failed to fetch"**
```
Solution: Check API credentials in info.tsx
```

**Issue: "Unauthorized" errors**
```
Solution: Verify JWT token and user permissions
```

**Issue: Database connection fails**
```
Solution: Check Supabase project status and credentials
```

**Issue: "Failed to check in visitor"**
```
Solution: Ensure database schema is deployed and user profile exists
```

**Issue: Build errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

📖 **Detailed Troubleshooting**: See [TROUBLESHOOTING.md](/TROUBLESHOOTING.md) for comprehensive solutions

### Debug Mode

```bash
# Enable debug logging
npm run dev -- --debug

# Check browser console
# Check Supabase logs
# Check Edge Function logs
```

### Support

- 📧 Email: support@yourcompany.com
- 📚 Documentation: See guides in project root
- 🐛 Bug Reports: GitHub Issues
- 💬 Community: Discord/Slack

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation
- Follow code style (ESLint/Prettier)

---

## 📄 License

This project is licensed under the MIT License.

```
MIT License

Copyright (c) 2025 Visitor Management System

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🎯 Roadmap

### Version 1.1 (Q1 2025)
- [ ] QR code badge printing
- [ ] SMS notifications
- [ ] Visitor pre-registration portal
- [ ] Mobile app (iOS/Android)

### Version 1.2 (Q2 2025)
- [ ] Face recognition
- [ ] Access control integration
- [ ] Multi-language support
- [ ] Advanced analytics dashboard

### Version 2.0 (Q3 2025)
- [ ] AI-powered insights
- [ ] Predictive analytics
- [ ] Automated host matching
- [ ] Integration marketplace

---

## 📞 Contact

**Project Maintainer**: Your Name
- Email: your.email@company.com
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

**Company**: Your Organization
- Website: https://yourcompany.com
- Support: support@yourcompany.com

---

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) - Backend infrastructure
- [React](https://react.dev) - UI framework
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Lucide](https://lucide.dev) - Icons
- All contributors and supporters

---

## ⭐ Star History

If you find this project useful, please consider giving it a star!

---

**Built with ❤️ for efficient visitor management**

[⬆ Back to top](#-visitor-management-system)