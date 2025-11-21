import api from "./client";
import { API } from "../constants/api";

export const loginApi = async (credentials, signal) => {
  const { data } = await api.post(API.AUTH.LOGIN, credentials, { signal });
  return data;
};

export const logoutApi = async (signal) => {
  const { data } = await api.post(API.AUTH.LOGOUT, {}, { signal });
  return data;
};

export const getMeApi = async (signal) => {
  const { data } = await api.get(API.AUTH.ME, { signal });
  return data;
};

export const updateProfileApi = async (payload, signal) => {
  const { data } = await api.put(API.AUTH.PROFILE, payload, { signal });
  return data;
};

export const uploadAvatarApi = async (file, signal) => {
  const formData = new FormData();
  formData.append("avatar", file);
  const { data } = await api.put(API.AUTH.AVATAR, formData, { signal });
  return data;
};
export const changePasswordApi = async (payload, signal) => {
  const { data } = await api.put(API.AUTH.CHANGE_PASSWORD, payload, { signal });
  return data;
};
