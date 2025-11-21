import api from "./client";
import { API } from "../constants/api";

export const getDashboardStatsApi = async (signal) => {
  const { data } = await api.get(API.ADMIN.STATS, { signal });
  return data;
};

export const getDashboardRecentActivityApi = async (signal) => {
  const { data } = await api.get(API.ADMIN.RECENT, { signal });
  return data;
};

export const getDashboardAnalyticsApi = async (signal) => {
  const { data } = await api.get(API.ADMIN.ANALYTICS, { signal });
  return data;
};
