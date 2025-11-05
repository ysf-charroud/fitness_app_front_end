import ProgramCard from "@/components/PorgramCard";

const ProgramGrid = ({ programs, loading, onUpdate, onDelete, onToggleActive }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="h-96 bg-muted/50 animate-pulse rounded-2xl"
          />
        ))}
      </div>
    );
  }

  if (programs.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <p className="text-muted-foreground text-lg">
          No programs found matching your search.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {programs.map((program) => (
        <ProgramCard
          key={program._id}
          program={program}
          onUpdate={() => onUpdate(program)}
          onDelete={() => onDelete(program)}
          onToggleActive={onToggleActive}
        />
      ))}
    </div>
  );
};

export default ProgramGrid;

