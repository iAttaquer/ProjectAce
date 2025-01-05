"use client";
import { UserProvider } from "@/hooks/userContext";
import Navbar from "../../components/Navbar";
import { Toaster } from "react-hot-toast";
import ProjectsList from "@/components/ProjectsList";
import { ProjectProvider } from "@/hooks/projectContext";
import ProjectDetails from "@/components/ProjectDetails";

const Home = () => {
  return (
    <div className="h-screen bg-gray-900">
      <UserProvider>
        <Navbar />
      <Toaster />
      <ProjectProvider>
        <div className="flex flex-row">
          <ProjectsList />
          <ProjectDetails />
        </div>
      </ProjectProvider>
      </UserProvider>
    </div>
  );
}

export default Home;