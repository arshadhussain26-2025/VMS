# Visitor Management System - User Guide

**Version:** 1.0  
**Last Updated:** December 30, 2024  
**System Name:** Visitor Management Reception System

---

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [User Roles and Permissions](#user-roles-and-permissions)
4. [Login](#login)
5. [Dashboard Overview](#dashboard-overview)
6. [Visitor Management](#visitor-management)
7. [Check-In Process](#check-in-process)
8. [Appointments](#appointments)
9. [Reports](#reports)
10. [User Management](#user-management)
11. [Company Settings](#company-settings)
12. [Troubleshooting](#troubleshooting)
13. [FAQ](#faq)

---

## 1. Introduction

### What is the Visitor Management System?

The Visitor Management System is a comprehensive enterprise solution designed to streamline visitor tracking, appointment scheduling, and reception desk operations. Built with modern web technologies (React, Tailwind CSS, Supabase), it provides a secure, user-friendly platform for managing all aspects of visitor operations.

### Key Features

- ✅ **Real-time Visitor Tracking** - Monitor who is currently on premises
- ✅ **Digital Check-In/Check-Out** - Quick and efficient visitor processing
- ✅ **Appointment Scheduling** - Manage scheduled visits and meetings
- ✅ **Role-Based Access Control** - Different permissions for Admin, Receptionist, Security, Host
- ✅ **Analytics Dashboard** - Visual insights into visitor patterns and statistics
- ✅ **Company Branding** - Customize with your company logo and information
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile devices
- ✅ **Secure Data Handling** - JWT authentication and encrypted data storage

### System Requirements

**Supported Browsers:**
- Google Chrome (recommended, version 90+)
- Mozilla Firefox (version 88+)
- Microsoft Edge (version 90+)
- Safari (version 14+)

**Screen Resolution:**
- Minimum: 1024×768 pixels
- Recommended: 1920×1080 pixels or higher

**Internet Connection:**
- Required: Stable broadband connection (minimum 5 Mbps)

---

## 2. Getting Started

### Accessing the System

1. Open your web browser
2. Navigate to the system URL provided by your administrator
3. You will see the login screen

**[SCREENSHOT PLACEHOLDER: Login Screen]**

### First-Time Setup

When accessing the system for the first time:

1. Contact your system administrator for login credentials
2. Your initial password should be changed immediately after first login
3. Verify your user role and permissions with the administrator

---

## 3. User Roles and Permissions

The system supports four user roles with different access levels:

### Admin (Full Access)

**Permissions:**
- ✅ Manage all visitors and appointments
- ✅ Create and manage user accounts
- ✅ Access all reports and analytics
- ✅ Configure company settings
- ✅ View debug information
- ✅ Full system access

**Typical Users:** IT Administrators, Office Managers

### Receptionist (Standard Access)

**Permissions:**
- ✅ Check-in and check-out visitors
- ✅ Create and manage appointments
- ✅ View visitor lists and history
- ✅ Access basic reports
- ❌ Cannot manage users
- ❌ Cannot change company settings

**Typical Users:** Front Desk Staff, Receptionists

### Security (Limited Access)

**Permissions:**
- ✅ View active visitors
- ✅ Check-in and check-out visitors
- ✅ View appointment schedules
- ❌ Cannot create appointments
- ❌ Cannot manage users
- ❌ Limited reporting access

**Typical Users:** Security Guards, Building Security

### Host (View Only)

**Permissions:**
- ✅ View their own appointments
- ✅ View visitors scheduled to meet them
- ❌ Cannot check-in visitors
- ❌ Cannot access reports
- ❌ Cannot manage users

**Typical Users:** Employees who receive visitors, Meeting Hosts

---

## 4. Login

### Login Process

1. **Enter Email Address**
   - Use your work email address provided by the administrator
   - Format: user@company.com

2. **Enter Password**
   - Use the password provided or your custom password
   - Passwords are case-sensitive

3. **Click "Login" Button**
   - The system will authenticate your credentials
   - You'll be redirected to the dashboard upon successful login

**[SCREENSHOT PLACEHOLDER: Login Form]**

### Login Issues

**Forgot Password:**
- Contact your system administrator
- They can reset your password from the User Management section

**Account Locked:**
- After multiple failed login attempts, your account may be temporarily locked
- Wait 15 minutes and try again, or contact the administrator

**Browser Issues:**
- Clear browser cache and cookies
- Try a different browser
- Disable browser extensions that might interfere

---

## 5. Dashboard Overview

The dashboard is your central hub for monitoring visitor activity and accessing system features.

**[SCREENSHOT PLACEHOLDER: Dashboard Main View]**

### Header Section

The header displays three key areas:

**Left Section:**
- Company Logo (uploaded in Settings)
- Company Name

**Center Section:**
- Software Logo
- "Visitor Management" branding
- "Reception System" subtitle

**Right Section:**
- Help icon (access help resources)
- Notifications icon (system alerts)
- User avatar with your name
- User role display
- Logout button

### Navigation Tabs

Located below the header, these tabs provide access to main modules:

1. **Dashboard** - Main overview and statistics
2. **Visitors** - Visitor list and management
3. **Check-In** - Quick visitor check-in interface
4. **Appointments** - Schedule and manage appointments
5. **Reports** - Analytics and reports
6. **Users** - User account management (Admin only)
7. **Settings** - Company settings (Admin only)
8. **Debug** - System information (Admin only)

### Dashboard Cards

The dashboard displays 5 main cards in a single row (on wide screens):

#### Card 1: Active Visitors
- **Large Number:** Currently checked-in visitors
- **Details:**
  - Number checked in
  - Today's total
  - Visitors awaiting check-in
- **Action:** "View Visitors" button

**[SCREENSHOT PLACEHOLDER: Active Visitors Card]**

#### Card 2: Appointments
- **Large Number:** Upcoming appointments
- **Details:**
  - Upcoming count
  - In-progress count
  - Completed count
- **Action:** "View Appointments" button

#### Card 3: Check-Ins Today
- **Large Number:** Total check-ins today
- **Details:**
  - New check-ins
  - Scheduled arrivals
  - Walk-in visitors
- **Action:** "View Check-Ins" button

#### Card 4: Recent Check-Ins
- **List Display:** Last 3 visitor check-ins
- **Shows:**
  - Visitor name (with avatar)
  - Company name
  - Check-in status (colored dot)

**[SCREENSHOT PLACEHOLDER: Recent Check-Ins Card]**

#### Card 5: Overall Statistics
- **Total Visitors:** All-time visitor count
- **Average Daily:** Daily visitor average
- **Check-In Rate:** Percentage of scheduled visitors who checked in

---

## 6. Visitor Management

Access the Visitors module by clicking the "Visitors" tab in the navigation.

**[SCREENSHOT PLACEHOLDER: Visitors List View]**

### Viewing Visitors

**Main List:**
- Displays all visitors in a table format
- Shows: Name, Company, Phone, Email, Purpose, Check-in Time, Status

**Status Indicators:**
- 🟢 **Green Dot:** Currently checked in
- ⚫ **Gray Dot:** Checked out

**Search and Filter:**
- Use the search bar to find specific visitors
- Filter by:
  - Date range
  - Status (Checked In / Checked Out)
  - Company name
  - Purpose of visit

### Adding a New Visitor

1. Click the **"Add Visitor"** button (top right)
2. Fill in the visitor form:

**Required Fields:**
   - Full Name
   - Company Name
   - Phone Number
   - Email Address
   - Purpose of Visit
   - Host Name

**Optional Fields:**
   - Badge Number
   - Vehicle Registration
   - Special Notes

3. Click **"Save"** to add the visitor
4. The visitor will appear in the list with "Awaiting Check-In" status

**[SCREENSHOT PLACEHOLDER: Add Visitor Form]**

### Editing Visitor Information

1. Locate the visitor in the list
2. Click the **Edit** icon (pencil) next to their name
3. Update the necessary information
4. Click **"Save Changes"**

### Viewing Visitor Details

1. Click on a visitor's name in the list
2. View complete visitor information:
   - Personal details
   - Check-in/check-out times
   - Purpose and notes
   - Associated appointment (if any)
   - Visit history

**[SCREENSHOT PLACEHOLDER: Visitor Details View]**

### Exporting Visitor Data

1. Select date range for export
2. Click **"Export"** button
3. Choose format (CSV or Excel)
4. File will download to your computer

---

## 7. Check-In Process

The Check-In module provides a streamlined interface for processing visitor arrivals and departures.

**[SCREENSHOT PLACEHOLDER: Check-In Interface]**

### Walk-In Visitor Check-In

For visitors without prior appointments:

1. Click **"Check-In"** tab
2. Click **"Walk-In Visitor"** button
3. Fill in visitor information:
   - Full Name
   - Company
   - Phone Number
   - Email
   - Purpose of Visit
   - Host/Person to Meet
4. Click **"Check In"** button
5. Print or email visitor badge (optional)

**[SCREENSHOT PLACEHOLDER: Walk-In Check-In Form]**

### Scheduled Visitor Check-In

For visitors with appointments:

1. Click **"Check-In"** tab
2. View today's scheduled arrivals
3. Locate the visitor in the list
4. Click **"Check In"** button next to their name
5. Verify visitor information
6. Confirm check-in

The visitor status will change to "Checked In" with a green indicator.

### Visitor Check-Out

When a visitor is leaving:

1. Go to **"Visitors"** tab or **"Check-In"** tab
2. Locate the checked-in visitor
3. Click **"Check Out"** button
4. Confirm check-out
5. Check-out time is automatically recorded

**[SCREENSHOT PLACEHOLDER: Check-Out Confirmation]**

### Visitor Badge Printing

If your system supports badge printing:

1. After checking in a visitor, click **"Print Badge"**
2. Badge includes:
   - Visitor name
   - Company name
   - Check-in date and time
   - Badge number
   - QR code (if enabled)
3. Hand the badge to the visitor

**Note:** Badge printing requires a configured printer. Contact your administrator if this feature is not working.

---

## 8. Appointments

The Appointments module allows you to schedule and manage visitor appointments.

**[SCREENSHOT PLACEHOLDER: Appointments Calendar View]**

### Viewing Appointments

**Calendar View:**
- Monthly calendar showing all appointments
- Click on a date to view appointments for that day
- Color-coded by status:
  - 🔵 Blue: Pending approval
  - 🟢 Green: Approved
  - 🔴 Red: Rejected
  - ⚫ Gray: Completed

**List View:**
- Table format showing all appointments
- Columns: Visitor Name, Date/Time, Purpose, Status, Actions

### Creating a New Appointment

1. Click **"Appointments"** tab
2. Click **"New Appointment"** button
3. Fill in appointment details:

**Visitor Information:**
   - Full Name
   - Company
   - Email Address
   - Phone Number

**Appointment Details:**
   - Date and Time
   - Duration (in minutes)
   - Purpose of Visit
   - Host Name
   - Location/Meeting Room

**Additional Information:**
   - Special requirements
   - Parking needed (yes/no)
   - Equipment needed
   - Notes

4. Click **"Create Appointment"**
5. The appointment will be created with "Pending" status

**[SCREENSHOT PLACEHOLDER: New Appointment Form]**

### Approving/Rejecting Appointments

**For Admin and Receptionist roles:**

1. Go to **"Appointments"** tab
2. Locate the pending appointment
3. Click **"View Details"**
4. Review appointment information
5. Click **"Approve"** or **"Reject"**
6. Add rejection reason if rejecting
7. Email notification sent to visitor automatically

**[SCREENSHOT PLACEHOLDER: Appointment Approval Dialog]**

### Editing Appointments

1. Locate the appointment in the list
2. Click the **Edit** icon
3. Modify appointment details
4. Click **"Save Changes"**
5. Updated information is sent to the visitor via email

### Canceling Appointments

1. Find the appointment to cancel
2. Click **"Cancel Appointment"**
3. Provide cancellation reason
4. Confirm cancellation
5. Cancellation notification sent to visitor

### Appointment Check-In

When an appointed visitor arrives:

1. Go to **"Check-In"** tab
2. Scheduled visitors appear at the top
3. Click **"Check In"** next to the visitor's name
4. Appointment status changes to "In Progress"
5. When visitor leaves, click **"Check Out"**
6. Appointment marked as "Completed"

---

## 9. Reports

The Reports module provides analytics and insights into visitor patterns.

**[SCREENSHOT PLACEHOLDER: Reports Dashboard]**

### Available Reports

#### Daily Visitor Report
- Total visitors for the day
- Peak hours
- Check-in vs check-out count
- Average visit duration

**How to Generate:**
1. Click **"Reports"** tab
2. Select **"Daily Report"**
3. Choose date
4. Click **"Generate"**
5. View or download report

#### Weekly Summary Report
- Visitor trends over the week
- Busiest days
- Department-wise visitor distribution
- Appointment vs walk-in ratio

**[SCREENSHOT PLACEHOLDER: Weekly Report Chart]**

#### Monthly Analytics
- Monthly visitor statistics
- Month-over-month comparison
- Visitor type breakdown
- Host performance metrics

#### Custom Reports

Create custom reports with specific parameters:

1. Click **"Custom Report"**
2. Select criteria:
   - Date range
   - Visitor status
   - Purpose of visit
   - Host name
   - Company name
3. Choose report format (Table/Chart)
4. Click **"Generate Report"**
5. Export as PDF, Excel, or CSV

**[SCREENSHOT PLACEHOLDER: Custom Report Builder]**

### Exporting Reports

All reports can be exported:

1. Generate the desired report
2. Click **"Export"** button
3. Select format:
   - PDF (for printing/viewing)
   - Excel (for data analysis)
   - CSV (for data processing)
4. File downloads automatically

### Scheduled Reports

**Admin only:**

Set up automatic report generation:

1. Go to **Settings** → **Reports**
2. Click **"Schedule Report"**
3. Configure:
   - Report type
   - Frequency (Daily/Weekly/Monthly)
   - Recipients (email addresses)
   - Delivery time
4. Click **"Save Schedule"**
5. Reports will be emailed automatically

---

## 10. User Management

**Available to Admin role only.**

Manage user accounts and permissions from the Users module.

**[SCREENSHOT PLACEHOLDER: User Management Screen]**

### Viewing Users

The Users tab displays all system users in a table:

- **Columns:** Name, Email, Role, Status, Created Date, Actions
- **Search:** Find users by name or email
- **Filter:** By role or status

### Creating a New User

1. Click **"Users"** tab
2. Click **"Create User"** button
3. Fill in user information:

**Required Fields:**
   - Full Name
   - Email Address
   - Phone Number
   - Role (Admin/Receptionist/Security/Host)
   - Password

**Optional Fields:**
   - Department
   - Employee ID
   - Notes

4. Click **"Create User"**
5. User receives welcome email with login credentials

**[SCREENSHOT PLACEHOLDER: Create User Form]**

**Important Notes:**
- Email addresses must be unique
- Default password should be changed on first login
- Users are active by default

### Editing User Information

1. Locate the user in the list
2. Click the **Edit** icon
3. Update user details
4. Click **"Save Changes"**

**Note:** You cannot edit your own role to prevent accidental permission loss.

### Changing User Role

1. Edit the user
2. Select new role from dropdown
3. Save changes
4. User permissions update immediately

**Role Changes:**
- Admin → Receptionist: Loses user management and settings access
- Receptionist → Security: Loses appointment creation rights
- Security → Host: Becomes view-only for personal appointments
- Any → Admin: Gains full system access

### Deactivating/Reactivating Users

**To Deactivate:**
1. Find the user
2. Click **"Deactivate"** button
3. Confirm deactivation
4. User can no longer log in

**To Reactivate:**
1. Filter for "Inactive" users
2. Click **"Reactivate"** button
3. User can log in again

**Note:** Deactivation preserves user data. Deletion is not recommended.

### Resetting User Password

1. Locate the user
2. Click **"Reset Password"**
3. System generates a temporary password
4. Temporary password shown on screen (copy it!)
5. Provide password to user
6. User must change password on next login

**[SCREENSHOT PLACEHOLDER: Password Reset Confirmation]**

---

## 11. Company Settings

**Available to Admin role only.**

Configure company information and system preferences.

**[SCREENSHOT PLACEHOLDER: Company Settings Screen]**

### Accessing Settings

1. Click **"Settings"** tab
2. Settings panel opens with multiple sections

### Company Information

Update your organization's details:

**Company Profile:**
- Company Name
- Address (Street, City, State, ZIP)
- Phone Number
- Email Address
- Website URL

**Branding:**
- Company Logo (upload image)
  - Recommended size: 200×200 pixels
  - Supported formats: PNG, JPG, SVG
  - Maximum file size: 2MB

**Operating Hours:**
- Opening Time
- Closing Time
- Working Days (checkboxes)
- Time Zone

**[SCREENSHOT PLACEHOLDER: Company Info Form]**

### Uploading Company Logo

1. Go to **Settings** → **Company Information**
2. Click **"Choose File"** under Logo Upload
3. Select your logo file from computer
4. Image preview appears
5. Click **"Save Settings"** at bottom
6. Logo appears in header immediately

**Tips for Best Results:**
- Use a square logo (1:1 aspect ratio)
- PNG with transparent background works best
- Simple, clean designs display better
- Test on different screen sizes

### Notification Settings

Configure email notifications:

**Appointment Notifications:**
- ✅ Send confirmation on appointment creation
- ✅ Send reminder 1 day before appointment
- ✅ Send notification on approval/rejection

**Check-In Notifications:**
- ✅ Notify host when visitor checks in
- ✅ Send daily summary to admin
- ✅ Alert on VIP visitor arrival

**System Notifications:**
- ✅ Weekly usage report
- ✅ Monthly analytics summary
- ✅ System maintenance alerts

**[SCREENSHOT PLACEHOLDER: Notification Settings]**

### Security Settings

**Password Policy:**
- Minimum password length (default: 8 characters)
- Require uppercase letters
- Require numbers
- Require special characters
- Password expiration (days)

**Session Management:**
- Auto-logout after inactivity (minutes)
- Maximum concurrent sessions per user
- Remember login (yes/no)

**Data Retention:**
- Keep visitor records for (days)
- Archive old appointments after (months)
- Auto-delete checked-out visitors (never/after X days)

### Saving Settings

**Important:**
1. After making any changes, scroll to bottom
2. Click **"Save Settings"** button
3. Confirmation message appears
4. Settings are applied immediately

**If you don't click "Save Settings," your changes will be lost!**

---

## 12. Troubleshooting

### Common Issues and Solutions

#### Cannot Login

**Problem:** "Invalid credentials" error

**Solutions:**
1. Verify email address is correct
2. Check password (case-sensitive)
3. Ensure Caps Lock is off
4. Try resetting password (contact admin)
5. Clear browser cache and cookies

---

#### Dashboard Not Loading

**Problem:** Blank screen or loading indefinitely

**Solutions:**
1. Refresh the page (F5 or Ctrl+R)
2. Check internet connection
3. Clear browser cache
4. Try different browser
5. Check if using supported browser version
6. Disable browser extensions
7. Contact IT support if issue persists

---

#### Cannot Check In Visitors

**Problem:** Check-in button not working or grayed out

**Solutions:**
1. Verify you have correct permissions (Receptionist or Admin role)
2. Check if visitor is already checked in
3. Refresh the page
4. Verify visitor information is complete
5. Check internet connection

---

#### Company Logo Not Appearing

**Problem:** Logo doesn't show after upload

**Solutions:**
1. Verify you clicked "Save Settings" button
2. Check file format (must be PNG, JPG, or SVG)
3. Check file size (must be under 2MB)
4. Try uploading a smaller image
5. Refresh browser (Ctrl+Shift+R for hard refresh)
6. Clear browser cache

---

#### Reports Not Generating

**Problem:** Report shows no data or errors

**Solutions:**
1. Verify date range is correct
2. Check if there is data for selected period
3. Ensure you have permission to view reports
4. Try different report format
5. Refresh the page
6. Contact admin if issue continues

---

#### Forgot Password

**Problem:** Cannot remember login password

**Solutions:**
1. Contact your system administrator
2. Admin can reset your password from User Management
3. You'll receive a temporary password
4. Change password immediately after logging in

---

#### User Creation Fails

**Problem:** "Failed to create user" error

**Solutions:**
1. Verify all required fields are filled
2. Check email address is unique (not already used)
3. Ensure email format is valid (user@domain.com)
4. Verify you have Admin role
5. Check password meets minimum requirements
6. Try again with different email address

---

#### Appointments Not Saving

**Problem:** Appointment disappears after creation

**Solutions:**
1. Verify all required fields are filled
2. Check date/time is in the future
3. Ensure internet connection is stable
4. Verify you have permission to create appointments
5. Try creating appointment again
6. Check browser console for errors

---

### Browser-Specific Issues

#### Chrome Issues
- Clear cache: Settings → Privacy → Clear browsing data
- Disable extensions: Menu → Extensions → Disable all
- Try Incognito mode

#### Firefox Issues
- Clear cache: Options → Privacy → Clear Data
- Disable add-ons: Menu → Add-ons → Disable all
- Try Private Window

#### Edge Issues
- Clear cache: Settings → Privacy → Choose what to clear
- Disable extensions: Menu → Extensions → Manage extensions
- Try InPrivate mode

---

### Getting Help

If you cannot resolve an issue:

1. **Check this User Guide** first
2. **Contact System Administrator:**
   - Email: [Your IT Support Email]
   - Phone: [Your IT Support Phone]
   - Help Desk: [Your Help Desk Portal]

3. **Provide the following information:**
   - Your name and role
   - Description of the issue
   - Steps that led to the issue
   - Error messages (screenshot if possible)
   - Browser and version you're using
   - Date and time issue occurred

---

## 13. FAQ

### General Questions

**Q: What browsers are supported?**
A: Chrome (90+), Firefox (88+), Edge (90+), and Safari (14+). Chrome is recommended for best performance.

**Q: Can I access the system from my phone?**
A: Yes! The system is fully responsive and works on mobile devices, though desktop/tablet is recommended for best experience.

**Q: Is my data secure?**
A: Yes. The system uses JWT authentication, encrypted data transmission, and secure Supabase backend with role-based access control.

**Q: Can I customize the company logo?**
A: Yes (Admin only). Go to Settings → Company Information → Upload Logo → Save Settings.

---

### User Account Questions

**Q: How do I change my password?**
A: Currently, password changes must be done by the Administrator. Contact them to request a password reset.

**Q: What happens if I forget my password?**
A: Contact your system administrator. They can reset your password and provide you with a temporary one.

**Q: Can I have multiple roles?**
A: No. Each user account has one role (Admin, Receptionist, Security, or Host). Contact admin if you need a role change.

**Q: Why can't I access certain features?**
A: Features are restricted based on your role. Check the "User Roles and Permissions" section to see what your role allows.

---

### Visitor Management Questions

**Q: How do I handle a visitor without an appointment?**
A: Use the "Walk-In Visitor" check-in process. Go to Check-In tab → Walk-In Visitor → Fill in details → Check In.

**Q: Can I edit visitor information after check-in?**
A: Yes (Receptionist/Admin). Go to Visitors tab → Find visitor → Click Edit icon → Make changes → Save.

**Q: What if a visitor doesn't check out?**
A: Manually check them out at end of day. Go to Visitors → Find visitor → Click Check Out. You can backdate the check-out time if needed.

**Q: How long is visitor data stored?**
A: Based on your company's data retention settings (configured in Settings by Admin). Default is typically 90 days for checked-out visitors.

---

### Appointment Questions

**Q: Can visitors create their own appointments?**
A: No. Appointments must be created by Receptionist or Admin users through the system.

**Q: What happens when I approve an appointment?**
A: The visitor receives an email confirmation with appointment details. The appointment appears in the schedule and check-in list for that day.

**Q: Can I schedule recurring appointments?**
A: Currently, no. Each appointment must be created individually. This feature may be added in future updates.

**Q: How do I cancel an appointment?**
A: Find the appointment → Click Cancel → Provide reason → Confirm. The visitor receives a cancellation email automatically.

---

### Reports Questions

**Q: Who can access reports?**
A: Admin and Receptionist roles have full report access. Security has limited access. Host users cannot access reports.

**Q: Can I schedule automatic reports?**
A: Yes (Admin only). Go to Settings → Reports → Schedule Report → Configure frequency and recipients.

**Q: What format are exported reports?**
A: Reports can be exported as PDF (for viewing/printing), Excel (for analysis), or CSV (for data processing).

**Q: Why is my report showing no data?**
A: Check the date range you selected. If there were no visitors during that period, the report will be empty.

---

### Technical Questions

**Q: What if the system is slow?**
A: Check your internet connection first. Clear browser cache. If issue persists across multiple devices, contact IT support.

**Q: Can I use the system offline?**
A: No. The system requires an internet connection to function as it stores data in the cloud.

**Q: Is there a mobile app?**
A: No dedicated mobile app, but the web application is fully responsive and works well on mobile browsers.

**Q: Can we integrate with our existing security system?**
A: This requires custom development. Contact your system administrator or the software provider for integration options.

**Q: How often is the system updated?**
A: System updates are managed by your IT team. Check the Debug tab for current version information.

---

### Settings Questions

**Q: Why can't I see the Settings tab?**
A: Settings are available to Admin role only. If you need to change settings, contact your administrator.

**Q: I uploaded a logo but it didn't appear. What's wrong?**
A: Make sure you clicked "Save Settings" button after uploading. Also verify the file is under 2MB and in PNG/JPG/SVG format.

**Q: Can I change the company name?**
A: Yes (Admin only). Go to Settings → Company Information → Update Company Name → Save Settings.

**Q: Where do I configure email notifications?**
A: Settings → Notification Settings → Enable/disable desired notifications → Save Settings.

---

## Appendix A: Keyboard Shortcuts

Currently, the system does not have keyboard shortcuts implemented. This feature may be added in future versions.

---

## Appendix B: Contact Information

**System Administrator:**
- Name: [Your Admin Name]
- Email: [admin@yourcompany.com]
- Phone: [Your Phone Number]

**IT Support:**
- Help Desk: [Your Help Desk Portal URL]
- Email: [support@yourcompany.com]
- Phone: [Support Phone Number]
- Hours: [Support Hours]

**Emergency Contact:**
- For urgent issues outside business hours
- Phone: [Emergency Phone]
- Email: [Emergency Email]

---

## Appendix C: Version History

**Version 1.0 - December 30, 2024**
- Initial release
- Core visitor management features
- Appointment scheduling
- User management with role-based access
- Company settings and branding
- Analytics and reporting
- Demo mode for testing

---

## Appendix D: Glossary

**Admin:** User role with full system access including user management and settings configuration.

**Appointment:** A scheduled visitor meeting with a specific date, time, and host.

**Check-In:** The process of registering a visitor's arrival at the facility.

**Check-Out:** The process of registering a visitor's departure from the facility.

**Dashboard:** The main overview screen showing statistics and quick access to key features.

**Demo Mode:** A testing mode that uses local data storage instead of the live database.

**Host:** The person a visitor is scheduled to meet; also a user role for employees who receive visitors.

**JWT:** JSON Web Token, used for secure user authentication.

**Receptionist:** User role for front desk staff with visitor and appointment management permissions.

**Role-Based Access Control (RBAC):** Security model where permissions are assigned based on user roles.

**Security:** User role with limited permissions, typically for security personnel.

**Status:** Current state of a visitor (Checked In, Checked Out) or appointment (Pending, Approved, Rejected, Completed).

**Supabase:** Backend platform providing database, authentication, and cloud storage services.

**Walk-In Visitor:** An unscheduled visitor without a prior appointment.

---

## Document Information

**Document Title:** Visitor Management System - User Guide  
**Version:** 1.0  
**Date:** December 30, 2024  
**Prepared By:** System Documentation Team  
**Approved By:** [Your Name/Department]

**Revision History:**
- Version 1.0 (Dec 30, 2024): Initial release

---

**End of User Guide**

For the latest version of this document, contact your system administrator.
