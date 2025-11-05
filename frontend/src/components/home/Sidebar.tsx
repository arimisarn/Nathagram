import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../redux/store";
import routes from "../../routes";
import Spin from "../features/animation/Spin";
import {
  fetchUserSuggestionsService,
  followUserService,
} from "../../services/user";
import { UserSuggestionsInterface } from "../../interfaces/auth";

const Sidebar = () => {
  const auth = useAppSelector((state) => state.auth);

  const [suggestions, setSuggestions] = useState<UserSuggestionsInterface[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserSuggestions = async () => {
      try {
        const res = await fetchUserSuggestionsService(auth.token);
        const data = res.data as UserSuggestionsInterface[];
        setSuggestions(data);
      } catch (e: any) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    fetchUserSuggestions();
  }, [auth.token]);

  const handleFollowUser = async (username: string) => {
    try {
      await followUserService(auth.token, username);
      setSuggestions((prevValues) =>
        prevValues.filter((obj) => obj.username !== username)
      );
    } catch (e: any) {
      console.log(e);
    }
  };

  return (
    <aside className="px-3 fixed h-screen  w-full max-w-xs top-28 text-sm">
      {/* Profil utilisateur */}
      <div className="flex items-center justify-between mb-8">
        <Link
          to={routes.userProfile(auth.user?.username!)}
          className="flex items-center hover:opacity-90 transition"
        >
          <img
            className="w-14 h-14 rounded-full object-cover border shadow-sm"
            src={auth.user?.profile?.image}
            alt={auth.user?.username}
          />
          <span className="ml-4 font-medium dark:text-gray-200">
            {auth.user?.username}
          </span>
        </Link>
        <button className="text-blue-500 hover:text-blue-400 text-xs font-medium cursor-pointer">
          Changer
        </button>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Suggestions pour vous
            </h2>
            <Link
              to="/"
              className="font-medium text-xs text-gray-700 dark:text-gray-300 hover:underline"
            >
              Voir tout
            </Link>
          </div>

          {loading ? (
            <Spin textColor="text-blue-500" className="!mx-auto" />
          ) : (
            <div className="mb-8">
              {suggestions.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between mb-4 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition"
                >
                  <Link
                    to={routes.userProfile(user.username)}
                    className="flex items-center"
                  >
                    <img
                      className="w-9 h-9 rounded-full object-cover border"
                      src={user.profile.image}
                      alt={user.username}
                    />
                    <span className="ml-3 font-medium dark:text-gray-200">
                      {user.username}
                    </span>
                  </Link>
                  <button
                    onClick={() => handleFollowUser(user.username)}
                    className="text-blue-500 hover:text-blue-400 text-xs font-semibold cursor-pointer"
                  >
                    Suivre
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Footer */}
      {/* <footer className="mt-6 text-xs text-gray-400 dark:text-gray-500">
        &copy; 2025 INSTAGRAM CLONE by Morteza MN
      </footer> */}
    </aside>
  );
};

export default Sidebar;
