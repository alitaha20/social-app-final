import React, { useContext, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
  Dropdown,
  Avatar,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { Link, Links, useNavigate } from "react-router-dom";
import { authContext } from "../contaxt/authContextPorvder";

export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default function navBar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const {Token,setToken} = useContext(authContext)
  const route = useNavigate()

  function backPage (){
    localStorage.removeItem("token")
    setToken(null)
    route("/login")


  }

  const menuItems = [
    "rigster",
    "login",
    "Log Out",
  ];

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <AcmeLogo />
          <Link to={"/Home"}><p className="font-bold text-inherit">Home</p>
</Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="end">
      {  Token ? 
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name="Jason Hughes"
              size="sm"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem  key="profile" >
              <Link to={ "/profile"}> profile</Link>
            </DropdownItem>
            <DropdownItem key="logout" color="danger">
              <Button onClick={backPage}> Log out </Button>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
         : <>
        <NavbarItem className="hidden lg:flex">
          <Link to="/login">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" className=" hidden lg:flex" to={"/rigister"} variant="flat">
            Sign Up
          </Button>
        </NavbarItem>
      </>}


      
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              color={
                index === 2 ? "primary" : index === menuItems.length - 1 ? "danger" : "foreground"
              }
              href="#"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}

