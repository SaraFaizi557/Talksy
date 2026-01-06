import { Cat, MessagesSquare, PanelLeft, WandSparkles } from "lucide-react";
import React from "react";

const Sidebar = ({ openMenu }) => {
  return (
    <>
      {openMenu && <div className="hidden lg:flex h-full px-3 py-4.5 flex-col w-80 border-l border-(--Border)">
        <div className="flex items-center justify-between">

        </div>
      </div>}
    </>
  );
};

export default Sidebar;
