import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PhotographIcon,
  XIcon,
  EmojiHappyIcon,
  BadgeCheckIcon,
  LocationMarkerIcon,
  VideoCameraIcon,
} from "@heroicons/react/outline";
import TextareaAutosize from "react-textarea-autosize";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { hideAddPostModal } from "../redux/slice/addPost";
import { PostFormIntf } from "../interfaces/home/posts";
import { postCreateService } from "../services/post";
import Spin from "./features/animation/Spin";

interface FileIntf {
  src: string;
  type: string;
  name: string;
}

const AddPost: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const intitialFormState = useMemo(() => {
    return {
      files: [],
      description: "",
      location: "",
      tags: [],
      users_tag: [],
    };
  }, []);

  const [form, setForm] = useState<PostFormIntf>(intitialFormState);
  const [files, setFiles] = useState<FileIntf[]>([]);
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);

  const handleClosePostCreate = () => {
    dispatch(hideAddPostModal());
    done && navigate(0);
  };

  const handleFileOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    selectedFiles.forEach((file) => {
      const formShallow = { ...form };
      formShallow.files.push(file);
      setForm(formShallow);

      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        const filesShallow = [...files];
        filesShallow.push({
          src: e.target?.result as string,
          type: file.type,
          name: file.name,
        });
        setFiles(filesShallow);
      };
      fileReader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const handleFileType = useCallback((type: string, file: FileIntf) => {
    return file?.type.startsWith(type);
  }, []);

  const handleRemoveFile = (index: number) => {
    const formShallow = { ...form };
    formShallow.files.splice(index, 1);
    setForm(formShallow);
    const filesShallow = [...files];
    filesShallow.splice(index, 1);
    setFiles(filesShallow);
  };

  const handleShowPicker = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPicker(!showPicker);
  };

  const handleTextareaOnBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    const textareaKeywords = e.currentTarget.value.split(" ");
    const tags = textareaKeywords.filter((keyword) => keyword.startsWith("#"));
    const formTags: string[] = [];
    tags.forEach((tag) => {
      tag = tag.replace("#", "");
      if (tag !== "") {
        formTags.push(tag);
      }
    });
    setForm({ ...form, tags: formTags });
  };

  const handleEmojiSelect = (emoji: any) => {
    setForm({
      ...form,
      description: form.description + emoji.native,
    });
  };

  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLocationAdd = () => {
    const location = prompt("Où êtes-vous ?");
    if (location) {
      setForm({ ...form, location });
    }
  };

  const handleOnSubmit = async () => {
    if (!form.description.trim() && form.files.length === 0) return;

    setSubmitLoading(true);
    try {
      const formData = new FormData();

      form.files.forEach((file) => {
        formData.append("files", file);
      });
      form.tags.forEach((tag) => {
        formData.append("tags", tag);
      });
      form.users_tag.forEach((user_tag) => {
        formData.append("users_tag", user_tag);
      });
      formData.append("description", form.description);
      formData.append("location", form.location);
      await postCreateService(auth.token, formData);
      setDone(true);
    } catch (e: any) {
      console.log(e.response.data);
    } finally {
      setSubmitLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setShowPicker(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
      <div
        className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {done ? (
          <div className="transition-all duration-500 ease-in-out">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 flex-1 text-center">
                Publication partagée
              </h2>
              <button
                onClick={handleClosePostCreate}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <XIcon className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="p-8 flex flex-col items-center justify-center">
              <div className="animate-bounce mb-4">
                <BadgeCheckIcon
                  width={80}
                  height={80}
                  className="text-green-500"
                />
              </div>
              <p className="text-gray-600 font-medium text-center">
                Votre publication a été partagée avec succès!
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 flex-1 text-center">
                Créer une publication
              </h2>
              <button
                onClick={handleClosePostCreate}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <XIcon className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 max-h-[70vh] overflow-y-auto">
              {/* User Info */}
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={
                    auth.user?.profile?.image ||
                    "https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png"
                  }
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 flex-wrap text-sm text-gray-600">
                    <span className="font-semibold text-gray-800">
                      {auth.user?.username}
                    </span>
                    {form.location && <span>à {form.location}</span>}
                  </div>
                </div>
              </div>

              {/* Text Input */}
              <TextareaAutosize
                onBlur={handleTextareaOnBlur}
                onChange={handleOnChange}
                value={form.description}
                name="description"
                placeholder="Que voulez-vous dire ?"
                className="w-full border-none outline-none resize-none text-lg text-gray-800 placeholder-gray-500 min-h-[100px] mb-4"
                maxRows={6}
                minRows={3}
              />

              {/* Selected Files Display */}
              {files.length > 0 && (
                <div className="mb-4 grid gap-2 grid-cols-1 sm:grid-cols-2">
                  {files.map((file, i) => (
                    <div key={i} className="relative group">
                      {handleFileType("image", file) ? (
                        <img
                          src={file.src}
                          alt={file.name}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ) : handleFileType("video", file) ? (
                        <video
                          src={file.src}
                          className="w-full h-32 object-cover rounded-lg"
                          controls
                        />
                      ) : null}
                      <button
                        onClick={() => handleRemoveFile(i)}
                        className="absolute top-2 right-2 w-6 h-6 bg-gray-800 bg-opacity-70 hover:bg-opacity-90 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <XIcon className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="border border-gray-200 rounded-lg p-3 flex items-center space-x-3">
                <label className="cursor-pointer">
                  <div className="w-10 h-10 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center transition-colors">
                    <PhotographIcon className="w-5 h-5 text-green-600" />
                  </div>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleFileOnChange}
                    className="hidden"
                  />
                </label>

                <button
                  onClick={handleLocationAdd}
                  className="w-10 h-10 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors"
                  title="Ajouter un lieu"
                >
                  <LocationMarkerIcon className="w-5 h-5 text-red-600" />
                </button>

                <div className="relative">
                  <button
                    onClick={handleShowPicker}
                    className="w-10 h-10 bg-yellow-100 hover:bg-yellow-200 rounded-full flex items-center justify-center transition-colors"
                    title="Ajouter un emoji"
                  >
                    <EmojiHappyIcon className="w-5 h-5 text-yellow-600" />
                  </button>

                  {showPicker && (
                    <div className="absolute bottom-12 left-0 z-10 animate-fadeIn">
                      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
                      <Picker
                        data={data}
                        onEmojiSelect={handleEmojiSelect}
                        previewPosition="none"
                        theme="light"
                        style={{
                          boxShadow:
                            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                          borderRadius: "12px",
                          overflow: "hidden",
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={handleOnSubmit}
                disabled={
                  (!form.description.trim() && files.length === 0) ||
                  submitLoading
                }
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                  (!form.description.trim() && files.length === 0) ||
                  submitLoading
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-[1.02] active:scale-[0.98]"
                }`}
              >
                {submitLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Spin className="text-white" w="w-4" h="h-4" />
                    <span>Publication...</span>
                  </div>
                ) : (
                  "Publier"
                )}
              </button>
            </div>
          </>
        )}
      </div>

      {/* <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style> */}
    </div>
  );
};

export default AddPost;
