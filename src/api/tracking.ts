import { api } from ".";

// background fetch
export const fetchTrackings = async (params: {
  orderId: string;
  latitude: number;
  longitude: number;
  trackingTime: string;
}) => await api.post("track", { json: params });
