// components/admin/GymsTable.jsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Trash2, Eye, MapPin, Phone, Mail, CheckCircle, XCircle, Globe } from "lucide-react"; // ✅ Ajout CheckCircle & XCircle
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

export default function GymsTable({ 
  data, 
  onApprove, 
  onReject, 
  onDelete,
  onViewDetails,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGym, setSelectedGym] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const itemsPerPage = 10;

  // Filter data
  const filteredData = data?.filter(gym => {
    const matchesSearch =
      gym.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gym.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gym.address?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus =
      statusFilter === 'all' ? true :
      statusFilter === 'approved' ? gym.isApproved :
      statusFilter === 'pending' ? !gym.isApproved : true;
    
    return matchesSearch && matchesStatus;
  }) || [];

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleViewDetails = (gym) => {
    setSelectedGym(gym);
    setIsDialogOpen(true);
    onViewDetails?.(gym);
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

  return (
    <div className="w-full space-y-4">
      {/* Filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <Input
            type="search"
            placeholder="Search gyms by name, location..."
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
              <TableHead>Gym Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((gym) => (
                <TableRow key={gym._id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 rounded-sm">
                        <AvatarFallback className="text-sm bg-blue-100">
                          {gym.name?.charAt(0) || 'G'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{gym.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {gym.description?.substring(0, 50)}...
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{gym.location || gym.address || 'No location'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 text-sm">
                      {gym.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3" />
                          {gym.phone}
                        </div>
                      )}
                      {gym.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3" />
                          <span className="text-xs">{gym.email}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(gym.isApproved)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 justify-end">
                      {/* View Details */}
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleViewDetails(gym)}
                        className="text-blue-500 hover:text-blue-700"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>

                      {/* Approve / Reject as icons */}
                      {!gym.isApproved ? (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onApprove(gym._id)}
                          className="text-green-500 hover:text-green-700 hover:bg-green-50"
                          title="Approve gym"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onReject(gym._id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          title="Reject gym"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      )}

                      {/* Delete */}
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onDelete(gym._id)}
                        className="text-gray-500 hover:text-red-600 hover:bg-red-50"
                        title="Delete gym"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No gyms found.
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

      {/* Gym Details Dialog */}
     <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Left Side - Image */}
          <div className="relative bg-muted flex items-center justify-center min-h-[500px]">
            {selectedGym?.imageUrl ? (
              <img
                src={selectedGym.imageUrl}
                alt={selectedGym.name || 'Gym'}
                className="w-full h-full object-cover"
              />
            ) : (
              <Avatar className="h-48 w-48 rounded-lg">
                <AvatarFallback className="text-6xl rounded-lg">
                  {selectedGym?.name?.charAt(0) || 'G'}
                </AvatarFallback>
              </Avatar>
            )}
            <div className="absolute top-4 left-4">
              {getStatusBadge(selectedGym?.isApproved)}
            </div>
          </div>

          {/* Right Side - Information */}
          <div className="p-8 overflow-y-auto max-h-[600px]">
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h2 className="text-2xl font-bold mb-2">{selectedGym?.name}</h2>
                <p className="text-sm text-muted-foreground">
                  Complete information about this gym
                </p>
              </div>

              <Separator />

              {/* Location Information */}
              {(selectedGym?.location || selectedGym?.address || selectedGym?.city || selectedGym?.country) && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Location
                  </h3>
                  <div className="space-y-2">
                    {(selectedGym.location || selectedGym.address) && (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 mt-1 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm">
                          {selectedGym.location || selectedGym.address}
                        </span>
                      </div>
                    )}
                    {selectedGym.city && (
                      <div className="text-sm text-muted-foreground">
                        City: <span className="text-foreground">{selectedGym.city}</span>
                      </div>
                    )}
                    {selectedGym.country && (
                      <div className="text-sm text-muted-foreground">
                        Country: <span className="text-foreground">{selectedGym.country}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Contact Information */}
              {(selectedGym?.phone || selectedGym?.email || selectedGym?.website) && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Contact
                    </h3>
                    <div className="space-y-2">
                      {selectedGym.phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{selectedGym.phone}</span>
                        </div>
                      )}
                      {selectedGym.email && (
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{selectedGym.email}</span>
                        </div>
                      )}
                      {selectedGym.website && (
                        <div className="flex items-center gap-3">
                          <Globe  cn=" h-4 text-muted-foreground" />
                          <a 
                            href={selectedGym.website} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                          >
                            {selectedGym.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Description */}
              {selectedGym?.description && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Description
                    </h3>
                    <p className="text-sm leading-relaxed">{selectedGym.description}</p>
                  </div>
                </>
              )}

              {/* Facilities */}
              {selectedGym?.facilities && selectedGym.facilities.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Facilities
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedGym.facilities.map((facility, index) => (
                        <Badge key={index} variant="secondary" className="px-3 py-1">
                          {facility}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </div>
  );
}