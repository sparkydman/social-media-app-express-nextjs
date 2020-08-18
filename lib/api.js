import axios from "axios";

export const getUser = async (userId) => {
  const { data } = await axios.get(`/api/users/profile/${userId}`);
  return data;
};

export const followUser = async (followId) => {
  const { data } = await axios.put("/api/users/follow", { followId });
  return data;
};

export const unFollowUser = async (followId) => {
  const { data } = await axios.put("/api/users/unfollow", { followId });
  return data;
};

export const deleteUser = async (userId) => {
  const { data } = await axios.delete(`/api/users/${userId}`);
  return data;
};

export const authUser = async (userId) => {
  const { data } = await axios.get(`/api/users/${userId}`);
  return data;
};

export const updateUser = async (userId, userData) => {
  const { data } = await axios.put(`/api/users/${userId}`, userData);
  return data;
};
