import { UserProvider } from "@/hooks/userContext";
import Navbar from "../../components/Navbar";
import { Toaster } from "react-hot-toast";
import ProjectsList from "@/components/ProjectsList";

const Home = () => {
  return (
    <div className="h-screen bg-gray-900">
      <UserProvider>
        <Navbar />
      </UserProvider>
      <Toaster />
      <ProjectsList />
    </div>
  );
}

export default Home;