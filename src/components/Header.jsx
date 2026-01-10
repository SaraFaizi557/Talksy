import React, { useState } from "react";
import logo from "../constant";
import { CloudMoon, CloudSun, TextAlignJustify } from "lucide-react";

const Header = ({ setTheme, }) => {
  const [isDark, setIsDark] = useState(false);

  return (
    <div className="flex w-screen px-5 py-3 items-center justify-between border-b border-(--Border)">
      <div className="flex items-center gap-0 cursor-pointer [font-family:var(--Ceviche-family)]">
        {logo.map((n) => (
          <h1 key={n.id} className="text-3xl md:text-4xl text-(--Primary) select-none hover:-translate-y-2 transition-all duration-200">
            {n.char}
          </h1>
        ))}
      </div>
      <div className="flex items-center gap-3 md:gap-5">
        <button
          onClick={() => {
            setIsDark((prev) => !prev);
            setTheme((t) => (t === "dark" ? "light" : "dark"));
          }}
          className="w-12 outline-none flex items-center px-1 py-1 cursor-pointer h-6 bg-(--Primary) rounded-full transition-transform ease-in-out duration-800"
        >
          <div
            className={`w-4 h-full flex items-center justify-center rounded-full bg-(--Surface) transition-all duration-400 ${
              isDark ? "translate-x-6" : "translate-0"
            }`}
          >{isDark ? <CloudSun size={13} className="text-(--Text)" fill="#111827" /> : <CloudMoon size={13} className="text-(--Text)" fill="#e6edff" />}</div>
        </button>
        <div>
          <img className="w-9 h-9 md:w-9 md:h-9 cursor-pointer rounded-full border-2 border-(--Primary)" src="/assets\profile.jpg" alt="Profile pic" />
        </div>
      </div>
    </div>
  );
};

export default Header;
