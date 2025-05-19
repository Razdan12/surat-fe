import React, { useEffect, useState } from "react";
import { RiCloseLargeFill, RiLogoutBoxRLine } from "react-icons/ri";
import { iconMapping } from "./IconMapping";
import { Link } from "react-router-dom";

import { sidebarList } from "./SidebarList";

const Sidebar = ({ logo }) => {
  const Side = sessionStorage.getItem("side") || "/";
  const [data, setData] = useState([]);
  const [activeMenuItem, setActiveMenuItem] = useState(Side);

  const handleMenuItemClick = (name) => {
    setActiveMenuItem(name);
    sessionStorage.setItem("side", name);
  };

  const handleLogout = () => {
    sessionStorage.clear(); // Bersihkan session
    window.location.href = "/login"; // Redirect ke halaman login
  };

  useEffect(() => {
    setData(sidebarList);
  }, []);

  return (
    <div>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          />
          <ul className="sticky top-0 min-h-screen p-4 bg-blue-700 shadow menu w-60">
            <div className="flex items-center justify-between w-full pb-6 mb-10">
              <div className="flex items-start justify-start w-full gap-1">
                <p className="text-2xl font-bold text-white">ADMINISTRASI</p>
              </div>
              <label
                htmlFor="my-drawer-2"
                className="text-3xl font-bold lg:hidden"
              >
                <RiCloseLargeFill />
              </label>
            </div>
            <ul className="w-full max-w-xs text-white menu">
              {data.map((item, index) => (
                <React.Fragment key={`menu-${index}`}>
                  {item.subLabel && item.subLabel.length > 0 ? (
                    <li className="my-2">
                      <details>
                        <summary>
                          <span>{iconMapping[item.icon]}</span>
                          <a>{item.label}</a>
                        </summary>
                        <ul>
                          {item.subLabel.map((subItem, subIndex) => (
                            <Link to={subItem.path} key={`link-${subIndex}`}>
                              <li
                                className={`my-2 transition duration-200 ${activeMenuItem === subItem.path
                                    ? "bg-blue-800 font-bold rounded"
                                    : ""
                                  }`}
                                onClick={() =>
                                  handleMenuItemClick(subItem.path)
                                }
                              >
                                <p>{subItem.label}</p>
                              </li>
                            </Link>
                          ))}
                        </ul>
                      </details>
                    </li>
                  ) : (
                    <Link to={item.path} key={`link-${index}`}>
                      <li
                        className={`my-2 transition duration-200 ${activeMenuItem === item.path
                            ? "bg-blue-800 rounded"
                            : ""
                          }`}
                        onClick={() => handleMenuItemClick(item.path)}
                      >
                        <div>
                          <span>{iconMapping[item.icon]}</span>
                          <p>{item.label}</p>
                        </div>
                      </li>
                    </Link>
                  )}
                </React.Fragment>
              ))}

              {/* Menu Logout */}
              <li
                className="my-2 transition duration-200 rounded cursor-pointer hover:bg-blue-800"
                onClick={handleLogout}
              >
                <div className="flex items-center gap-2">
                  <span><RiLogoutBoxRLine /></span>
                  <p>Logout</p>
                </div>
              </li>
            </ul>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
