// import { useState, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   X,
//   Image,
//   Video,
//   Smile,
//   MapPin,
//   Tag,
//   MoreHorizontal,
//   Globe,
//   Users,
//   Lock,
// } from "lucide-react";

// // Type pour la publication
// interface PostData {
//   text: string;
//   images: File[];
//   videos: File[];
//   privacy: string;
//   feeling: string;
//   location: string;
//   timestamp: Date;
// }

// // Composant de zone de création (comme sur Facebook)
// const PostCreationZone: React.FC<{ onOpenModal: () => void }> = ({
//   onOpenModal,
// }) => {
//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
//       <div className="flex items-center space-x-3 mb-3">
//         <img
//           src="https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png"
//           alt="Profile"
//           className="w-10 h-10 rounded-full object-cover"
//         />
//         <button
//           onClick={onOpenModal}
//           className="flex-1 bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2 text-left text-gray-500 transition-colors"
//         >
//           Quoi de neuf, Natha ?
//         </button>
//       </div>

//       <hr className="border-gray-200 my-3" />

//       <div className="flex items-center justify-between">
//         <button
//           onClick={onOpenModal}
//           className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex-1 justify-center"
//         >
//           <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
//             <Video className="w-4 h-4 text-red-600" />
//           </div>
//           <span className="text-gray-600 font-medium">Vidéo en direct</span>
//         </button>

//         <button
//           onClick={onOpenModal}
//           className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex-1 justify-center"
//         >
//           <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
//             <Image className="w-4 h-4 text-green-600" />
//           </div>
//           <span className="text-gray-600 font-medium">Photo/Vidéo</span>
//         </button>

//         <button
//           onClick={onOpenModal}
//           className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex-1 justify-center"
//         >
//           <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
//             <Smile className="w-4 h-4 text-yellow-600" />
//           </div>
//           <span className="text-gray-600 font-medium">Humeur/Activité</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// // Modal de création de post
// const CreatePostModal: React.FC<{
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit?: (postData: PostData) => void;
// }> = ({ isOpen, onClose, onSubmit }) => {
//   const [postText, setPostText] = useState("");
//   const [selectedImages, setSelectedImages] = useState<File[]>([]);
//   const [selectedVideos, setSelectedVideos] = useState<File[]>([]);
//   const [privacy, setPrivacy] = useState("public");
//   const [feeling, setFeeling] = useState("");
//   const [location, setLocation] = useState("");
//   const [showPrivacyMenu, setShowPrivacyMenu] = useState(false);
//   const [showFeelingMenu, setShowFeelingMenu] = useState(false);
//   const [isPosting, setIsPosting] = useState(false);

//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const videoInputRef = useRef<HTMLInputElement>(null);

//   const privacyOptions = [
//     {
//       value: "public",
//       icon: Globe,
//       label: "Public",
//       description: "Tout le monde peut voir cette publication",
//     },
//     {
//       value: "friends",
//       icon: Users,
//       label: "Amis",
//       description: "Vos amis sur Facegram",
//     },
//     {
//       value: "private",
//       icon: Lock,
//       label: "Moi uniquement",
//       description: "Vous seul pouvez voir cette publication",
//     },
//   ];

//   const feelings = [
//     "😊 heureux",
//     "😍 amoureux",
//     "😎 cool",
//     "🤔 pensif",
//     "😴 fatigué",
//     "🎉 excité",
//     "😔 triste",
//     "😤 énervé",
//     "🤗 reconnaissant",
//     "😋 affamé",
//   ];

//   const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || []);
//     setSelectedImages((prev) => [...prev, ...files]);
//   };

//   const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || []);
//     setSelectedVideos((prev) => [...prev, ...files]);
//   };

//   const removeImage = (index: number) =>
//     setSelectedImages((prev) => prev.filter((_, i) => i !== index));
//   const removeVideo = (index: number) =>
//     setSelectedVideos((prev) => prev.filter((_, i) => i !== index));

