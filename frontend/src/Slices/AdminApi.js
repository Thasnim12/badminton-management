import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api/admin' }), 
  endpoints: (builder) => ({

    getAllUsers: builder.query({
      query: () => ({
        url: '/users', 
        method: 'GET',
      }),
    }),
    loginadmin: builder.mutation({
        query: (loginData) => ({
          url: '/login', 
          method: 'POST',
          body: loginData,
        }),
      }),

   
    
  }),
});

export const { useGetAllUsersQuery, useLoginadminMutation } = adminApi;

export default adminApi;
