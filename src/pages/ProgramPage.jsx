import { SidebarTrigger } from "@/components/ui/sidebar";
import { CreateProgramForm } from "@/components/CreateProgramForm";
import useFetchPrograms from "@/hooks/useFetchPrograms";
import ProgramFilters from "@/components/programs/ProgramFilters";
import ProgramGrid from "@/components/programs/ProgramGrid";
import ProgramPagination from "@/components/programs/ProgramPagination";
import api from "@/services/axios/axiosClient";
import { toast } from "sonner";

export default function ProgramPage() {
  const {
    programs,
    searchQuery,
    activeFilter,
    page,
    total,
    totalPages,
    startIndex,
    endIndex,
    loading,
    error,
    setSearchQuery,
    setActiveFilter,
    goToPage,
    nextPage,
    previousPage,
    refetch,
  } = useFetchPrograms();

  const handleProgramCreate = async () => {
    try {
      // Refetch programs to get updated list
      await refetch();
      toast.success("Program created successfully!");
    } catch {
      toast.error("Failed to refresh programs list");
    }
  };

  const handleUpdate = (program) => {
    // TODO: Implement edit functionality
    toast.info(`Edit program: ${program.title}`);
  };

  const handleDelete = async (program) => {
    if (!confirm(`Are you sure you want to delete "${program.title}"?`)) {
      return;
    }

    try {
      await api.delete(`/api/programs/${program._id}`);
      toast.success("Program deleted successfully");
      await refetch();
    } catch (error) {
      console.error("Error deleting program:", error);
      toast.error("Failed to delete program");
    }
  };

  return (
    <div className="w-full px-6 pt-8 h-full overflow-y-auto">
      <SidebarTrigger />

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Program Management
          </h1>
          <p className="text-muted-foreground">
            Manage your fitness programs with ease
          </p>
        </div>
        <CreateProgramForm onProgramCreate={handleProgramCreate} />
      </div>

      {/* Filters */}
      <ProgramFilters
        searchQuery={searchQuery}
        activeFilter={activeFilter}
        onSearchChange={setSearchQuery}
        onFilterChange={setActiveFilter}
      />

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-destructive text-sm">Error: {error}</p>
        </div>
      )}

      {/* Programs Grid */}
      <ProgramGrid
        programs={programs}
        loading={loading}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />

      {/* Pagination */}
      <ProgramPagination
        page={page}
        totalPages={totalPages}
        total={total}
        startIndex={startIndex}
        endIndex={endIndex}
        onNextPage={nextPage}
        onPreviousPage={previousPage}
        onGoToPage={goToPage}
      />
    </div>
  );
}
