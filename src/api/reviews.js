import api from "./client";
import { API } from "../constants/api";

export const getReportedReviewsApi = async (params = {}, signal) => {
  const { data } = await api.get(API.ADMIN.REPORTED_REVIEWS, {
    params,
    signal,
  });
  return data;
};

export const updateReviewStatusApi = async (id, status, signal) => {
  const { data } = await api.put(
    API.ADMIN.REVIEW_STATUS(id),
    { status },
    { signal },
  );
  return data;
};

export const deleteReviewApi = async (id, signal) => {
  const { data } = await api.delete(API.ADMIN.REVIEW(id), { signal });
  return data;
};
