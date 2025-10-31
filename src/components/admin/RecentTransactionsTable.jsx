// components/UsersTable.jsx
import { useState, useEffect } from "react";
import { Eye } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import api from "@/services/api";

export default function UsersTable() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [programFilter, setProgramFilter] = useState("all");
  const [creatorFilter, setCreatorFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const itemsPerPage = 10;

  // Fetch data
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get("/admin/transactions");
        setTransactions(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError("Failed to load transactions");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Filter logic
  const filteredTransactions = transactions.filter((tx) => {
    const matchesProgram =
      programFilter === "all" || tx.programTitle === programFilter;
    const matchesCreator =
      creatorFilter === "all" || tx.creator === creatorFilter;
    return matchesProgram && matchesCreator;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Unique values for filters
  const uniquePrograms = Array.from(
    new Set(transactions.map((tx) => tx.programTitle))
  );
  const uniqueCreators = Array.from(
    new Set(transactions.map((tx) => tx.creator))
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setIsDialogOpen(true);
  };

  const getBillingBadge = (billing) => {
    if (billing === "Auto debit") {
      return <Badge className="bg-green-100 text-green-800">Auto Debit</Badge>;
    } else if (billing.includes("PayPal")) {
      return <Badge className="bg-blue-100 text-blue-800">PayPal</Badge>;
    } else {
      return <Badge className="bg-yellow-100 text-yellow-800">Cash</Badge>;
    }
  };

  const getPaymentMethodDisplay = (method) => {
    if (method === "VISA") {
      return (
        <div className="flex items-center gap-2">
          <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
            VISA
          </div>
        </div>
      );
    } else if (method === "Mastercard") {
      return (
        <div className="flex items-center gap-2">
          <div className="w-10 h-6 rounded flex items-center justify-center overflow-hidden">
            <div className="w-5 h-5 rounded-full bg-red-500 -mr-2" />
            <div className="w-5 h-5 rounded-full bg-orange-500" />
          </div>
        </div>
      );
    } else {
      return <span className="text-sm">{method}</span>;
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading transactions...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

// components/UsersTable.jsx (only the Filters section updated)
// ... rest of the code unchanged ...

return (
  <div className="w-full space-y-4">
    {/* Filters - Aligned with table columns */}
    <div className="flex items-center gap-2 w-full">
      {/* Filter by Program */}
      <div className="flex-1 min-w-[150px]">
        <Select value={programFilter} onValueChange={setProgramFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Programs" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Programs</SelectItem>
            {uniquePrograms.map((program) => (
              <SelectItem key={program} value={program}>
                {program}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filter by Creator */}
      <div className="flex-1 min-w-[150px]">
        <Select value={creatorFilter} onValueChange={setCreatorFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Creators" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Creators</SelectItem>
            {uniqueCreators.map((creator) => (
              <SelectItem key={creator} value={creator}>
                {creator}
              </SelectItem>
            ))}
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
            <TableHead className="w-[20%]">Athlete</TableHead>
            <TableHead className="w-[25%]">Program Title</TableHead>
            <TableHead className="w-[15%]">Creator</TableHead>
            <TableHead className="w-[15%]">Billing</TableHead>
            <TableHead className="w-[10%]">Paid by</TableHead>
            <TableHead className="w-[10%]">Price</TableHead>
            <TableHead className="w-[5%] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedTransactions.length > 0 ? (
            paginatedTransactions.map((tx) => (
              <TableRow key={tx._id} className="hover:bg-gray-50">
                <TableCell className="w-[20%]">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {tx.user
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{tx.user}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(tx.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="w-[25%] font-medium">{tx.programTitle}</TableCell>
                <TableCell className="w-[15%]">{tx.creator}</TableCell>
                <TableCell className="w-[15%]">{getBillingBadge(tx.billing)}</TableCell>
                <TableCell className="w-[10%]">{getPaymentMethodDisplay(tx.paidBy)}</TableCell>
                <TableCell className="w-[10%] font-semibold">${tx.price}</TableCell>
                <TableCell className="w-[5%] text-right">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleViewDetails(tx)}
                    className="text-blue-500 hover:text-blue-700"
                    title="View details"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No transactions found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>

    {/* Pagination & Dialog remain unchanged */}


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

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let page;
              if (totalPages <= 5) {
                page = i + 1;
              } else {
                if (currentPage <= 3) page = i + 1;
                else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
                else page = currentPage - 2 + i;
              }
              return page;
            })
              .filter((page, index, self) => self.indexOf(page) === index)
              .map((page) => (
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

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <PaginationItem>
                <span className="px-2">...</span>
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Transaction Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              Details for {selectedTransaction?.programTitle}
            </DialogDescription>
          </DialogHeader>

          {selectedTransaction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Athlete Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>Name: {selectedTransaction.user}</div>
                    <div>Date: {new Date(selectedTransaction.date).toLocaleString()}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Program Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>Title: {selectedTransaction.programTitle}</div>
                    <div>Creator: {selectedTransaction.creator}</div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Billing</h4>
                  <div className="space-y-2 text-sm">
                    <div>{getBillingBadge(selectedTransaction.billing)}</div>
                    <div>Paid by: {selectedTransaction.paidBy}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Price</h4>
                  <div className="text-2xl font-bold text-green-600">
                    ${selectedTransaction.price}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
