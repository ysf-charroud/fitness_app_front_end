import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle2, XCircle, UserCog, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function CoachesManagement({ gymId }) {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (gymId) {
      fetchCoaches();
    }
  }, [gymId]);

  const fetchCoaches = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/gyms/${gymId}/coaches`);
      if (!response.ok) {
        throw new Error(`Failed to load coaches: ${response.status}`);
      }
      const data = await response.json();
      // Your endpoint likely returns { coaches: [...] } or just [...]
      // We'll handle both cases
      const coachesList = Array.isArray(data) ? data : data.coaches || [];
      setCoaches(coachesList);
    } catch (error) {
      console.error('Error fetching coaches:', error);
      toast.error('Failed to load coaches');
      setCoaches([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovalToggle = async (coachId, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/coaches/${coachId}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_approved: !currentStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update approval status');
      }

      const updatedCoach = await response.json();

      setCoaches((prev) =>
        prev.map((coach) => (coach._id === coachId ? updatedCoach : coach))
      );

      toast.success(
        !currentStatus
          ? 'Coach approved successfully'
          : 'Coach approval revoked'
      );
    } catch (error) {
      console.error('Approval toggle error:', error);
      toast.error(error.message || 'Failed to update coach status');
    }
  };

  const pendingCoaches = coaches.filter((c) => !c.is_approved);
  const approvedCoaches = coaches.filter((c) => c.is_approved);

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-slate-500">Loading coaches...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-900">
            <UserCog className="h-5 w-5" />
            Pending Approvals
          </CardTitle>
          <CardDescription className="text-orange-700">
            {pendingCoaches.length} coach{pendingCoaches.length !== 1 ? 'es' : ''} waiting for approval
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingCoaches.length === 0 ? (
            <p className="text-center text-orange-700 py-4">No pending coach approvals</p>
          ) : (
            <div className="rounded-md border border-orange-200 bg-white">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingCoaches.map((coach) => (
                    <TableRow key={coach._id}>
                      <TableCell className="font-medium">{coach.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <Mail className="h-3 w-3" />
                          {coach.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        {coach.specialization ? (
                          <Badge variant="outline" className="capitalize">
                            {coach.specialization}
                          </Badge>
                        ) : (
                          <span className="text-slate-400 text-sm">Not specified</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {new Date(coach.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          onClick={() => handleApprovalToggle(coach._id, coach.is_approved)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5" />
            Approved Coaches
          </CardTitle>
          <CardDescription>
            {approvedCoaches.length} active coach{approvedCoaches.length !== 1 ? 'es' : ''} in your gym
          </CardDescription>
        </CardHeader>
        <CardContent>
          {approvedCoaches.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <UserCog className="h-12 w-12 mx-auto mb-3 text-slate-300" />
              <p>No approved coaches yet</p>
              <p className="text-sm mt-1">Coaches will appear here once approved</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvedCoaches.map((coach) => (
                    <TableRow key={coach._id}>
                      <TableCell className="font-medium">{coach.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <Mail className="h-3 w-3" />
                          {coach.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        {coach.specialization ? (
                          <Badge variant="outline" className="capitalize">
                            {coach.specialization}
                          </Badge>
                        ) : (
                          <span className="text-slate-400 text-sm">Not specified</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Approved
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {new Date(coach.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          onClick={() => handleApprovalToggle(coach._id, coach.is_approved)}
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Revoke
                        </Button>
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