import api from "./client";
import { API } from "../constants/api";

export const getMoviesApi = async (params = {}, signal) => {
  const { data } = await api.get(API.MOVIES.ADMIN_LIST, { params, signal });
  return data;
};

export const getMovieBySlugApi = async (slug, signal) => {
  const { data } = await api.get(API.MOVIES.DETAILS(slug), { signal });
  return data;
};

export const getMovieByIdApi = async (id, signal) => {
  const { data } = await api.get(API.MOVIES.ADMIN_DETAILS(id), { signal });
  return data;
};

export const createMovieApi = async (formData, onUploadProgress, signal) => {
  const { data } = await api.post(API.MOVIES.LIST, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress,
    signal,
  });
  return data;
};

export const updateMovieApi = async (
  id,
  formData,
  onUploadProgress,
  signal,
) => {
  const { data } = await api.put(`${API.MOVIES.LIST}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress,
    signal,
  });
  return data;
};

export const deleteMovieApi = async (id, signal) => {
  const { data } = await api.delete(`${API.MOVIES.LIST}/${id}`, { signal });
  return data;
};
