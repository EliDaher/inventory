import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import clsx from "clsx";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "الصفحة الرئيسية", path: "/" },
    { name: "المنتجات", path: "/products" },
  ];


  return (
    <nav dir="rtl" className="bg-background dark:bg-dark-background shadow-lg fixed w-full top-0 z-50">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-cairo font-extrabold text-blue-600 tracking-tight">
          ادارة <span className="text-text dark:text-dark-text">المخزون</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={clsx(
                "text-text dark:text-dark-text font-cario font-medium hover:text-blue-600 dark:hover:text-blue-500 transition-colors duration-200 ml-2",
                location.pathname == link.path && "text-blue-600 font-semibold border-b-2 border-blue-600"
              )}
              
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Hamburger */}
        <button className="md:hidden text-text dark:text-dark-text" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={clsx(
          "bg-background dark:bg-dark-background md:hidden px-4 space-y-3 shadow-md transition-all duration-300 overflow-hidden",
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        )}
      >
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={clsx(
              "bg-background dark:bg-dark-background block text-text dark:text-dark-text font-cairo font-medium hover:text-blue-600 dark:hover:text-primary transition-colors duration-200 py-1",
              location.pathname == link.path && "text-blue-600 font-semibold"
            )}
            onClick={() => {setIsOpen(false);}}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
