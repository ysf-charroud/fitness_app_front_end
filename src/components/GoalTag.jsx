import DeleteButton from "./DeleteButtons";

const GoalTag = ({ goal, onDelete }) => (
  <span
    className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full transition-all"
    style={{
      background:
        "linear-gradient(90deg, var(--color-primary-foreground/0.08), var(--color-primary-foreground/0.03))",
      borderWidth: "1px",
      borderColor: "var(--color-primary-foreground/0.14)",
    }}
  >
    <span className="text-sm font-medium text-secondary-foreground">
      {goal}
    </span>
    <DeleteButton
      onDelete={() => onDelete(goal)}
      className="w-4 h-4 bg-surface hover:bg-[var(--color-destructive)]"
    />
  </span>
);
export default GoalTag;
