// components/admin/ProgramsTable.jsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Eye, Check, X } from "lucide-react"; // On garde seulement les icônes nécessaires
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

export default function ProgramsTable({
  data,
  onApprove,
  onReject,
  onViewDetails,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const itemsPerPage = 10;

  // Filter data
  const filteredData = data?.filter((program) => {
    const matchesSearch = 
      program.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.creator?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.creator?.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all"
        ? true
        : program.status === statusFilter;

    return matchesSearch && matchesStatus;
  }) || [];

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleViewDetails = (program) => {
    setSelectedProgram(program);
    setIsDialogOpen(true);
    onViewDetails?.(program);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Rejected</Badge>;
      case "pending":
      default:
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  const getCreatorName = (program) => {
    if (program.creator?.username) return program.creator.username;
    if (program.creator?.email) return program.creator.email;
    return "N/A";
  };

  return (
    <div className="w-full space-y-4">
      {/* Filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <Input
            type="search"
            placeholder="Search programs by title, creator..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="min-w-[250px]"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
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
              <TableHead>Title</TableHead>
              <TableHead>Creator</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((program) => (
                <TableRow key={program._id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 rounded-sm">
                        <AvatarFallback className="text-sm bg-purple-100">
                          {program.title?.charAt(0) || 'P'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{program.title}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <span>{getCreatorName(program)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(program.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 justify-end">
                      {/* View Details — toujours visible */}
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleViewDetails(program)}
                        className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>

                      {/* Approve / Reject conditionnels */}
                      {program.status === "pending" ? (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => onApprove(program._id)}
                            className="text-green-500 hover:text-green-700 hover:bg-green-50"
                            title="Approve program"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => onReject(program._id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            title="Reject program"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      ) : program.status === "approved" ? (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onReject(program._id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          title="Reject program"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      ) : null}
                      {/* Si rejected → rien de plus que View */}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No programs found.
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

      {/* Program Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Program Details</DialogTitle>
            <DialogDescription>
              Complete information about {selectedProgram?.title}
            </DialogDescription>
          </DialogHeader>

          {selectedProgram && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 rounded-sm">
                  <AvatarFallback className="text-lg bg-purple-100">
                    {selectedProgram.title?.charAt(0) || 'P'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedProgram.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusBadge(selectedProgram.status)}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Creator</h4>
                  <p className="text-sm">{getCreatorName(selectedProgram)}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Period</h4>
                  <p className="text-sm">{selectedProgram.period} days</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Price</h4>
                <p className="text-sm">{selectedProgram.price} MAD</p>
              </div>

              {selectedProgram.program_goals?.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Goals</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProgram.program_goals.map((goal, index) => (
                      <Badge key={index} variant="secondary">
                        {goal}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-medium mb-2">Active</h4>
                <Badge variant={selectedProgram.active ? "default" : "outline"}>
                  {selectedProgram.active ? "Yes" : "No"}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}