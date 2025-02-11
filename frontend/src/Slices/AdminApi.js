import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api/admin' }), 
  endpoints: (builder) => ({

    getAllUsers: builder.query({
      query: (data) => ({
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

   
    
  }),
});

export const { useGetAllUsersQuery, useLoginadminMutation } = adminApi;

export default adminApi;
