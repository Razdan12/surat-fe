import { FC } from 'react';
import { BsFillBellFill } from 'react-icons/bs';
import { CiCircleList, CiSun } from 'react-icons/ci';
import { FaMoon } from 'react-icons/fa';


const Navbar= () => {
  return (
    <div className="px-5 bg-blue-700 shadow-sm navbar">
      <div className="navbar-start">
        <label htmlFor="my-drawer-2" className="text-xl cursor-pointer drawer-button lg:hidden">
          <CiCircleList />
        </label>
       
      </div>
            <div className="hidden navbar-center lg:flex">
        <h1 className="text-lg font-semibold tracking-wide text-center text-white">
          SISTEM INFORMASI MANAJEMEN ARSIP SURAT KECAMATAN BOJONGSARI
        </h1>
      </div>
      <div className="gap-4 navbar-end">

      </div>
    </div>
  );
};

export default Navbar;