//   const handleSubmit = async () => {
//     if (
//       !postText.trim() &&
//       selectedImages.length === 0 &&
//       selectedVideos.length === 0
//     )
//       return;

//     setIsPosting(true);

//     setTimeout(() => {
//       const postData: PostData = {
//         text: postText,
//         images: selectedImages,
//         videos: selectedVideos,
//         privacy,
//         feeling,
//         location,
//         timestamp: new Date(),
//       };

//       onSubmit?.(postData);

//       // Reset
//       setPostText("");
//       setSelectedImages([]);
//       setSelectedVideos([]);
//       setFeeling("");
//       setLocation("");
//       setPrivacy("public");
//       setIsPosting(false);
//       onClose();
//     }, 2000);
//   };

//   const getPrivacyIcon = () => {
//     const option = privacyOptions.find((opt) => opt.value === privacy);
//     return option ? option.icon : Globe;
//   };

//   if (!isOpen) return null;

//   return (
//     <div
//       className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
//       onClick={onClose}
//     >
//       <motion.div
//         initial={{ scale: 0.9, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         exit={{ scale: 0.9, opacity: 0 }}
//         onClick={(e) => e.stopPropagation()}
//         className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden"
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between p-4 border-b border-gray-200">
//           <h2 className="text-xl font-bold text-gray-800 text-center flex-1">
//             Créer une publication
//           </h2>
//           <button
//             onClick={onClose}
//             className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
//           >
//             <X className="w-5 h-5 text-gray-600" />
//           </button>
//         </div>

//         {/* Content */}
//         <div className="p-4 max-h-[70vh] overflow-y-auto">
//           {/* User Info */}
//           <div className="flex items-center space-x-3 mb-4">
//             <img
//               src="https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png"
//               alt="Profile"
//               className="w-10 h-10 rounded-full object-cover"
//             />
//             <div className="flex-1">
//               <div className="flex items-center space-x-2 flex-wrap text-sm text-gray-600">
//                 <span className="font-semibold text-gray-800">Natha</span>
//                 {feeling && <span>se sent {feeling}</span>}
//                 {location && <span>à {location}</span>}
//               </div>

//               {/* Privacy */}
//               <div className="relative mt-1">
//                 <button
//                   onClick={() => setShowPrivacyMenu(!showPrivacyMenu)}
//                   className="flex items-center space-x-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium text-gray-600 transition-colors"
//                 >
//                   {(() => {
//                     const PrivacyIcon = getPrivacyIcon();
//                     return <PrivacyIcon className="w-3 h-3" />;
//                   })()}
//                   <span className="capitalize">
//                     {privacyOptions.find((opt) => opt.value === privacy)?.label}
//                   </span>
//                 </button>

//                 <AnimatePresence>
//                   {showPrivacyMenu && (
//                     <motion.div
//                       initial={{ opacity: 0, y: -10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -10 }}
//                       className="absolute top-8 left-0 bg-white shadow-lg rounded-lg border border-gray-200 w-64 z-10"
//                     >
//                       {privacyOptions.map((option) => {
//                         const Icon = option.icon;
//                         return (
//                           <button
//                             key={option.value}
//                             onClick={() => {
//                               setPrivacy(option.value);
//                               setShowPrivacyMenu(false);
//                             }}
//                             className={`flex items-center space-x-3 w-full p-3 text-left hover:bg-gray-50 transition-colors ${
//                               privacy === option.value ? "bg-blue-50" : ""
//                             }`}
//                           >
//                             <Icon
//                               className={`w-5 h-5 ${
//                                 privacy === option.value
//                                   ? "text-blue-600"
//                                   : "text-gray-600"
//                               }`}
//                             />
//                             <div>
//                               <div
//                                 className={`font-medium ${
//                                   privacy === option.value
//                                     ? "text-blue-600"
//                                     : "text-gray-800"
//                                 }`}
//                               >
//                                 {option.label}
//                               </div>
//                               <div className="text-xs text-gray-500">
//                                 {option.description}
//                               </div>
//                             </div>
//                           </button>
//                         );
//                       })}
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>
//             </div>
//           </div>

