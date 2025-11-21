import api from "./client";
import { API } from "../constants/api";

export const getUsersApi = async (params = {}, signal) => {
  const { data } = await api.get(API.ADMIN.USERS, { params, signal });
  return data;
};

export const getUserDetailsApi = async (id, signal) => {
  const { data } = await api.get(`${API.ADMIN.USERS}/${id}`, { signal });
  return data;
};

export const updateUserStatusApi = async (id, isActive, signal) => {
  const { data } = await api.put(
    API.ADMIN.USER_STATUS(id),
    { isActive },
    { signal },
  );
  return data;
};
