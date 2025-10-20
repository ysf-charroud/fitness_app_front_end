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
      <div>
      <DropdownMenu>
        <DropdownMenuTrigger>Login</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>access your Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
         <Dialog>
        <DialogTrigger>Athlete</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              <Login/>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
          <DropdownMenuItem>Coach</DropdownMenuItem>
          <DropdownMenuItem>Admin</DropdownMenuItem>
          <DropdownMenuItem>Gym</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
     
      </div>
    </div>
  );
};

export default Home;
