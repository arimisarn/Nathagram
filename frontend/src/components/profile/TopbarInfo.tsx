import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CogIcon } from "@heroicons/react/outline";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { useAppSelector } from "../../redux/store";
import { userProfileTopBarInfo } from "../../interfaces/auth";
import {
  fetchUserInfoService,
  followUserService,
  unFollowUserService,
} from "../../services/user";

interface PropsIntf {
  username: string;
}

const TopbarInfo: React.FC<PropsIntf> = ({ username }) => {
  const { width } = useWindowDimensions();
  const auth = useAppSelector((state) => state.auth);

  const [userInfo, setUserInfo] = useState<userProfileTopBarInfo>({
    posts_count: 0,
    followings_count: 0,
    followers_count: 0,
    followed_by_user: false,
    user: null,
  });

  useEffect(() => {
    const handleFetchUserInfo = async () => {
      try {
        const res = await fetchUserInfoService(auth.token, username);
        const data = res.data as userProfileTopBarInfo;
        setUserInfo({
          posts_count: data.posts_count,
          followings_count: data.followings_count,
          followers_count: data.followers_count,
          followed_by_user: data.followed_by_user,
          user: data.user,
        });
      } catch (e) {
        console.log(e);
      }
    };
    handleFetchUserInfo();
  }, [auth.token, username]);

  const handleFollowUser = async () => {
    try {
      await followUserService(auth.token, username);
      setUserInfo({
        ...userInfo,
        followed_by_user: true,
        followers_count: ++userInfo.followers_count,
      });
    } catch (e: any) {
      console.log(e);
    }
  };

  const handleUnFollowUser = async () => {
    try {
      await unFollowUserService(auth.token, username);
      setUserInfo({
        ...userInfo,
        followed_by_user: false,
        followers_count: --userInfo.followers_count,
      });
    } catch (e: any) {
      console.log(e);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6 md:px-12 mb-8">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
        {/* Photo de profil */}
        <div className="relative">
          <img
            className="w-24 h-24 md:w-40 md:h-40 rounded-full border-4 border-[#1877F2] object-cover shadow-lg"
            src={userInfo.user?.profile?.image}
            alt={userInfo.user?.username}
          />
        </div>

        {/* Infos utilisateur */}
        <div className="flex-1 w-full">
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <h2 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-200 font-semibold">
              {userInfo.user?.username}
            </h2>

            {/* Bouton Modifier profil */}
            {width > 767 && userInfo.user?.username === auth.user?.username && (
              <Link
                to="/"
                className="px-4 py-1.5 rounded-lg border border-[#1877F2] text-sm font-medium text-[#1877F2] hover:bg-[#E7F3FF] transition"
              >
                Modifier le profil
              </Link>
            )}

            {/* Icône paramètres */}
            {userInfo.user?.username === auth.user?.username && (
              <CogIcon className="w-7 h-7 text-gray-600 dark:text-gray-300 cursor-pointer" />
            )}

            {/* Suivre / Se désabonner */}
            {userInfo.user?.username !== auth.user?.username &&
              (userInfo.followed_by_user ? (
                <button
                  onClick={handleUnFollowUser}
                  className="px-4 py-1.5 rounded-lg border text-sm font-medium text-red-500 border-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition"
                >
                  Se désabonner
                </button>
              ) : (
                <button
                  onClick={handleFollowUser}
                  className="px-4 py-1.5 rounded-lg border text-sm font-medium text-[#1877F2] border-[#1877F2] hover:bg-[#E7F3FF] transition"
                >
                  Suivre
                </button>
              ))}
          </div>

          {/* Stats desktop */}
          {width > 767 && (
            <div className="flex gap-10 text-gray-700 dark:text-gray-300">
              <span>
                <b>{userInfo.posts_count}</b> publications
              </span>
              <Link to="" className="hover:underline">
                <b>{userInfo.followers_count}</b> abonnés
              </Link>
              <Link to="" className=" hover:underline">
                <b>{userInfo.followings_count}</b> abonnements
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Stats mobile */}
      {width < 767 && (
        <ul className="flex items-center justify-around border-t mt-6 pt-4 text-sm dark:border-gray-700">
          <li className="text-center">
            <b>{userInfo.posts_count}</b>
            <div className="text-gray-400">publications</div>
          </li>
          <li className="text-center">
            <b>{userInfo.followers_count}</b>
            <div className="text-[#1877F2]">abonnés</div>
          </li>
          <li className="text-center">
            <b>{userInfo.followings_count}</b>
            <div className="text-[#1877F2]">abonnements</div>
          </li>
        </ul>
      )}
    </div>
  );
};

export default TopbarInfo;
