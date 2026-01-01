import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { FileText, Download, Calendar, TrendingUp, Users, Clock, Filter, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';
import { demoAPI } from '../utils/demoMode';

interface ReportsProps {
  accessToken: string;
  projectId: string;
  isDemoMode?: boolean;
}

interface VisitorReport {
  id: string;
  full_name: string;
  company: string;
  purpose: string;
  check_in_time: string;
  check_out_time: string | null;
  status: string;
  duration?: string;
}

interface ReportStats {
  total_visitors: number;
  avg_visit_duration: string;
  busiest_hour: string;
  most_common_purpose: string;
  peak_day: string;
}

export function Reports({ accessToken, projectId, isDemoMode }: ReportsProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [visitors, setVisitors] = useState<VisitorReport[]>([]);
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly' | 'custom'>('daily');

  useEffect(() => {
    // Set default dates based on report type
    const today = new Date();
    const end = today.toISOString().split('T')[0];
    let start = '';

    switch (reportType) {
      case 'daily':
        start = end;
        break;
      case 'weekly':
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        start = weekAgo.toISOString().split('T')[0];
        break;
      case 'monthly':
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        start = monthAgo.toISOString().split('T')[0];
        break;
    }

    if (reportType !== 'custom') {
      setStartDate(start);
      setEndDate(end);
    }
  }, [reportType]);

  const fetchReport = async () => {
    if (!startDate || !endDate) {
      toast.error('Please select date range');
      return;
    }

    setLoading(true);
    try {
      if (isDemoMode) {
        // Use demo mode
        const allVisitors = await demoAPI.getVisitors();
        
        // Filter visitors by date range
        const filteredVisitors = allVisitors.filter(v => {
          const checkInDate = new Date(v.check_in_time).toISOString().split('T')[0];
          return checkInDate >= startDate && checkInDate <= endDate;
        });
        
        // Calculate statistics
        const totalVisitors = filteredVisitors.length;
        const checkedOutVisitors = filteredVisitors.filter(v => v.check_out_time);
        
        // Calculate average visit duration
        let avgDuration = '0 min';
        if (checkedOutVisitors.length > 0) {
          const totalMinutes = checkedOutVisitors.reduce((sum, v) => {
            if (v.check_out_time) {
              const diff = new Date(v.check_out_time).getTime() - new Date(v.check_in_time).getTime();
              return sum + (diff / 1000 / 60);
            }
            return sum;
          }, 0);
          const avg = Math.round(totalMinutes / checkedOutVisitors.length);
          avgDuration = `${avg} min`;
        }
        
        setVisitors(filteredVisitors);
        setStats({
          total_visitors: totalVisitors,
          avg_visit_duration: avgDuration,
          busiest_hour: '10:00 AM',
          most_common_purpose: 'Business Meeting',
          peak_day: 'Monday',
        });
        
        toast.success(`✅ Report generated! (Demo Mode) - ${totalVisitors} visitors found`, { duration: 3000 });
        setLoading(false);
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c8ca2e45/reports/visitors?start=${startDate}&end=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setVisitors(data.visitors || []);
        setStats(data.stats || null);
      } else {
        toast.error('Failed to fetch report');
      }
    } catch (error) {
      console.error('Error fetching report:', error);
      toast.error('Failed to fetch report');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (visitors.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = ['Name', 'Company', 'Purpose', 'Check-In Time', 'Check-Out Time', 'Status', 'Duration'];
    const csvContent = [
      headers.join(','),
      ...visitors.map(v => [
        v.full_name,
        v.company || 'N/A',
        v.purpose || 'N/A',
        new Date(v.check_in_time).toLocaleString(),
        v.check_out_time ? new Date(v.check_out_time).toLocaleString() : 'Still Checked In',
        v.status,
        v.duration || 'N/A'
      ].map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `visitor-report-${startDate}-to-${endDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Report exported successfully');
  };

  const exportToPDF = () => {
    toast.info('PDF export will be available in the full version');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold mb-1">Reports & Analytics</h2>
        <p className="text-sm text-muted-foreground">
          Generate comprehensive visitor reports and analytics
        </p>
      </div>

      {/* Report Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Report Configuration
          </CardTitle>
          <CardDescription>Select report type and date range</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {(['daily', 'weekly', 'monthly', 'custom'] as const).map((type) => (
              <Button
                key={type}
                variant={reportType === type ? 'default' : 'outline'}
                onClick={() => setReportType(type)}
                className="capitalize"
              >
                {type} Report
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={reportType !== 'custom'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={reportType !== 'custom'}
              />
            </div>

            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button onClick={fetchReport} disabled={loading} className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                {loading ? 'Generating...' : 'Generate Report'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-900">Total Visitors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-blue-900">{stats.total_visitors}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-900">Avg Visit Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-900">{stats.avg_visit_duration}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-purple-900">Busiest Hour</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                <span className="font-semibold text-purple-900">{stats.busiest_hour}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-orange-900">Peak Day</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-orange-600" />
                <span className="font-semibold text-orange-900">{stats.peak_day}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Export Options */}
      {visitors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Export Report</CardTitle>
            <CardDescription>Download report in your preferred format</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Button onClick={exportToCSV} variant="outline">
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Export as CSV
            </Button>
            <Button onClick={exportToPDF} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export as PDF
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Visitor Details Table */}
      {visitors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Visitor Details ({visitors.length} records)</CardTitle>
            <CardDescription>
              Report from {new Date(startDate).toLocaleDateString()} to {new Date(endDate).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Name</th>
                    <th className="text-left p-3 font-medium">Company</th>
                    <th className="text-left p-3 font-medium">Purpose</th>
                    <th className="text-left p-3 font-medium">Check-In</th>
                    <th className="text-left p-3 font-medium">Check-Out</th>
                    <th className="text-left p-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {visitors.map((visitor) => (
                    <tr key={visitor.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{visitor.full_name}</td>
                      <td className="p-3">{visitor.company || 'N/A'}</td>
                      <td className="p-3">{visitor.purpose || 'N/A'}</td>
                      <td className="p-3 text-sm">
                        {new Date(visitor.check_in_time).toLocaleString()}
                      </td>
                      <td className="p-3 text-sm">
                        {visitor.check_out_time
                          ? new Date(visitor.check_out_time).toLocaleString()
                          : '-'}
                      </td>
                      <td className="p-3">
                        <Badge
                          className={
                            visitor.status === 'checked_in'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }
                        >
                          {visitor.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && visitors.length === 0 && startDate && endDate && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-muted-foreground">
              No visitors found for the selected date range. Try adjusting your filters.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}