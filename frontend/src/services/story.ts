// import requests from "../utils/requests";
// import { authAxios } from "../utils/axios";

// export const fetchStorysService = async (token: string | null) => {
//   const res = await authAxios(token).get(requests.getStorys);
//   return res;
// };

import { authAxios } from "../utils/axios";
import requests from "../utils/requests";
import { UserFieldIntf } from "../interfaces/home/story";

// export const fetchStorysService = async (
//   token: string | null
// ): Promise<UserFieldIntf[]> => {
//   if (!token) throw new Error("Token manquant");

//   const res = await authAxios(token).get(requests.getStorys);
//   return res.data; // retourne un tableau UserFieldIntf[]
// };

// import { authAxios } from "../utils/axios";

export const fetchStorysService = async (token: string | null) => {
  if (!token) throw new Error("Token manquant");

  const res = await authAxios(token).get("http://localhost:8000/story/all/"); // ← backend correct
  return res.data;
};

export const uploadStoryService = async (token: string | null, file: File) => {
  if (!token) throw new Error("Token manquant");

  const formData = new FormData();
  formData.append("file", file);

  const res = await authAxios(token).post(
    "http://localhost:8000/story/upload/",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return res.data;
};
