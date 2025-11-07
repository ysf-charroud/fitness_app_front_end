import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  CheckCircle2,
  XCircle,
  UserCog,
  Mail,
  User,
  GraduationCap
} from 'lucide-react';
import { toast } from 'sonner';

//  Import Dialog components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';

export default function CoachesManagement({ gymId }) {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoach, setSelectedCoach] = useState(null); // for modal

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
      const response = await fetch(`http://localhost:5000/api/coaches/${coachId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_Approved: !currentStatus }),
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

  const pendingCoaches = useMemo(() => 
    coaches.filter((c) => !c.is_Approved), 
    [coaches]
  );
  
  const approvedCoaches = useMemo(() => 
    coaches.filter((c) => c.is_Approved), 
    [coaches]
  );

  // ✅ Render clickable certificate count
  const renderCertificates = (certs, coachName) => {
    const count = certs?.length || 0;
    if (count === 0) {
      return <span className="text-slate-400 text-sm">None</span>;
    }

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="link"
            size="sm"
            className="p-0 h-auto font-medium text-blue-600 hover:text-blue-800"
            onClick={(e) => {
              e.stopPropagation(); // prevent row click interference (if any)
              setSelectedCoach({ name: coachName, certificates: certs });
            }}
          >
            {count} Certification{count !== 1 ? 's' : ''}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Certifications – {coachName}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            {certs.map((cert, idx) => (
              <Card key={idx} className="p-3">
                <div className="font-medium">{cert.title}</div>
                <div className="text-sm text-slate-600 mt-1">
                  <span className="font-medium">Issued by:</span> {cert.assigned_by}
                </div>
                <div className="text-sm text-slate-600">
                  <span className="font-medium">Issued on:</span>{' '}
                  {cert.issued_at
                    ? new Date(cert.issued_at).toLocaleDateString()
                    : '—'}
                </div>
              </Card>
            ))}
          </div>
          <DialogClose asChild>
            <Button variant="outline" className="mt-4">
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    );
  };

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
      {pendingCoaches.length > 0 && (
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
            <div className="rounded-md border border-orange-200 bg-white">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Exp (Years)</TableHead>
                    <TableHead>Certificates</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingCoaches.map((coach) => (
                    <TableRow key={coach._id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-slate-400" />
                          {coach.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <Mail className="h-3 w-3" />
                          {coach.email}
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{coach.gender || '—'}</TableCell>
                      <TableCell>
                        {coach.specialization ? (
                          <Badge variant="outline" className="capitalize">
                            {coach.specialization}
                          </Badge>
                        ) : (
                          <span className="text-slate-400 text-sm">Not specified</span>
                        )}
                      </TableCell>
                      <TableCell>{coach.years_of_experience || '—'}</TableCell>
                      <TableCell>
                        {renderCertificates(coach.certificates, coach.name)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          onClick={() => handleApprovalToggle(coach._id, coach.is_Approved)}
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
          </CardContent>
        </Card>
      )}

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
                    <TableHead>Gender</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Exp (Years)</TableHead>
                    <TableHead>Certificates</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvedCoaches.map((coach) => (
                    <TableRow key={coach._id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-slate-400" />
                          {coach.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <Mail className="h-3 w-3" />
                          {coach.email}
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{coach.gender || '—'}</TableCell>
                      <TableCell>
                        {coach.specialization ? (
                          <Badge variant="outline" className="capitalize">
                            {coach.specialization}
                          </Badge>
                        ) : (
                          <span className="text-slate-400 text-sm">Not specified</span>
                        )}
                      </TableCell>
                      <TableCell>{coach.years_of_experience || '—'}</TableCell>
                      <TableCell>
                        {renderCertificates(coach.certificates, coach.name)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          onClick={() => handleApprovalToggle(coach._id, coach.is_Approved)}
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