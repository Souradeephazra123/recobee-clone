import Image from "next/image";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = cookies();
  const usernameCookie = cookieStore.get("user_name");
  const userProfileCookie = cookieStore.get("userProfile");
  const hasIdtoken = cookieStore.get("id_token");
  const username = usernameCookie ? usernameCookie.value : null;
  const userProfile = userProfileCookie ? JSON.parse(userProfileCookie.value) : null;
  return (
    <div className=" w-full">
      {hasIdtoken ? (
        <div className=" w-full  flex sm:flex-row flex-col justify-between items-center">
          <div>
            <p>Hello {username} you are about to login </p>
            <h1>Ready !!!</h1>
            <Image
              src={userProfile?.photo || userProfile?.thumbnail}
              width={100}
              height={100}
              className=" rounded-full"
            />
            <p>Region : {userProfile?.country}</p>
            <p>Usertag: {userProfile?.usertag}</p>
            <p>Email address: {userProfile?.email}</p>
            <p>Biolink : {userProfile?.biolink}</p>
          </div>

          <form action="/api/auth/signout" method="GET" className="mt-6">
            <button
              type="submit"
              className=" flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Sign out
            </button>
          </form>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <form
            className="max-w-md w-full space-y-8 p-6 bg-white shadow rounded-md"
            action="/api/auth/google-sign-in"
            method="GET"
          >
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-bold text-gray-900">Sign In</h2>
              <p className="mt-2 text-sm text-gray-600">
                Please sign in with your Google account.
              </p>
            </div>
            <div className="mt-8 space-y-6">
              <button
                className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                type="submit"
              >
                Sign In With Google
              </button>
            </div>
          </form>


          <form
            className="max-w-md w-full space-y-8 p-6 bg-white shadow rounded-md"
            action="/api/auth/apple-sign-in"
            method="GET"
          >
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-bold text-gray-900">Sign In</h2>
              <p className="mt-2 text-sm text-gray-600">
                Please sign in with your Apple account.
              </p>
            </div>
            <div className="mt-8 space-y-6">
              <button
                className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                type="submit"
              >
                Sign In With Apple
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
