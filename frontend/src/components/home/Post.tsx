import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DotsHorizontalIcon,
  HeartIcon,
  ChatIcon,
  PaperAirplaneIcon,
  BookmarkIcon,
  EmojiHappyIcon,
} from "@heroicons/react/outline";
import {
  HeartIcon as HeartIconSolid,
  BookmarkIcon as BookmarkIconSolid,
} from "@heroicons/react/solid";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination } from "swiper";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import TextareaAutosize from "react-textarea-autosize";
import { PostIntf, PostFieldIntf } from "../../interfaces/home/posts";
import routes from "../../routes";
import { useAppSelector } from "../../redux/store";
import {
  addLikeService,
  addPostToSaved,
  deleteLikeService,
  deletePostFromSaved,
  postCommentService,
} from "../../services/post";
import {
  limitText,
  getPostDescription,
  getCommentText,
} from "../../utils/utility";
import {
  Send,
  Heart,
  MessageCircle,
  Send as ShareIcon,
  Bookmark,
  MoreHorizontal,
  Smile,
} from "lucide-react";

SwiperCore.use([Navigation, Pagination]);

interface PropsIntf {
  posts: PostIntf;
  setPosts: React.Dispatch<React.SetStateAction<PostIntf>>;
  isDark?: boolean;
}

interface CommentIntf {
  [id: number]: string;
}

interface ShowPickerIntf {
  [id: number]: boolean;
}

