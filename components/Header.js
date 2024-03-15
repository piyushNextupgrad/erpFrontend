import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import { RxHamburgerMenu } from "react-icons/rx";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

function hamburger() {
  const [show, setShow] = useState(false);
  const [menuOpen, setmenuOpen] = useState("menuClose");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const router = useRouter();

  function logout() {
    localStorage.clear();
    router.push("/Login");
  }
  return (
    <>
      <button className="btn btn-sm btn-dark btn-logout" onClick={logout}>
        Logout
      </button>
      <RxHamburgerMenu variant="primary" onClick={handleShow} />

      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title></Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ul>
            <li className="topHeaderMenu ">Dashboard</li>
          </ul>
          <ul>
            <li
              className="topHeaderMenu "
              onClick={() =>
                menuOpen == "menuClose"
                  ? setmenuOpen("menuOpen")
                  : setmenuOpen("menuClose")
              }
            >
              Master Entry
              {menuOpen == "menuOpen" ? (
                <IoIosArrowDown />
              ) : (
                <IoIosArrowForward />
              )}
            </li>
          </ul>
          <div className={menuOpen}>
            <ul>
              <li>School Information</li>
              <li>City Details</li>
              <li>Fees Settings</li>
              <li>Manage Users</li>
              <li>Dashboard Settings</li>
            </ul>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

const Header = () => {
  return (
    <>
      <Navbar className="bg-light navBar">
        <Container>
          <Link className="link" href="/">
            <h3>
              {/* <Image src="/logo.png" width="40" height="40" /> */}
              <span className="logo">ERP</span>
            </h3>
          </Link>
          {hamburger()}
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
