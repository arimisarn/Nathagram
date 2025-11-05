import { NavLink, useLocation } from "react-router-dom";
import {
  ViewGridIcon,
  BookmarkIcon,
  UserGroupIcon,
  VideoCameraIcon,
} from "@heroicons/react/outline";
import { useAppSelector } from "../../redux/store";

interface PropsIntf {
  username: string;
}

const TabList: React.FC<PropsIntf> = ({ username }) => {
  const location = useLocation();
  const auth = useAppSelector((state) => state.auth);

  const baseClasses =
    "px-6 py-3 md:px-0 md:py-5 flex items-center gap-2 text-gray-600 hover:text-[#1877F2] transition relative";

  const activeClasses =
    "text-[#1877F2] font-semibold border-t-2 border-[#1877F2]";

  return (
    <div className="border-t border-gray-300">
      <ul className="flex items-center justify-center text-sm font-medium">
        {/* Publications */}
        <li className="md:mr-12">
          <NavLink
            to=""
            className={({ isActive }) =>
              `${
                !location.pathname.includes("saved") &&
                !location.pathname.includes("tagged") &&
                !location.pathname.includes("channel")
                  ? activeClasses
                  : ""
              } ${baseClasses}`
            }
          >
            <ViewGridIcon className="w-5 h-5" />
            <span className="hidden md:inline">Publications</span>
          </NavLink>
        </li>

        {/* Enregistrés si c'est mon profil */}
        {auth.user?.username === username ? (
          <li className="md:mr-12">
            <NavLink
              to="saved"
              className={({ isActive }) =>
                `${isActive ? activeClasses : ""} ${baseClasses}`
              }
            >
              <BookmarkIcon className="w-5 h-5" />
              <span className="hidden md:inline">Enregistrés</span>
            </NavLink>
          </li>
        ) : (
          // Vidéos sinon
          <li className="md:mr-12">
            <NavLink
              to="channel"
              className={({ isActive }) =>
                `${isActive ? activeClasses : ""} ${baseClasses}`
              }
            >
              <VideoCameraIcon className="w-5 h-5" />
              <span className="hidden md:inline">Vidéos</span>
            </NavLink>
          </li>
        )}

        {/* Identifiés */}
        <li>
          <NavLink
            to="tagged"
            className={({ isActive }) =>
              `${isActive ? activeClasses : ""} ${baseClasses}`
            }
          >
            <UserGroupIcon className="w-5 h-5" />
            <span className="hidden md:inline">Identifiés</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default TabList;
