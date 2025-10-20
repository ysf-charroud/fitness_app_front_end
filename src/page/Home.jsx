import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} 
from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} 
from "@/components/ui/dialog";
import Login from "../page/Login";
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
