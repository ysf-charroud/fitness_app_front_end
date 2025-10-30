import { Button } from "@/components/ui/button";
import React from "react";

const Home = () => {
  return (
    <div>
      Home
      <p>shacn button</p>
      <Button onClick={() => alert("working")}>click me</Button>
    </div>
  );
};

export default Home;
