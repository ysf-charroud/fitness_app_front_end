import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Mail, Calendar, Activity } from 'lucide-react';
import { toast } from 'sonner';

export default function AthletesManagement({ gymId }) {
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (gymId) {
      fetchAthletes();
    }
  }, [gymId]);

  const fetchAthletes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/gyms/${gymId}/athletes`);
      if (!response.ok) {
        throw new Error(`Failed to load athletes: ${response.status}`);
      }
      const data = await response.json();
      // Handle both { athletes: [...] } and [...] response formats
      const athletesList = Array.isArray(data) ? data : data.athletes || [];
      setAthletes(athletesList);
    } catch (error) {
      console.error('Error fetching athletes:', error);
      toast.error('Failed to load athletes');
      setAthletes([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { className: 'bg-green-100 text-green-800', label: 'Active' },
      inactive: { className: 'bg-slate-100 text-slate-800', label: 'Inactive' },
      suspended: { className: 'bg-red-100 text-red-800', label: 'Suspended' },
    };

    const config = statusConfig[status] || statusConfig.inactive;

    return (
      <Badge className={`${config.className} hover:${config.className}`}>
        {config.label}
      </Badge>
    );
  };

  const activeAthletes = athletes.filter((a) => a.isActive === true);
  const inactiveAthletes = athletes.filter((a) => a.isActive !== false);

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-slate-500">Loading athletes...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Athletes</CardDescription>
            <CardTitle className="text-3xl">{athletes.length}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active Members</CardDescription>
            <CardTitle className="text-3xl text-green-600">{activeAthletes.length}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Inactive Members</CardDescription>
            <CardTitle className="text-3xl text-slate-600">{inactiveAthletes.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            All Athletes
          </CardTitle>
          <CardDescription>Complete list of athletes in your gym</CardDescription>
        </CardHeader>
        <CardContent>
          {athletes.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Users className="h-12 w-12 mx-auto mb-3 text-slate-300" />
              <p>No athletes yet</p>
              <p className="text-sm mt-1">Athletes will appear here when they join your gym</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Membership Start</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {athletes.map((athlete) => (
                    <TableRow key={athlete._id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-slate-400" />
                          {athlete.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <Mail className="h-3 w-3" />
                          {athlete.email}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(athlete.membership_status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <Calendar className="h-3 w-3" />
                          {new Date(athlete.membership_start).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {new Date(athlete.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}