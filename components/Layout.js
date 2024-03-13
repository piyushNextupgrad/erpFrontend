import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { Toaster, toast } from "sonner";

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <Toaster position="top-right" richColors />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
