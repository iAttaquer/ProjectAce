"use client";

export const logout = (router) => {
  localStorage.removeItem('authToken');
  router.push('/');
};