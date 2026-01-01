import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { toast } from 'sonner';
import { LogOut, Search, RefreshCw, Filter } from 'lucide-react';
import { Input } from './ui/input';
import { demoAPI } from '../utils/demoMode';

interface Visitor {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  company: string;
  purpose: string;
  check_in_time: string;
  check_out_time: string | null;
  badge_number: string;
  status: string;
}

interface VisitorListProps {
  accessToken: string;
  projectId: string;
  refreshTrigger: number;
  isDemoMode?: boolean;
}

export function VisitorList({ accessToken, projectId, refreshTrigger, isDemoMode }: VisitorListProps) {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [filteredVisitors, setFilteredVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'checked_in' | 'checked_out'>('all');

  useEffect(() => {
    fetchVisitors();
  }, [refreshTrigger]);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, statusFilter, visitors]);

  const applyFilters = () => {
    let filtered = visitors;

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((v) => v.status === statusFilter);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (v) =>
          v.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.badge_number.includes(searchTerm) ||
          v.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredVisitors(filtered);
  };

  const fetchVisitors = async () => {
    setLoading(true);
    try {
      if (isDemoMode) {
        // Use demo mode
        const demoVisitors = await demoAPI.getVisitors();
        const sortedVisitors = demoVisitors.sort(
          (a, b) => new Date(b.check_in_time).getTime() - new Date(a.check_in_time).getTime()
        );
        setVisitors(sortedVisitors);
        setLoading(false);
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
        const sortedVisitors = (data.visitors || []).sort(
          (a: Visitor, b: Visitor) =>
            new Date(b.check_in_time).getTime() - new Date(a.check_in_time).getTime()
        );
        setVisitors(sortedVisitors);
      } else {
        toast.error('Failed to fetch visitors');
      }
    } catch (error) {
      console.error('Error fetching visitors:', error);
      toast.error('Error loading visitors');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async (visitorId: string) => {
    try {
      if (isDemoMode) {
        // Use demo mode
        await demoAPI.checkOutVisitor(visitorId);
        toast.success('✅ Visitor checked out successfully! (Demo Mode)', { duration: 3000 });
        fetchVisitors();
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c8ca2e45/visitors/${visitorId}/checkout`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        toast.success('Visitor checked out successfully');
        fetchVisitors();
      } else {
        toast.error('Failed to check out visitor');
      }
    } catch (error) {
      console.error('Error checking out visitor:', error);
      toast.error('Error during check-out');
    }
  };

  const checkedInCount = visitors.filter((v) => v.status === 'checked_in').length;
  const checkedOutCount = visitors.filter((v) => v.status === 'checked_out').length;

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-gray-600">Visitors</h1>
        </div>
        <p className="text-sm text-gray-500">All Visitors</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-blue-700 rounded-t-lg p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter Tabs */}
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              statusFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-800/50 text-blue-100 hover:bg-blue-800'
            }`}
          >
            Total Visitors
            <div className="text-xs mt-1">{visitors.length}</div>
          </button>

          <button
            onClick={() => setStatusFilter('checked_in')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              statusFilter === 'checked_in'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-800/50 text-blue-100 hover:bg-blue-800'
            }`}
          >
            Checked In
            <div className="text-xs mt-1">{checkedInCount}</div>
          </button>

          <button
            onClick={() => setStatusFilter('checked_out')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              statusFilter === 'checked_out'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-800/50 text-blue-100 hover:bg-blue-800'
            }`}
          >
            Checked Out
            <div className="text-xs mt-1">{checkedOutCount}</div>
          </button>
        </div>
      </div>

      {/* Action Bar */}
      <Card className="rounded-t-none border-t-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {filteredVisitors.length} {filteredVisitors.length === 1 ? 'item' : 'items'} • 
                Filtered by {statusFilter === 'all' ? 'All Visitors' : statusFilter === 'checked_in' ? 'Checked In' : 'Checked Out'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search visitors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={fetchVisitors}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visitors List */}
      {loading ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="animate-pulse text-gray-500">Loading visitors...</div>
          </CardContent>
        </Card>
      ) : filteredVisitors.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-center">
              <svg
                className="mx-auto h-24 w-24 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h3 className="mt-4 font-medium text-gray-800">No visitors found</h3>
              <p className="text-sm text-gray-500 mt-2">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Check-ins will appear here'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Visitor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Purpose
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Badge
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Check-In Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Check-Out Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVisitors.map((visitor) => (
                  <tr key={visitor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-medium">
                          {visitor.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{visitor.full_name}</div>
                          <div className="text-sm text-gray-500">{visitor.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-800">{visitor.company || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-800 max-w-xs truncate">
                        {visitor.purpose || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {visitor.badge_number}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(visitor.check_in_time).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {visitor.check_out_time
                        ? new Date(visitor.check_out_time).toLocaleString()
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            visitor.status === 'checked_in' ? 'bg-cyan-500' : 'bg-gray-400'
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            visitor.status === 'checked_in' ? 'text-cyan-700' : 'text-gray-600'
                          }`}
                        >
                          {visitor.status === 'checked_in' ? 'Checked In' : 'Checked Out'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {visitor.status === 'checked_in' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCheckOut(visitor.id)}
                          className="border-blue-600 text-blue-600 hover:bg-blue-50"
                        >
                          <LogOut className="h-4 w-4 mr-1" />
                          Check Out
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}