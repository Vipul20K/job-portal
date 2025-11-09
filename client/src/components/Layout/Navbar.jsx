import React, { useContext, useState } from "react";
import { Context } from "../../main";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";



const Navbar = () => {
  const [show, setShow] = useState(false);
  const { isAuthorized, setIsAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/user/logout`,
        { withCredentials: true }
      );
      toast.success(response.data.message);
      setIsAuthorized(false);
      navigateTo("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
      setIsAuthorized(true);
    }
  };

  return (
    <nav className={isAuthorized ? "navbarShow" : "navbarHide"}>
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <div className="logo">
          <img src="/careerconnect-white.png" alt="logo" className="h-10" />
        </div>

        {/* Menu links */}
        <ul className={!show ? "menu" : "show-menu menu flex flex-col md:flex-row"}>
          <li>
            <Link to={"/"} onClick={() => setShow(false)}>
              HOME
            </Link>
          </li>
          <li>
            <Link to={"/job/getall"} onClick={() => setShow(false)}>
              ALL JOBS
            </Link>
          </li>
          <li>
            <Link to={"/applications/me"} onClick={() => setShow(false)}>
              {user && user.role === "Employer"
                ? "APPLICANT'S APPLICATIONS"
                : "MY APPLICATIONS"}
            </Link>
          </li>
          {user && user.role === "Employer" && (
            <>
              <li>
                <Link to={"/job/post"} onClick={() => setShow(false)}>
                  POST NEW JOB
                </Link>
              </li>
              <li>
                <Link to={"/job/me"} onClick={() => setShow(false)}>
                  VIEW YOUR JOBS
                </Link>
              </li>
            </>
          )}
          <button
            onClick={handleLogout}
            className="mt-2 md:mt-0 bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded-md transition"
          >
            LOGOUT
          </button>
        </ul>

     

       

        {/* Hamburger menu for mobile */}
        <div className="hamburger md:hidden" onClick={() => setShow(!show)}>
          {show ? <AiOutlineClose size={24} /> : <GiHamburgerMenu size={24} />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
