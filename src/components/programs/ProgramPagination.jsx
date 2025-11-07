import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

const ProgramPagination = ({
  page,
  totalPages,
  total,
  startIndex,
  endIndex,
  onNextPage,
  onPreviousPage,
  onGoToPage,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages if total pages is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);

      if (page > 3) {
        pages.push("ellipsis-start");
      }

      // Show pages around current page
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (page < totalPages - 2) {
        pages.push("ellipsis-end");
      }

      // Show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="mt-8 space-y-4">
      <div className="text-sm text-muted-foreground text-center">
        Showing {startIndex + 1} to {Math.min(endIndex, total)} of {total} programs
      </div>
      
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={(e) => {
                e.preventDefault();
                onPreviousPage();
              }}
              href="#"
              className={
                page === 1
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>

          {pageNumbers.map((pageNum, index) => {
            if (pageNum === "ellipsis-start" || pageNum === "ellipsis-end") {
              return (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            return (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  onClick={(e) => {
                    e.preventDefault();
                    onGoToPage(pageNum);
                  }}
                  href="#"
                  isActive={pageNum === page}
                  className="cursor-pointer"
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              onClick={(e) => {
                e.preventDefault();
                onNextPage();
              }}
              href="#"
              className={
                page === totalPages
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default ProgramPagination;