//           {/* Textarea */}
//           <textarea
//             value={postText}
//             onChange={(e) => setPostText(e.target.value)}
//             placeholder="Que voulez-vous dire ?"
//             className="w-full border-none outline-none resize-none text-lg text-gray-800 placeholder-gray-500 min-h-[100px] mb-4"
//             style={{ fontFamily: "inherit" }}
//           />

//           {/* Selected Media */}
//           {selectedImages.length > 0 && (
//             <div className="mb-4 grid gap-2 grid-cols-1 sm:grid-cols-2">
//               {selectedImages.map((img, i) => (
//                 <div key={i} className="relative group">
//                   <img
//                     src={URL.createObjectURL(img)}
//                     alt={`Selected ${i}`}
//                     className="w-full h-32 object-cover rounded-lg"
//                   />
//                   <button
//                     onClick={() => removeImage(i)}
//                     className="absolute top-2 right-2 w-6 h-6 bg-gray-800 bg-opacity-70 hover:bg-opacity-90 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
//                   >
//                     <X className="w-3 h-3" />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}

//           {selectedVideos.length > 0 && (
//             <div className="mb-4 grid gap-2 grid-cols-1">
//               {selectedVideos.map((vid, i) => (
//                 <div key={i} className="relative group">
//                   <video
//                     src={URL.createObjectURL(vid)}
//                     className="w-full h-32 object-cover rounded-lg"
//                     controls
//                   />
//                   <button
//                     onClick={() => removeVideo(i)}
//                     className="absolute top-2 right-2 w-6 h-6 bg-gray-800 bg-opacity-70 hover:bg-opacity-90 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
//                   >
//                     <X className="w-3 h-3" />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Add to post section */}
//           <div className="border border-gray-200 rounded-lg p-3">
//             <div className="flex items-center justify-between mb-2">
//               <span className="font-medium text-gray-700">
//                 Ajouter à votre publication
//               </span>
//             </div>
//             <div className="flex items-center space-x-3">
//               <button
//                 onClick={() => fileInputRef.current?.click()}
//                 className="w-10 h-10 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center transition-colors"
//                 title="Photo/vidéo"
//               >
//                 <Image className="w-5 h-5 text-green-600" />
//               </button>
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 accept="image/*"
//                 multiple
//                 onChange={handleImageSelect}
//                 className="hidden"
//               />

//               <button
//                 onClick={() => videoInputRef.current?.click()}
//                 className="w-10 h-10 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors"
//                 title="Vidéo"
//               >
//                 <Video className="w-5 h-5 text-red-600" />
//               </button>
//               <input
//                 ref={videoInputRef}
//                 type="file"
//                 accept="video/*"
//                 multiple
//                 onChange={handleVideoSelect}
//                 className="hidden"
//               />

//               <div className="relative">
//                 <button
//                   onClick={() => setShowFeelingMenu(!showFeelingMenu)}
//                   className="w-10 h-10 bg-yellow-100 hover:bg-yellow-200 rounded-full flex items-center justify-center transition-colors"
//                   title="Humeur/activité"
//                 >
//                   <Smile className="w-5 h-5 text-yellow-600" />
//                 </button>

//                 <AnimatePresence>
//                   {showFeelingMenu && (
//                     <motion.div
//                       initial={{ opacity: 0, y: -10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -10 }}
//                       className="absolute bottom-12 left-0 bg-white shadow-lg rounded-lg border border-gray-200 w-48 max-h-32 overflow-y-auto z-10"
//                     >
//                       {feelings.map((f) => (
//                         <button
//                           key={f}
//                           onClick={() => {
//                             setFeeling(f);
//                             setShowFeelingMenu(false);
//                           }}
//                           className="block w-full px-3 py-2 text-left hover:bg-gray-50 text-sm"
//                         >
//                           {f}
//                         </button>
//                       ))}
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>

