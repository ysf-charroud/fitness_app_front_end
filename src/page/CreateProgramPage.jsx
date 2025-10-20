import { Card, CardHeader } from "@/components/ui/card";
import React from "react";

const CreateProgramPage = () => {
  return (
    <div>
      <Card className={"shadow-md"}>
        <CardHeader>
          <h1 className="heading capitalize"> Add New Program </h1>
        </CardHeader>
      </Card>
    </div>
  );
};

export default CreateProgramPage;
