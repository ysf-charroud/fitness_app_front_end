import { useEffect, useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ProgramForm } from "@/components/ProgramForm";
import useFetchPrograms from "@/hooks/useFetchPrograms";
import ProgramFilters from "@/components/programs/ProgramFilters";
import ProgramGrid from "@/components/programs/ProgramGrid";
import ProgramPagination from "@/components/programs/ProgramPagination";


export default function ProgramPage() {
  const {
    programs,
    searchQuery,
    activeFilter,
    periodMin,
    periodMax,
    priceMin,
    priceMax,
    page,
    total,
    totalPages,
    startIndex,
    endIndex,
    loading,
    error,
    setSearchQuery,
    setActiveFilter,
    onPeriodChange,
    onPriceChange,
    goToPage,
    nextPage,
    previousPage,
    createProgram,
    updateProgram,
    deleteProgram,
  } = useFetchPrograms();

  const [selectedProgram, setSelectedProgram] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    if (!sheetOpen) {
      setSelectedProgram(null);
    }
  }, [sheetOpen]);

  const showUpdateForm = (program) => {
    setSelectedProgram(program);
    setSheetOpen(true);
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
        <ProgramForm
          createProgram={createProgram}
          updateProgram={updateProgram}
          initialValues={selectedProgram || undefined}
          sheetOpen={sheetOpen}
          setSheetOpen={setSheetOpen}
        />
      </div>

      {/* Filters */}
      <ProgramFilters
        searchQuery={searchQuery}
        activeFilter={activeFilter}
        periodMin={periodMin}
        periodMax={periodMax}
        priceMin={priceMin}
        priceMax={priceMax}
        onSearchChange={setSearchQuery}
        onFilterChange={setActiveFilter}
        onPeriodChange={onPeriodChange}
        onPriceChange={onPriceChange}
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
        showUpdateForm={showUpdateForm}
        updateProgram={updateProgram}
        deleteProgram={deleteProgram}
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
