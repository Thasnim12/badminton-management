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
    loginadmin: builder.mutation({
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
  }),
});

export const { useGetAllUsersQuery, useLoginadminMutation, useManageusersMutation, useLogoutadminMutation } = adminApi;

export default adminApi;
