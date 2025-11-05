import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useCallback, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Post from "./Post";
import { useAppSelector } from "../../redux/store";
import { PostIntf } from "../../interfaces/home/posts";
import { fetchPostsService } from "../../services/post";
import CreatePost from "./CreatePost";
import StoryContainer from "./StoryContainer";

const Home = () => {
  const auth = useAppSelector((state) => state.auth);
  const [posts, setPosts] = useState<PostIntf>({ loading: true, data: [] });

  const fetchPosts = useCallback(async () => {
    try {
      if (!auth.token) return;
      const res = await fetchPostsService(auth.token);
      setPosts({
        loading: false,
        data: Array.isArray(res.data) ? res.data : [],
      });
    } catch (e) {
      console.log(e);
      setPosts({ loading: false, data: [] });
    }
  }, [auth.token]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="flex flex-nowrap flex-row">
      <div className="w-full md:w-2/3 h-full mr-3">
        <CreatePost />
        <StoryContainer />
        <Post posts={posts} setPosts={setPosts} />
      </div>
      <div className="w-full md:w-1/3 h-full">
        <Sidebar />
      </div>
    </div>
  );
};

export default Home;
