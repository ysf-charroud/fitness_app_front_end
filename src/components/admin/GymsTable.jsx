// components/admin/GymsTable.jsx
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Trash2, Eye, MapPin, Phone, Mail, Check, X, Globe ,Euro,Clock , Users,Calendar} from "lucide-react"; // ✅ Mise à jour des icônes
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
import { approveGym, rejectGym } from "@/services/redux/slices/adminSlice";

// const getEquipmentCategories = (equipements) => {
//   if (!equipements) return [];
//   const categories = {};
//   Object.entries(equipements).forEach(([key]) => {
//     const category = key.split('_')[0];
//     if (!categories[category]) categories[category] = [];
//     categories[category].push(key);
//   });
//   return Object.entries(categories).map(([category, items]) => ({
//     category: category.charAt(0).toUpperCase() + category.slice(1),
//     items
//   }));
// };

const getEquipmentName = (equipment) => {
  return equipment.split('_').slice(1).join(' ').toLowerCase()
    .replace(/\b\w/g, l => l.toUpperCase());
};

export default function GymsTable({ 
  data, 
  onApprove, 
  onReject, 
  onDelete,
  onViewDetails,
}) {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGym, setSelectedGym] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const itemsPerPage = 10;
  const [localData, setLocalData] = useState(data || []);

  useEffect(() => {
    setLocalData(data || []);
  }, [data]);

  // Filter data
  const filteredData = localData?.filter(gym => {
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

  const applyLocalApprove = (gymId, approved) => {
    setLocalData(prev => prev.map(g => g._id === gymId ? { ...g, isApproved: approved } : g));
    setSelectedGym(prev => (prev && prev._id === gymId ? { ...prev, isApproved: approved } : prev));
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
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        <span>{gym.contact?.phone || gym.phone || '___________'}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Globe className="w-3 h-3 text-muted-foreground" />
                        {(() => {
                          const websiteValue = gym.contact?.website || gym.website;
                          if (websiteValue) {
                            const href = websiteValue.startsWith('http') ? websiteValue : `https://${websiteValue}`;
                            return (
                              <a href={href} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                                {websiteValue}
                              </a>
                            );
                          }
                          return <span className="text-xs">___________</span>;
                        })()}
                      </div>
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
                          onClick={() => {
                            // optimistic update
                            applyLocalApprove(gym._id, true);
                            if (onApprove) return onApprove(gym._id);
                            dispatch(approveGym(gym._id)).catch(() => applyLocalApprove(gym._id, false));
                          }}
                          className="text-green-500 hover:text-green-700 hover:bg-green-50"
                          title="Approve gym"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            // optimistic update
                            applyLocalApprove(gym._id, false);
                            if (onReject) return onReject(gym._id);
                            dispatch(rejectGym(gym._id)).catch(() => applyLocalApprove(gym._id, true));
                          }}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          title="Reject gym"
                        >
                          <X className="w-4 h-4" />
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
      {/* Gym Details Dialog */}
<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
  <DialogContent className="max-w-6xl max-h-[90vh] p-0 overflow-hidden">
    <div className="grid grid-cols-1 lg:grid-cols-2 h-full max-h-[90vh]">
      {/* Photo Gallery */}
      <div className="bg-muted relative flex flex-col">
        {/* Main Image */}
        <div className="flex-1 overflow-hidden">
          {selectedGym?.photos && selectedGym.photos.length > 0 ? (
            <img
              src={selectedGym.photos[0]}
              alt={selectedGym.name || 'Gym'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Avatar className="h-48 w-48 rounded-lg">
                <AvatarFallback className="text-6xl bg-gray-200 rounded-lg">
                  {selectedGym?.name?.charAt(0) || 'G'}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>

        {/* Thumbnails (if multiple photos) */}
        {selectedGym?.photos?.length > 1 && (
          <div className="flex gap-2 p-3 bg-white border-t overflow-x-auto">
            {selectedGym.photos.map((photo, idx) => (
              <button
                key={idx}
                onClick={() => {
                  const updated = [...selectedGym.photos];
                  updated[0] = photo;
                  updated[idx] = selectedGym.photos[0];
                  setSelectedGym({ ...selectedGym, photos: updated });
                }}
                className="flex-shrink-0 w-16 h-16 rounded border overflow-hidden"
              >
                <img src={photo} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Status badge */}
        <div className="absolute top-4 left-4">
          {getStatusBadge(selectedGym?.isApproved)}
        </div>
      </div>

      {/* Info Panel */}
      <div className="p-6 overflow-y-auto bg-white">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{selectedGym?.name}</h2>
            <p className="text-sm text-gray-600 flex items-center gap-1.5 mt-1">
              <MapPin className="w-4 h-4" />
              {selectedGym?.location || selectedGym?.address || 'No location'}
            </p>
          </div>

          {/* Contact */}
          <section>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">Contact</h3>
            <div className="space-y-2 text-sm">
              {selectedGym?.contact?.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedGym.contact.phone}</span>
                </div>
              )}
              {selectedGym?.contact?.website && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <a
                    href={selectedGym.contact.website.startsWith('http') ? selectedGym.contact.website : `https://${selectedGym.contact.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {selectedGym.contact.website}
                  </a>
                </div>
              )}
            </div>
          </section>

          {/* Details */}
          <section>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {selectedGym?.schedule && (
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <span className="text-xs text-gray-500">Schedule</span>
                    <p>{selectedGym.schedule}</p>
                  </div>
                </div>
              )}
              {selectedGym?.pricing !== undefined && (
                <div className="flex items-start gap-2">
                  <Euro className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <span className="text-xs text-gray-500">Pricing</span>
                    <p>{selectedGym.pricing} TND/month</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-2">
                <Users className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <div>
                  <span className="text-xs text-gray-500">Mixity</span>
                  <p>{selectedGym?.mix ? 'Mixed' : 'Women Only'}</p>
                </div>
              </div>
              {selectedGym?.createdAt && (
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <span className="text-xs text-gray-500">Created</span>
                    <p>{new Date(selectedGym.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Activities */}
          {selectedGym?.activities?.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">Activities</h3>
              <div className="flex flex-wrap gap-2">
                {selectedGym.activities.map((activity, i) => (
                  <Badge key={i} variant="secondary" className="px-2.5 py-1 text-xs">
                    {activity}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          {/* Equipment */}
         {/* Equipment - Compact Version */}
{selectedGym?.equipements && (
  <section>
    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">Equipment</h3>
    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
      {Object.keys(selectedGym.equipements)
        .filter(key => selectedGym.equipements[key]) // ne garde que les équipements à true
        .map((key, idx) => (
          <Badge key={idx} variant="outline" className="px-2 py-0.5 text-xs whitespace-nowrap">
            {getEquipmentName(key)}
          </Badge>
        ))}
    </div>
  </section>
)}
          {/* Stats */}
          {(selectedGym?.coaches?.length > 0 || selectedGym?.athletes?.length > 0) && (
            <section>
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">Statistics</h3>
              <div className="grid grid-cols-2 gap-3">
                {selectedGym.coaches && (
                  <div className="text-center py-2 bg-muted rounded">
                    <div className="text-xl font-bold">{selectedGym.coaches.length}</div>
                    <div className="text-xs text-muted-foreground">Coaches</div>
                  </div>
                )}
                {selectedGym.athletes && (
                  <div className="text-center py-2 bg-muted rounded">
                    <div className="text-xl font-bold">{selectedGym.athletes.length}</div>
                    <div className="text-xs text-muted-foreground">Athletes</div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Description */}
          {selectedGym?.description && (
            <section>
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">Description</h3>
              <p className="text-sm text-gray-700 whitespace-pre-line">{selectedGym.description}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  </DialogContent>
</Dialog>
    </div>
  );
}