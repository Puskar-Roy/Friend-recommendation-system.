import { useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { IoMdCloseCircle } from "react-icons/io";
import logo from "/logo1.png";
import { NavbarData } from "../lib/data";
import { NavbarItems } from "../interfaces";
// import { useLogout } from "../hooks/useLogout";
// import { useAuthContext } from "../hooks/useAuthContext";

const NavItem = ({ href, tags, closeNav }: NavbarItems) => (
    <li
        onClick={closeNav}
        className="hover:text-indigo-500 font-semibold text-lg gabarito-regular"
    >
        <Link to={href}>{tags}</Link>
    </li>
);

const Navbar = () => {
    // const { logout } = useLogout();
    // const { state } = useAuthContext();
    const [toggle, setToggle] = useState<boolean>(false);
    const [user, setUser] = useState({
        name: "Puskar",
        email: "puskar@gmail.com",
        role: "admin",
    });

    const toggleMenu = () => setToggle(!toggle);

    const handleLogout = () => {
        // logout();
        // setUser(null);
        setUser({
            name: "",
            email: "",
            role: "",
        })
        toggleMenu();
    };

    const isAdmin = user?.role === `${import.meta.env.VITE_ROLE}`;

    return (
        <header className="shadow-lg">
            <nav className="flex justify-between items-center w-[80%] mx-auto py-5">
                <Link to="/" className="flex items-center gap-2 z-20">
                    <img src={logo} alt="Logo" className="h-[55px]" />
                    <h2 className="text-2xl font-bold text-indigo-400 ubuntu-bold">
                        Friends
                    </h2>
                </Link>

                <div className="sm:hidden">
                    {toggle ? (
                        <IoMdCloseCircle
                            onClick={toggleMenu}
                            className="text-indigo-400 text-3xl"
                        />
                    ) : (
                        <HiOutlineMenuAlt3
                            onClick={toggleMenu}
                            className="text-indigo-400 text-3xl"
                        />
                    )}
                </div>

                {/* Mobile Menu */}
                <div
                    className={`${
                        toggle ? "left-0" : "left-[-100%]"
                    } sm:hidden absolute top-0 h-screen w-[300px] flex flex-col justify-center items-center backdrop-blur-lg transition-all duration-400 z-[100]`}
                >
                    <ul className="flex flex-col gap-8">
                        {!user &&
                            NavbarData.map(({ href, tags }: NavbarItems) => (
                                <NavItem key={href} href={href} tags={tags} closeNav={toggleMenu} />
                            ))}
                        {isAdmin && (
                            <>
                                <NavItem href="/viewAttendance" tags="View Attendance" closeNav={toggleMenu} />
                                <NavItem href="/usersAttendance" tags="Manage Attendance" closeNav={toggleMenu} />
                                <NavItem href="/countAttendance" tags="Take Attendance" closeNav={toggleMenu} />
                            </>
                        )}
                        {user && (
                            <>
                                <div className="text-lg font-semibold gabarito-regular">
                                    {user.email}
                                </div>
                                <div
                                    onClick={handleLogout}
                                    className="cursor-pointer hover:text-indigo-500 font-semibold text-lg gabarito-regular"
                                >
                                    Logout
                                </div>
                            </>
                        )}
                    </ul>
                </div>

                {/* Desktop Menu */}
                <div className="hidden sm:flex gap-x-12">
                    <ul className="flex gap-x-12">
                        {!user &&
                            NavbarData.map(({ href, tags }: NavbarItems) => (
                                <NavItem key={href} href={href} tags={tags} />
                            ))}
                        {isAdmin && (
                            <>
                                <NavItem href="/viewAttendance" tags="View Attendance" />
                                <NavItem href="/usersAttendance" tags="Manage Attendance" />
                                <NavItem href="/countAttendance" tags="Take Attendance" />
                            </>
                        )}
                        {user && (
                            <>
                                <div className="text-lg font-semibold gabarito-regular">
                                    {user.email}
                                </div>
                                <div
                                    onClick={handleLogout}
                                    className="cursor-pointer hover:text-indigo-500 font-semibold text-lg gabarito-regular"
                                >
                                    Logout
                                </div>
                            </>
                        )}
                    </ul>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