//               <button
//                 onClick={() => {
//                   const loc = prompt("Où êtes-vous ?");
//                   if (loc) setLocation(loc);
//                 }}
//                 className="w-10 h-10 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors"
//                 title="Lieu"
//               >
//                 <MapPin className="w-5 h-5 text-red-600" />
//               </button>

//               <button
//                 className="w-10 h-10 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center transition-colors"
//                 title="Identifier des personnes"
//               >
//                 <Tag className="w-5 h-5 text-blue-600" />
//               </button>

//               <button
//                 className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
//                 title="Plus d'options"
//               >
//                 <MoreHorizontal className="w-5 h-5 text-gray-600" />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="p-4 border-t border-gray-200">
//           <button
//             onClick={handleSubmit}
//             disabled={
//               (!postText.trim() &&
//                 selectedImages.length === 0 &&
//                 selectedVideos.length === 0) ||
//               isPosting
//             }
//             className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
//               (!postText.trim() &&
//                 selectedImages.length === 0 &&
//                 selectedVideos.length === 0) ||
//               isPosting
//                 ? "bg-gray-200 text-gray-400 cursor-not-allowed"
//                 : "bg-blue-600 hover:bg-blue-700 text-white"
//             }`}
//           >
//             {isPosting ? (
//               <div className="flex items-center justify-center space-x-2">
//                 <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
//                 <span>Publication...</span>
//               </div>
//             ) : (
//               "Publier"
//             )}
//           </button>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// // Composant principal
// const CreatePost = () => {
//   const [showCreatePost, setShowCreatePost] = useState(false);

//   const handlePostSubmit = (postData: PostData) => {
//     console.log("Nouvelle publication:", postData);
//     alert("Publication créée avec succès !");
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-4">
//       <div className="max-w-2xl mx-auto">
//         <PostCreationZone onOpenModal={() => setShowCreatePost(true)} />

//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <p className="text-gray-600 text-center">
//             Vos publications apparaîtront ici...
//           </p>
//         </div>
//       </div>

//       <CreatePostModal
//         isOpen={showCreatePost}
//         onClose={() => setShowCreatePost(false)}
//         onSubmit={handlePostSubmit}
//       />
//     </div>
//   );
// };

// export default CreatePost;

import { Video, Image, Smile } from "lucide-react";
import { showAddPostModal } from "../../redux/slice/addPost";
import { useAppDispatch, useAppSelector } from "../../redux/store";

const CreatePost: React.FC = () => {
  const dispatch = useAppDispatch();

  return (
    <div
      onClick={() => dispatch(showAddPostModal())}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6"
    >
      <div className="flex items-center space-x-3 mb-3">
        <img
          src="https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png"
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-left text-gray-500 cursor-text">
          Quoi de neuf?
        </div>
      </div>
      <hr className="border-gray-200 my-3" />
      <div className="flex items-center justify-between">
        <button
          onClick={() => console.log("Vidéo en direct")}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex-1 justify-center"
        >
          <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
            <Video className="w-4 h-4 text-red-600" />
          </div>
          <span className="text-gray-600 font-medium">Vidéo en direct</span>
        </button>

        <button
          onClick={() => console.log("Photo/Vidéo")}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex-1 justify-center"
        >
          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
            <Image className="w-4 h-4 text-green-600" />
          </div>
          <span className="text-gray-600 font-medium">Photo/Vidéo</span>
        </button>

        <button
          onClick={() => console.log("Humeur/Activité")}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex-1 justify-center"
        >
          <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
            <Smile className="w-4 h-4 text-yellow-600" />
          </div>
          <span className="text-gray-600 font-medium">Humeur/Activité</span>
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
