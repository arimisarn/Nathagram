// import React, { useEffect, useState, ChangeEvent } from "react";
// import { useAppSelector } from "../../redux/store";
// import { fetchStorysService, uploadStoryService } from "../../services/story";
// import { StoryIntf, UserFieldIntf } from "../../interfaces/home/story";
// import StoryBar from "./StoryBar";

// const StoryContainer: React.FC = () => {
//   const auth = useAppSelector((state) => state.auth);
//   const [storys, setStorys] = useState<StoryIntf>({
//     loading: true,
//     data: [],
//   });
//   const [uploading, setUploading] = useState(false);
//   const [preview, setPreview] = useState<string | null>(null);
//   const [previewType, setPreviewType] = useState<"image" | "video">("image");

//   // Fetch stories
//   const getStorys = async () => {
//     if (!auth.token) return;
//     try {
//       const data: UserFieldIntf[] = await fetchStorysService(auth.token);
//       console.log("Stories fetched:", data); // 🔹 Ajoute ça
//       setStorys({ loading: false, data });
//     } catch (err) {
//       console.error(err);
//       setStorys({ loading: false, data: [] });
//     }
//   };

//   useEffect(() => {
//     getStorys();
//   }, [auth.token]);

//   // Handle file selection
//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setPreview(URL.createObjectURL(file));
//     setPreviewType(file.type.startsWith("video") ? "video" : "image");
//   };

//   // Handle upload
//   const handleUpload = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const fileInput = document.getElementById("story-file") as HTMLInputElement;
//     if (!fileInput?.files?.[0]) return;

//     const file = fileInput.files[0];
//     setUploading(true);

//     try {
//       await uploadStoryService(auth.token, file);
//       setPreview(null);
//       fileInput.value = "";
//       await getStorys(); // rafraîchit la liste
//     } catch (err) {
//       console.error("Upload failed:", err);
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="mb-6">
//       {/* Upload form */}
//       <form onSubmit={handleUpload} className="flex items-center mb-3">
//         <input
//           type="file"
//           id="story-file"
//           accept="image/*,video/*"
//           onChange={handleFileChange}
//           className="mr-2"
//         />
//         <button
//           type="submit"
//           disabled={uploading || !preview}
//           className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
//         >
//           {uploading ? "Uploading..." : "Upload"}
//         </button>
//       </form>

//       {/* Preview */}
//       {preview && (
//         <div className="mb-3">
//           {previewType === "video" ? (
//             <video src={preview} className="w-32 h-32 object-cover" controls />
//           ) : (
//             <img
//               src={preview}
//               alt="Preview"
//               className="w-32 h-32 object-cover"
//             />
//           )}
//         </div>
//       )}

//       {/* Story Bar */}
//       <StoryBar storys={storys} />
//     </div>
//   );
// };

// export default StoryContainer;
import React from 'react'

const StoryContainer = () => {
  return (
    <div>
      
    </div>
  )
}

export default StoryContainer
