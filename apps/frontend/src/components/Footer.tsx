import logo from "/logo1.png";
import { Link } from "react-router-dom";
function Footer() {
    return (
        <footer className="bg-white rounded-lg  m-4">
            <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <Link
                        to="/"
                        className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
                    >
                        <img src={logo} className="h-[55px] " alt="logo" />
                        <h2 className="text-2xl font-bold text-indigo-400 ubuntu-bold">
                            Friends
                        </h2>
                    </Link>
                    <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 ">
                        <li>
                            <Link to="#" className="hover:underline me-4 md:me-6">
                                About
                            </Link>
                        </li>
                        <li>
                            <Link to="#" className="hover:underline me-4 md:me-6">
                                Privacy Policy
                            </Link>
                        </li>
                        <li>
                            <Link to="#" className="hover:underline me-4 md:me-6">
                                Licensing
                            </Link>
                        </li>
                        <li>
                            <Link to="#" className="hover:underline">
                                Contact
                            </Link>
                        </li>
                    </ul>
                </div>
                <hr className="my-6 border-gray-200 sm:mx-auto  lg:my-8" />
                <span className="block text-sm text-gray-500 sm:text-center ">
                    © Design And Devloped By{" "}
                    <Link to="https://puskarroy.site" className="hover:underline">
                        Puskar Roy
                    </Link>
                </span>
            </div>
        </footer>
    );
}

export default Footer;