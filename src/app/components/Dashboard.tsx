import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Users, UserCheck, Clock, Calendar, Activity, TrendingUp } from 'lucide-react';
import { demoAPI } from '../utils/demoMode';

interface DashboardProps {
  accessToken: string;
  projectId: string;
  publicAnonKey: string;
  companyInfo?: any;
  userName?: string;
  isDemoMode?: boolean;
  onNavigate?: (view: string) => void;
}

interface Stats {
  currently_checked_in: number;
  total_today: number;
  total_all_time: number;
  upcoming_appointments: number;
}

interface RecentVisitor {
  id: string;
  full_name: string;
  company: string;
  check_in_time: string;
  status: string;
}

export function Dashboard({ accessToken, projectId, companyInfo, userName, isDemoMode, onNavigate }: DashboardProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentVisitors, setRecentVisitors] = useState<RecentVisitor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRecentVisitors();
  }, [isDemoMode]);

  const handleNavigate = (buttonText: string) => {
    if (!onNavigate) return;
    
    // Map button text to view IDs
    const viewMap: Record<string, string> = {
      'View Visitors': 'visitors',
      'View Appointments': 'appointments',
      'View Check-Ins': 'visitors', // Check-ins also goes to visitors
    };
    
    const view = viewMap[buttonText];
    if (view) {
      onNavigate(view);
    }
  };

  const fetchStats = async () => {
    try {
      if (isDemoMode) {
        // Use demo mode
        const visitors = await demoAPI.getVisitors();
        const appointments = await demoAPI.getAppointments();
        
        const today = new Date().toISOString().split('T')[0];
        const todayVisitors = visitors.filter(v => 
          v.check_in_time.startsWith(today)
        );
        const checkedInVisitors = visitors.filter(v => v.status === 'checked_in');
        const upcomingAppts = appointments.filter(a => a.status === 'pending' || a.status === 'approved');
        
        setStats({
          currently_checked_in: checkedInVisitors.length,
          total_today: todayVisitors.length,
          total_all_time: visitors.length,
          upcoming_appointments: upcomingAppts.length,
        });
        
        setLoading(false);
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c8ca2e45/stats`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching dashboard statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentVisitors = async () => {
    try {
      if (isDemoMode) {
        // Use demo mode
        const visitors = await demoAPI.getVisitors();
        setRecentVisitors(visitors.slice(0, 5));
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c8ca2e45/visitors`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setRecentVisitors((data.visitors || []).slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching recent visitors:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-pulse text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  const dashboardCards = [
    {
      title: 'Active Visitors',
      subtitle: 'Currently on premises',
      value: stats?.currently_checked_in || 0,
      icon: UserCheck,
      items: [
        { label: `${stats?.currently_checked_in || 0} Checked In`, color: 'text-cyan-600', dotColor: 'bg-cyan-500' },
        { label: `${stats?.total_today || 0} Today Total`, color: 'text-blue-600', dotColor: 'bg-blue-500' },
        { label: '0 Awaiting', color: 'text-gray-400', dotColor: 'bg-gray-300' },
      ],
      buttonText: 'View Visitors',
    },
    {
      title: 'Appointments',
      subtitle: 'Scheduled meetings',
      value: stats?.upcoming_appointments || 0,
      icon: Calendar,
      items: [
        { label: `${stats?.upcoming_appointments || 0} Upcoming`, color: 'text-cyan-600', dotColor: 'bg-cyan-500' },
        { label: '0 In Progress', color: 'text-blue-600', dotColor: 'bg-blue-500' },
        { label: '0 Completed', color: 'text-gray-400', dotColor: 'bg-gray-300' },
      ],
      buttonText: 'View Appointments',
    },
    {
      title: 'Check-Ins Today',
      subtitle: 'Daily visitor activity',
      value: stats?.total_today || 0,
      icon: Activity,
      items: [
        { label: `${stats?.total_today || 0} New Check-Ins`, color: 'text-cyan-600', dotColor: 'bg-cyan-500' },
        { label: '0 Scheduled', color: 'text-blue-600', dotColor: 'bg-blue-500' },
        { label: '0 Walk-Ins', color: 'text-red-400', dotColor: 'bg-red-300' },
      ],
      buttonText: 'View Check-Ins',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Welcome Header */}
      <div>
        <h1 className="text-lg text-gray-600 mb-0.5">Reception Dashboard</h1>
        <p className="text-sm text-gray-500">
          Good morning{userName ? `, ${userName}` : ''}. Let's manage visitors!
        </p>
      </div>

      {/* Dashboard Cards Grid - 5 columns on large screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {dashboardCards.map((card, index) => (
          <Card key={index} className="bg-white shadow-sm border border-gray-200">
            <CardHeader className="pb-2 px-3 pt-3">
              <CardTitle className="text-xs font-normal text-gray-700">
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 px-3 pb-3">
              {/* Circular Metric */}
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-gray-100 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-xl font-semibold text-gray-800">{card.value}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Items */}
              <div className="space-y-1">
                {card.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${item.dotColor}`} />
                    <span className={`text-[10px] ${item.color}`}>{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <Button
                variant="outline"
                className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 text-[10px] h-7 px-2"
                onClick={() => handleNavigate(card.buttonText)}
              >
                {card.buttonText}
              </Button>
            </CardContent>
          </Card>
        ))}

        {/* Recent Check-Ins - Compact */}
        <Card className="bg-white shadow-sm border border-gray-200 xl:col-span-1">
          <CardHeader className="pb-2 px-3 pt-3">
            <CardTitle className="text-xs font-normal text-gray-700">
              Recent Check-Ins
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            {recentVisitors.length > 0 ? (
              <div className="space-y-2">
                {recentVisitors.slice(0, 3).map((visitor) => (
                  <div
                    key={visitor.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white text-[10px] font-medium">
                        {visitor.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-[10px] text-gray-800">{visitor.full_name}</p>
                        <p className="text-[9px] text-gray-500">{visitor.company || 'No company'}</p>
                      </div>
                    </div>
                    <div className={`w-1.5 h-1.5 rounded-full ${visitor.status === 'checked_in' ? 'bg-cyan-500' : 'bg-gray-300'}`} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Users className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                <p className="text-[10px] text-gray-500">No recent visitors</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Overall Statistics - Compact */}
        <Card className="bg-white shadow-sm border border-gray-200 xl:col-span-1">
          <CardHeader className="pb-2 px-3 pt-3">
            <CardTitle className="text-xs font-normal text-gray-700">
              Overall Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 px-3 pb-3">
            <div className="flex items-center justify-between p-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded">
              <div>
                <p className="text-[9px] text-gray-600">Total Visitors</p>
                <p className="text-sm font-semibold text-gray-800">{stats?.total_all_time || 0}</p>
              </div>
              <TrendingUp className="h-5 w-5 text-blue-500" />
            </div>

            <div className="flex items-center justify-between p-2 bg-gradient-to-r from-cyan-50 to-blue-50 rounded">
              <div>
                <p className="text-[9px] text-gray-600">Average Daily</p>
                <p className="text-sm font-semibold text-gray-800">
                  {stats ? Math.round((stats.total_all_time || 0) / 30) : 0}
                </p>
              </div>
              <Activity className="h-5 w-5 text-cyan-500" />
            </div>

            <div className="flex items-center justify-between p-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded">
              <div>
                <p className="text-[9px] text-gray-600">Check-In Rate</p>
                <p className="text-sm font-semibold text-gray-800">95%</p>
              </div>
              <UserCheck className="h-5 w-5 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}