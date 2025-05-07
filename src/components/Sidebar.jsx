import React, { useEffect, useState } from "react";
import { RiCloseLargeFill } from "react-icons/ri";
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
          <ul className="menu p-4 w-60 bg-blue-700 min-h-screen shadow top-0 sticky">
            <div className="w-full flex justify-between mb-10 items-center pb-6">
              <div className="flex justify-start items-start gap-1 w-full">
                <p className="text-2xl text-white font-bold">ADMINISTRASI</p>
              </div>
              <label
                htmlFor="my-drawer-2"
                className="text-3xl font-bold lg:hidden"
              >
                <RiCloseLargeFill />
              </label>
            </div>
            <ul className="menu max-w-xs w-full text-white">
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
                                className={`my-2 transition duration-200 ${
                                  activeMenuItem === subItem.path
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
                        className={`my-2 transition duration-200 ${
                          activeMenuItem === item.path
                            ? "bg-blue-800  rounded"
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
            </ul>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
