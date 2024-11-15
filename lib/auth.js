

// import Cognito from "next-auth/providers/cognito";

// export const authOptions = {
//   providers: [
//     Cognito({
//       clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
//       clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
//       domain: process.env.NEXT_PUBLIC_DOMAIN_URL,
//       authorization: {
//         params: {
//           // scope: " profile",
//           identity_provider: "Google",
//           redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URL,
//           response_type: "code",
//           client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
          
//         },
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt(token, user) {
//       if (user) {
//         token.id = user.id;
//       }
//       return token;
//     },
//     async session(session, token) {
//       session.user.id = token.id;
//       return session;
//     },
//   },
// };
