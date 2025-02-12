import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api/admin', credentials: 'include' }),
  endpoints: (builder) => ({

    getAllUsers: builder.query({
      query: () => ({
        url: '/users', 
        method: 'GET',
      }),
    }),
    getAllcourts: builder.query({
      query: () => ({
        url: `/courts`,
        method: 'GET',
      }),
    }),
    getAllslost: builder.query({
      query: (courtId) => ({
        url: `/slots/${courtId}`,
        method: 'GET',
      }),
    }),
    getAlladdons: builder.query({
      query: () => ({
        url: `/addons`,
        method: 'GET',
      }),
    }),
    loginadmin: builder.mutation({
        query: (data) => ({
          url: '/login', 
          method: 'POST',
          body: data,
        }),
      query: (data) => ({
        url: '/login',
        method: 'POST',
        body: data,
      }),
    }),
    logoutadmin: builder.mutation({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
    }),
    manageusers: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: 'PATCH',
      }),
    }),
    manageslots: builder.mutation({
      query: (data) => ({
        url: `/slots`,
        method: 'POST',
        body: data
      }),
    }),
    addcourts: builder.mutation({
      query: (data) => ({
        url: `/courts`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data
      }),
    }),
    updatecourts: builder.mutation({
      query: ({ slotId,...data }) => ({
        url: `/edit-slots/${slotId}`,
        method: 'PUT',
        body: data
      }),
    }),
    addstaffs: builder.mutation({
      query: (data) => ({
        url: `/staffs`,
        method: 'POST',
        body: data
      }),
    }),
    addaddons: builder.mutation({
      query: (data) => ({
        url: `/addons`,
        method: 'POST',
        body: data
      }),
    }),
   
  }),
});   

export const {
  useGetAllUsersQuery,
  useLoginadminMutation,
  useManageusersMutation,
  useLogoutadminMutation,
  useManageslotsMutation,
  useAddcourtsMutation,
  useGetAllcourtsQuery,
  useGetAllslostQuery,
  useUpdatecourtsMutation,
  useAddstaffsMutation,
  useAddaddonsMutation,
  useGetAlladdonsQuery
 }
  = adminApi;

export default adminApi