const Post: React.FC<PropsIntf> = ({ posts, setPosts, isDark = false }) => {
  const navigate = useNavigate();
  const auth = useAppSelector((state) => state.auth);
  const [comment, setComment] = useState<CommentIntf>({});
  const [showPicker, setShowPicker] = useState<ShowPickerIntf>({});

  useEffect(() => {
    const handleClickOutside = () => {
      setShowPicker(() => ({}));
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleHeartIcon = (post: PostFieldIntf, i: number) => {
    const userLike = post.likes.filter(
      (like) => like.user.id === auth.user!.id
    );
    return userLike.length > 0 ? (
      <button
        className="group relative p-2 rounded-full transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20"
        onClick={() => handlePostRemoveLike(post.id, i)}
      >
        <Heart className="w-6 h-6 text-red-500 fill-red-500 group-hover:scale-110 transition-transform" />
      </button>
    ) : (
      <button
        className="group relative p-2 rounded-full transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        onClick={() => handlePostAddLike(post.id, i)}
      >
        <Heart className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-red-500 group-hover:scale-110 transition-all" />
      </button>
    );
  };

  const handleLikeSection = (post: PostFieldIntf) => {
    const likes = post.likes.filter((like) => like.user.id !== auth.user!.id);
    if (likes.length > 0) {
      const latestUserLiked = likes[0];
      return (
        <div className="font-medium flex items-center">
          <Link to={routes.likedBy(post.id)} className="mr-2">
            <img
              className="w-5 h-5 rounded-full ring-2 ring-white dark:ring-gray-800"
              src={latestUserLiked.user.profile.image}
              alt={latestUserLiked.user.username}
            />
          </Link>
          <div className="text-sm">
            <span className="text-gray-600 dark:text-gray-400 font-normal">
              Aimé par{" "}
            </span>
            <Link
              className="text-gray-900 dark:text-white hover:underline font-semibold"
              to={routes.userProfile(latestUserLiked.user.username)}
            >
              {latestUserLiked.user.username}
            </Link>
            {post.likes_count - 1 > 0 && (
              <>
                <span className="text-gray-600 dark:text-gray-400 font-normal">
                  {" "}
                  et{" "}
                </span>
                <Link
                  className="text-gray-900 dark:text-white hover:underline font-semibold"
                  to={routes.likedBy(post.id)}
                >
                  {post.likes_count - 1} autre
                  {post.likes_count - 1 > 1 ? "s" : ""}
                </Link>
              </>
            )}
          </div>
        </div>
      );
    } else {
      return (
        <Link
          to={routes.likedBy(post.id)}
          className="font-semibold text-gray-900 dark:text-white hover:opacity-80 transition-opacity"
        >
          {post.likes_count} j'aime{post.likes_count > 1 ? "s" : ""}
        </Link>
      );
    }
  };

  const handleCommentSection = (post: PostFieldIntf) => {
    const comments = post.comments.slice(0, 3);
    return comments.map((comment) => (
      <div key={comment.id} className="mb-1">
        <Link
          to={routes.userProfile(comment.user.username)}
          className="hover:underline font-semibold text-gray-900 dark:text-white mr-2"
        >
          {comment.user.username}
        </Link>
        <span className="text-gray-700 dark:text-gray-300">
          {getCommentText(limitText(comment.text, 150))}
        </span>
      </div>
    ));
  };

  const handleEmojiSelect = (emoji: any, postID: number) => {
    setComment((prevValues: CommentIntf) => ({
      ...prevValues,
      [postID]: prevValues[postID]
        ? prevValues[postID] + emoji.native
        : emoji.native,
    }));
  };

  const handleShowEmojiPicker = (postID: number) => {
    setShowPicker((prevValues: ShowPickerIntf) => ({
      ...prevValues,
      [postID]: !prevValues[postID],
    }));
  };

  const handlePostAddLike = async (id: number, i: number) => {
    if (
      posts.data[i].likes.filter((like) => like.user.id === auth.user!.id)
        .length !== 1
    ) {
      try {
        const res = await addLikeService(auth.token, id);
        const newLike = res.data.like;
        const postsShallow = { ...posts };
        postsShallow.data[i].likes_count++;
        postsShallow.data[i].likes.push(newLike);
        setPosts(postsShallow);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handlePostRemoveLike = (id: number, i: number) => {
    try {
      deleteLikeService(auth.token, id);
      const postsShallow = { ...posts };
      postsShallow.data[i].likes_count--;
      postsShallow.data[i].likes = postsShallow.data[i].likes.filter(
        (like) => like.user.id !== auth.user!.id
      );
      setPosts(postsShallow);
    } catch (e) {
      console.log(e);
    }
  };

  const handleCommentText = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    postID: number
  ) => {
    setComment({ ...comment, [postID]: e.target.value });
  };

  const handlePostSavedSection = (post: PostFieldIntf, i: number) => {
    const saved = post.saved;
    return saved.length > 0 ? (
      <button
        className="group p-2 rounded-full transition-all duration-200 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
        onClick={() => handleRemovePostFromSaved(post.id, i)}
      >
        <Bookmark className="w-6 h-6 text-yellow-600 fill-yellow-600 group-hover:scale-110 transition-transform" />
      </button>
    ) : (
      <button
        className="group p-2 rounded-full transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        onClick={() => handleAddPostToSaved(post.id, i)}
      >
        <Bookmark className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-yellow-600 group-hover:scale-110 transition-all" />
      </button>
    );
  };

  const handleAddPostToSaved = async (id: number, i: number) => {
    if (posts.data[i].saved.length !== 1) {
      try {
        const res = await addPostToSaved(auth.token, id);
        const newSaved = res.data.saved;
        const postsShallow = { ...posts };
        postsShallow.data[i].saved.push(newSaved);
        setPosts(postsShallow);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleRemovePostFromSaved = (id: number, i: number) => {
    try {
      deletePostFromSaved(auth.token, id);
      const postsShallow = { ...posts };
      postsShallow.data[i].saved = [];
      setPosts(postsShallow);
    } catch (e) {
      console.log(e);
    }
  };

  const handlePostComment = async (postID: number, i: number) => {
    try {
      const res = await postCommentService(auth.token, postID, comment[postID]);
      const newComment = res.data.comment;
      const postsShollow = { ...posts };
      postsShollow.data[i].comments.unshift(newComment);
      postsShollow.data[i].comments_count++;
      setPosts(postsShollow);
      setComment({ ...comment, [postID]: "" });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="space-y-6">
      {posts.data.length > 0 &&
        posts.data.map((post, i) => (
          <article
            key={post.id}
            className={`
              rounded-xl border shadow-sm overflow-hidden transition-all duration-200
              ${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }
            `}
          >
            {/* En-tête du post */}
            <header className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  {post.user.storys?.length > 0 ? (
                    <div className="p-[2px] bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-full">
                      <img
                        className="w-10 h-10 object-cover rounded-full border-2 border-white dark:border-gray-800 cursor-pointer"
                        src={post.user.profile.image}
                        alt={post.user.username}
                      />
                    </div>
                  ) : (
                    <Link to={routes.postDetail(post.id)}>
                      <img
                        className="w-10 h-10 object-cover rounded-full hover:opacity-80 transition-opacity"
                        src={post.user.profile.image}
                        alt={post.user.username}
                      />
                    </Link>
                  )}
                </div>
                <div>
                  <h2>
                    <Link
                      to={`/${post.user.username}`}
                      className="font-semibold text-gray-900 dark:text-white hover:underline"
                    >
                      {post.user.username}
                    </Link>
                  </h2>
                  {post.location && (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {post.location}
                    </p>
                  )}
                </div>
              </div>
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <MoreHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </header>

            {/* Image(s) du post */}
            <div className="h-full w-full mb-4 post">
              <Swiper
                onDoubleClick={() => handlePostAddLike(post.id, i)}
                loop={false}
                navigation={true}
                pagination={true}
                className="mySwiper"
              >
                {post.files.map((file) => (
                  <SwiperSlide key={file.id} className="relative pb-full">
                    <img
                      className="w-full h-full object-cover absolute left-0 top-0"
                      src={file.file}
                      alt={post.user.username}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Actions et contenu */}
            <div className="p-4 space-y-3">
              {/* Boutons d'action */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  {handleHeartIcon(post, i)}
                  <button
                    className="group p-2 rounded-full transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => navigate(routes.postDetail(post.id))}
                  >
                    <MessageCircle className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:scale-110 transition-transform" />
                  </button>
                  <button className="group p-2 rounded-full transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <ShareIcon className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:scale-110 transition-transform rotate-45" />
                  </button>
                </div>
                {handlePostSavedSection(post, i)}
              </div>

              {/* Informations sur les likes */}
              <div>{handleLikeSection(post)}</div>

              {/* Description du post */}
              <div>
                <Link
                  to={routes.userProfile(post.user.username)}
                  className="font-semibold text-gray-900 dark:text-white hover:underline mr-2"
                >
                  {post.user.username}
                </Link>
                <span className="text-gray-700 dark:text-gray-300">
                  {getPostDescription(post.description)}
                </span>
              </div>

              {/* Lien vers tous les commentaires */}
              {post.comments_count > 0 && (
                <div>
                  <Link
                    to={routes.postDetail(post.id)}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm transition-colors"
                  >
                    Voir les {post.comments_count} commentaire
                    {post.comments_count > 1 ? "s" : ""}
                  </Link>
                </div>
              )}

              {/* Aperçu des commentaires */}
              <div className="space-y-1">{handleCommentSection(post)}</div>

              {/* Horodatage */}
              <div>
                <Link
                  to={routes.postDetail(post.id)}
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 text-xs transition-colors"
                >
                  il y a {post.created_time}
                </Link>
              </div>
            </div>

            {/* Section de commentaire */}
            <div
              className={`
              border-t p-4
              ${isDark ? "border-gray-700" : "border-gray-200"}
            `}
            >
              <div className="flex items-center space-x-3">
                <div
                  className="relative"
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                >
                  <button
                    onClick={() => handleShowEmojiPicker(post.id)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Smile className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  </button>
                  {showPicker[post.id] && (
                    <div className="absolute bottom-12 left-0 z-50">
                      <Picker
                        data={data}
                        onEmojiSelect={(emoji: any) =>
                          handleEmojiSelect(emoji, post.id)
                        }
                        theme={isDark ? "dark" : "light"}
                        previewPosition="none"
                      />
                    </div>
                  )}
                </div>

                <TextareaAutosize
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    handleCommentText(e, post.id)
                  }
                  maxRows={4}
                  placeholder="Ajouter un commentaire..."
                  className={`
                    flex-1 resize-none border-none outline-none text-sm
                    ${
                      isDark
                        ? "bg-gray-800 text-white placeholder-gray-400"
                        : "bg-white text-gray-900 placeholder-gray-500"
                    }
                  `}
                  value={comment[post.id] || ""}
                />

                <button
                  onClick={() => handlePostComment(post.id, i)}
                  disabled={!comment[post.id]?.trim()}
                  className={`
                    p-2 rounded-full transition-all duration-200 transform
                    ${
                      comment[post.id]?.trim()
                        ? `bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400`
                        : `bg-blue-100 dark:bg-blue-900/30 text-blue-300 dark:text-blue-600 cursor-not-allowed`
                    }
                  `}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </article>
        ))}
    </div>
  );
};

export default Post;
