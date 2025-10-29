import React from "react";
import GoalTag from "./GoalTag";

const GoalTags = ({ goals, onTagDelete }) => {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {goals.map((goal, idx) => (
        <GoalTag
          key={`${goal}-${idx}`}
          goal={goal}
          onDelete={onTagDelete}
        />
      ))}
    </div>
  );
};

export default GoalTags;
