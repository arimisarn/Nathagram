import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Heart,
  PlusCircle,
  Send,
  Globe,
  User,
  Bookmark,
  Settings,
  Repeat,
  Search,
  MessageCircle,
  Bell,
  Menu,
  Users,
  Play,
  Store,
  X,
  Compass,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { showAddPostModal } from "../redux/slice/addPost";
import { logoutUser } from "../redux/slice/auth";
import routes from "../routes";

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const location = useLocation();

  const [showSearchResult, setShowSearchResult] = useState(false);
  const [showAuthDropDown, setShowAuthDropDown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const handleClick = () => {
      setShowSearchResult(false);
      setShowAuthDropDown(false);
      setShowMobileMenu(false);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  // Fonction pour déterminer si un lien est actif
  const isActiveLink = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  // Configuration des éléments de navigation
  const navItems = [
    { path: "/", icon: Home, label: "Accueil" },
    { path: routes.explore, icon: Compass, label: "Explorer" },
    { path: routes.inbox, icon: MessageCircle, label: "Messages" },
    {
      path: `${routes.userProfile(auth.user?.username!)}/saved`,
      icon: Bookmark,
      label: "Enregistré",
    },
  ];

  return (
    <div className="fixed top-0 w-full bg-white shadow-sm border-b border-gray-200 z-50">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center px-2 sm:px-4 py-2 h-14">
        {/* Section gauche - Logo et Search */}
        <div className="flex items-center space-x-2 sm:space-x-3 flex-1">
          {/* Logo Facebook style */}
          <Link to="/" className="flex items-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm sm:text-lg logo-font">N</span>
            </div>
          </Link>

          {/* Barre de recherche Facebook style - cachée sur mobile */}
          <div className="relative hidden sm:block">
            <div className="flex items-center bg-gray-100 rounded-full px-3 py-2 w-40 md:w-60">
              <Search className="w-4 h-4 text-gray-500 mr-2" />
              <input
                placeholder="Rechercher sur Nathagram"
                onClick={(e) => {
                  stopPropagation(e);
                  setShowSearchResult(true);
                }}
                className="bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-500 flex-1"
              />
            </div>
            <AnimatePresence>
              {showSearchResult && (
                <motion.div
                  onClick={stopPropagation}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute mt-2 w-72 sm:w-80 bg-white shadow-xl rounded-lg max-h-96 overflow-y-auto p-4 z-50 border border-gray-200"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-gray-700">
                      Recherches récentes
                    </span>
                    <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">
                      Tout effacer
                    </button>
                  </div>
                  <p className="text-gray-500 text-sm">
                    Aucune recherche récente.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bouton de recherche mobile */}
          <button
            className="w-8 h-8 sm:hidden bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
            title="Rechercher"
          >
            <Search className="w-4 h-4 text-gray-700" />
          </button>
        </div>

        {/* Section centrale - Navigation principale Facebook style - cachée sur mobile */}
        <div className="hidden lg:flex items-center justify-center flex-1">
          <nav className="flex space-x-1">
            {navItems.map(({ path, icon: Icon, label }) => {
              const isActive = isActiveLink(path);
              return (
                <Link
                  key={path}
                  to={path}
                  className={`relative flex items-center justify-center w-20 xl:w-28 h-12 rounded-lg transition-colors group ${
                    isActive ? "text-blue-600" : "hover:bg-gray-100"
                  }`}
                  title={label}
                >
                  <Icon
                    className={`w-5 h-5 xl:w-6 xl:h-6 transition-colors ${
                      isActive
                        ? "text-blue-600"
                        : "text-gray-600 group-hover:text-blue-600"
                    }`}
                  />
                  {/* Indicateur actif */}
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 xl:w-16 h-1 bg-blue-600 rounded-t-full"></div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Section droite - Actions et profil Facebook style */}
        <div className="flex items-center space-x-1 sm:space-x-2 flex-1 justify-end">
          {/* Boutons d'action circulaires */}

          <button
            className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
            {/* Point de notification */}
            <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full"></span>
          </button>

          {/* Menu hamburger pour mobile */}
          <button
            onClick={(e) => {
              stopPropagation(e);
              setShowMobileMenu(!showMobileMenu);
            }}
            className="w-8 h-8 lg:hidden bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
            title="Menu"
          >
            {showMobileMenu ? (
              <X className="w-4 h-4 text-gray-700" />
            ) : (
              <Menu className="w-4 h-4 text-gray-700" />
            )}
          </button>

          {/* Menu profil Facebook style */}
          <div className="relative">
            <img
              onClick={(e) => {
                stopPropagation(e);
                setShowAuthDropDown(!showAuthDropDown);
              }}
              src="https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png"
              alt="profile"
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full cursor-pointer object-cover transition-all ${
                showAuthDropDown
                  ? "border-2 border-blue-500"
                  : "border-2 border-transparent hover:border-gray-300"
              }`}
              title="Menu du compte"
            />
            <AnimatePresence>
              {showAuthDropDown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-10 sm:top-12 bg-white shadow-xl rounded-lg w-72 sm:w-80 z-50 border border-gray-200 overflow-hidden"
                  onClick={stopPropagation}
                >
                  {/* Header du profil */}
                  <div className="p-3 sm:p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <img
                        src="https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png"
                        alt="profile"
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-gray-800 text-sm sm:text-base">
                          {auth.user?.username || "Utilisateur"}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          Voir votre profil
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="py-2">
                    <Link
                      className={`flex items-center px-3 sm:px-4 py-2 sm:py-3 transition-colors ${
                        isActiveLink(routes.userProfile(auth.user?.username!))
                          ? "bg-blue-50 text-blue-600"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                      to={routes.userProfile(auth.user?.username!)}
                    >
                      <div
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center mr-3 ${
                          isActiveLink(routes.userProfile(auth.user?.username!))
                            ? "bg-blue-100"
                            : "bg-gray-100"
                        }`}
                      >
                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                      </div>
                      <span className="font-medium text-sm sm:text-base">
                        Profil
                      </span>
                    </Link>

                    <Link
                      className={`flex items-center px-3 sm:px-4 py-2 sm:py-3 transition-colors ${
                        location.pathname.includes("/saved")
                          ? "bg-blue-50 text-blue-600"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                      to={`${routes.userProfile(auth.user?.username!)}/saved`}
                    >
                      <div
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center mr-3 ${
                          location.pathname.includes("/saved")
                            ? "bg-blue-100"
                            : "bg-gray-100"
                        }`}
                      >
                        <Bookmark className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                      </div>
                      <span className="font-medium text-sm sm:text-base">
                        Éléments enregistrés
                      </span>
                    </Link>

                    <Link
                      className="flex items-center px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-50 transition-colors text-gray-700"
                      to=""
                    >
                      <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                        <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                      </div>
                      <span className="font-medium text-sm sm:text-base">
                        Paramètres et confidentialité
                      </span>
                    </Link>

                    <Link
                      className="flex items-center px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-50 transition-colors text-gray-700"
                      to=""
                    >
                      <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                        <Repeat className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                      </div>
                      <span className="font-medium text-sm sm:text-base">
                        Changer de compte
                      </span>
                    </Link>
                  </div>

                  {/* Séparateur */}
                  <hr className="border-gray-200" />

                  {/* Logout */}
                  <div className="py-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-50 transition-colors text-left text-gray-700"
                    >
                      <span className="font-medium text-sm sm:text-base">
                        Se déconnecter
                      </span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Menu mobile pour la navigation */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden bg-white border-t border-gray-200 shadow-lg"
            onClick={stopPropagation}
          >
            <nav className="px-4 py-2">
              {navItems.map(({ path, icon: Icon, label }) => {
                const isActive = isActiveLink(path);
                return (
                  <Link
                    key={path}
                    to={path}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        isActive ? "text-blue-600" : "text-gray-600"
                      }`}
                    />
                    <span className="font-medium">{label}</span>
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
