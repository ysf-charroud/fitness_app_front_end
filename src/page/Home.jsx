import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

import React from "react";
import { Badge } from "@/components/ui/badge"


const Home = () => {
  return (  
    <div>
      Home
      <p>shacn button</p>
       <Link to="/login" className="text-green-600 underline">
          Login here
        </Link><br />
        <Link to="/Register" className="text-green-600 underline">
          Register here
        </Link><br />
      <Button onClick={() => alert("working")}>click me</Button>
      <Badge variant={"secondary"} >99</Badge>
    </div>
  );
};

export default Home;
