// components/admin/CoachesTable.jsx
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Eye, Mail, User, Calendar, FileText, Award, Scale, Activity, AlertTriangle, Check, X } from "lucide-react";
import { approveCoach, rejectCoach } from "@/services/redux/slices/adminSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export default function CoachesTable({ data, onViewDetails, onApprove, onReject }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const itemsPerPage = 10;
  const dispatch = useDispatch();
  // keep a local copy so we can optimistically update row state immediately
  const [localData, setLocalData] = useState(data || []);

  useEffect(() => {
    setLocalData(data || []);
  }, [data]);

  // Filter data
  const filteredData = localData?.filter((coach) => {
    const matchesSearch =
      coach.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coach.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coach.cin?.includes(searchQuery);

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "approved"
        ? coach.is_Approved
        : statusFilter === "pending"
        ? !coach.is_Approved
        : true;

    return matchesSearch && matchesStatus;
  }) || [];

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleViewDetails = (coach) => {
    setSelectedCoach(coach);
    setIsDialogOpen(true);
    onViewDetails?.(coach);
  };

  const applyLocalApprove = (coachId, approved) => {
    setLocalData((prev) => prev.map((c) => (c._id === coachId ? { ...c, is_Approved: approved } : c)));
    setSelectedCoach((prev) => (prev && prev._id === coachId ? { ...prev, is_Approved: approved } : prev));
  };

  const getStatusBadge = (isApproved) => {
    return isApproved ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        Approved
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
        Pending
      </Badge>
    );
  };

  // const getActiveBadge = (isActive) => {
  //   return isActive ? (
  //     <Badge className="bg-emerald-100 text-emerald-800">Active</Badge>
  //   ) : (
  //     <Badge variant="outline" className="bg-gray-100 text-gray-800">Inactive</Badge>
  //   );
  // };

  return (
    <div className="w-full space-y-4">
      {/* Filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <Input
            type="search"
            placeholder="Search coaches by name, email, CIN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="min-w-[250px]"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by approval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator className="w-full" />

      {/* Table */}
      <div className="w-full overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Coach</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>CIN</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((coach) => (
                <TableRow key={coach._id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 rounded-sm">
                        <AvatarFallback className="text-sm bg-blue-100">
                          {coach.name?.charAt(0) || 'C'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{coach.name}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {coach.gender === "male" ? "Male" : "Female"}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{coach.email}</TableCell>
                  <TableCell className="text-sm font-mono">{coach.cin || "—"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      {coach.years_of_experience || 0} yrs
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {getStatusBadge(coach.is_Approved)}
                      {/* {getActiveBadge(coach.isActive)} */}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      {/* View Details */}
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleViewDetails(coach)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>

                      {/* Approve / Reject */}
                      {!coach.is_Approved ? (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            // optimistic UI update
                            applyLocalApprove(coach._id, true);
                            if (onApprove) return onApprove(coach._id);
                            dispatch(approveCoach(coach._id)).catch(() => applyLocalApprove(coach._id, false));
                          }}
                          className="text-green-500 hover:text-green-700 hover:bg-green-50"
                          title="Approve coach"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            // optimistic UI update
                            applyLocalApprove(coach._id, false);
                            if (onReject) return onReject(coach._id);
                            dispatch(rejectCoach(coach._id)).catch(() => applyLocalApprove(coach._id, true));
                          }}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          title="Reject coach"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No coaches found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => handlePageChange(page)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Coach Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Coach Profile</DialogTitle>
            <DialogDescription>
              Detailed information for {selectedCoach?.name}
            </DialogDescription>
          </DialogHeader>

          {selectedCoach && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start gap-4">
                <Avatar className="h-20 w-20 rounded-md">
                  <AvatarFallback className="text-xl bg-blue-100">
                    {selectedCoach.name?.charAt(0) || 'C'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{selectedCoach.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {getStatusBadge(selectedCoach.is_Approved)}
                    {/* {getActiveBadge(selectedCoach.isActive)} */}
                    <Badge variant="secondary">
                      {selectedCoach.gender === "male" ? "Male" : "Female"}
                    </Badge>
                    <Badge variant="outline">
                      Joined: {new Date(selectedCoach.createdAt).toLocaleDateString()}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Contact & ID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Contact & ID
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Email:</span> {selectedCoach.email}</div>
                    {selectedCoach.cin && (
                      <div><span className="font-medium">CIN:</span> {selectedCoach.cin}</div>
                    )}
                  </div>
                </div>

                {/* Experience & Programs */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Experience
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Years of Experience:</span>{" "}
                      {selectedCoach.years_of_experience || "N/A"}
                    </div>
                    <div>
                      <span className="font-medium">Programs Created:</span>{" "}
                      {selectedCoach.programs?.length || 0}
                    </div>
                  </div>
                </div>
              </div>

              {/* Physical Profile */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Scale className="w-4 h-4" /> Physical Profile
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Height:</span>
                    <div>{selectedCoach.height ? `${selectedCoach.height} cm` : "N/A"}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Weight:</span>
                    <div>{selectedCoach.weight ? `${selectedCoach.weight} kg` : "N/A"}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Fitness Level:</span>
                    <div className="capitalize">{selectedCoach.fitness_level || "N/A"}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Activity:</span>
                    <div className="capitalize">{selectedCoach.activity_frequency || "N/A"}</div>
                  </div>
                </div>
              </div>

              {/* Goals & Allergies */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedCoach.goals && (
                  <div>
                    <h4 className="font-semibold mb-2">Primary Goal</h4>
                    <Badge variant="outline" className="capitalize">
                      {selectedCoach.goals.replace(/_/g, " ")}
                    </Badge>
                  </div>
                )}

                {selectedCoach.allergies && selectedCoach.allergies.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4 text-orange-500" /> Allergies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCoach.allergies.map((allergy, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-orange-100 text-orange-800">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Certificates */}
              {selectedCoach.certificates && selectedCoach.certificates.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4" /> Certifications
                  </h4>
                  <div className="space-y-3">
                    {selectedCoach.certificates.map((cert, idx) => (
                      <div key={idx} className="border rounded-md p-3 bg-muted/30">
                        <div className="font-medium">{cert.title}</div>
                        <div className="text-sm text-muted-foreground">{cert.issuer}</div>
                        {cert.issueDate && (
                          <div className="text-xs mt-1">
                            Issued: {new Date(cert.issueDate).toLocaleDateString()}
                          </div>
                        )}
                        {cert.certificateUrl && (
                          <a
                            href={cert.certificateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 text-xs hover:underline inline-block mt-1"
                          >
                            View Certificate
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}