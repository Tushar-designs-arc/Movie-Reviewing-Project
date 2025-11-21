import api from "./client";
import { API } from "../constants/api";

export const getReportsApi = async (params = {}, signal) => {
  const { data } = await api.get(API.ADMIN.REPORTED_REVIEWS, {
    params,
    signal,
  });
  return data;
};
