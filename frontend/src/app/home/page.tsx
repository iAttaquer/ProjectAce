import { UserProvider } from "@/hooks/userContext";
import Navbar from "../../components/Navbar";
import { Toaster } from "react-hot-toast";

const Home = () => {
  return (
    <>
      <UserProvider>
        <Navbar />
     </UserProvider>
      <Toaster />
    </>
  );
}

export default Home;