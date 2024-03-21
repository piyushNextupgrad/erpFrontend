import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Layout = ({ children }) => {
  const router = useRouter();
  console.log(router);
  useEffect(() => {
    const token = localStorage.getItem("adminTokenErpApplication");
    // console.log("====<", token);
    if (!token) {
      router.push("/Login");
    }
  }, [router.asPath]);

  return (
    <>
      {router.pathname.includes("Login") ? null : <Header />}
      <Toaster position="top-right" richColors />
      {children}
      {router.pathname.includes("Login") ? null : <Footer />}
    </>
  );
};

export default Layout;
