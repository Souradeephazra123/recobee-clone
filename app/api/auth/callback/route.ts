// app/api/auth/callback/route.ts

import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";

const {
  NEXT_PUBLIC_DOMAIN_URL,
  NEXT_PUBLIC_CLIENT_ID,
  NEXT_PUBLIC_CLIENT_SECRET,
} = process.env;

export async function GET(request: NextRequest) {
  try {
    const origin = request.nextUrl.origin;

    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code") as string;

    if (!code) {
      const error = searchParams.get("error");
      return NextResponse.json({ error: error || "Unknown error" });
    }

    const authorizationHeader = `Basic ${Buffer.from(
      `${NEXT_PUBLIC_CLIENT_ID}:${NEXT_PUBLIC_CLIENT_SECRET}`
    ).toString("base64")}`;

    const requestBody = new URLSearchParams({
      code: code,
      grant_type: "authorization_code",
      client_id: NEXT_PUBLIC_CLIENT_ID as string,
      redirect_uri: `${origin}/api/auth/callback`,
    });

    // Get tokens
    const res = await fetch(`${NEXT_PUBLIC_DOMAIN_URL}/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        // Authorization: authorizationHeader,
      },
      body: requestBody,
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({
        error: data.error,
        error_description: data.error_description,
      });
    }

    // Store tokens in cookies
    const cookieStore = cookies();
    cookieStore.set("id_token", data.id_token);
    cookieStore.set("access_token", data.access_token);
    cookieStore.set("refresh_token", data.refresh_token);

    //fetching user name from jwt token
    const payload = JSON.parse(
      Buffer.from(data.id_token.split(".")[1], "base64").toString()
    );
    cookieStore.set("user_name", payload.name);

    
    const user_id = payload["arid"];

    if (!user_id) {
      await createUserIfNotExist(data.id_token, payload);
    } else {
      const newToken = await RefreshOnlyOnce(data.refresh_token);
      await fetchData(newToken);
    }

    return NextResponse.redirect(new URL("/", request.nextUrl));
  } catch (error) {
    return NextResponse.json({ error: error });
  }
}

async function createUserIfNotExist(IdToken: string, payload) {
  if (!IdToken || !payload?.name || !payload?.picture || !payload?.email)
    return;

  const body = {
    email: payload?.email,
    country: "India",
    photo: payload?.picture,
  };
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/users`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${IdToken}`,
        },
        body: JSON.stringify(body),
      }
    );
    // let newToken = await RefreshOnlyOnce(referenceRef.current);
    // setIdToken(newToken);
    // setUserCreated(true);
    // setIsopen(true);
    return response;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

async function RefreshOnlyOnce(RToken: string) {
  try {
    const refreshResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/Refresh`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ RToken: RToken }),
      }
    );
  

    if (refreshResponse.status !== 200) {
      return;
    }
    const cookieStore = cookies();
    cookieStore.set("refreshTokenRequestTime", new Date().toISOString());
    const responses = await refreshResponse.json();
    const responseId =
      responses.AuthVerifyResponse.AuthenticationResult.IdToken;

    //stored IdToken to cookie
    cookieStore.set("id_token", JSON.stringify(responseId));
    return responseId;
  } catch (error) {
    console.error(error);
    return null;
  }
}

const fetchData = async (tokenValue: string) => {
  if (!tokenValue) return;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/users/0`,
      {
        headers: {
          Authorization: `Bearer ${tokenValue}`,
        },
      }
    );
    const data = await response.json();
    if (data?.length === 0) {
      // //console.log("No data returned from API");
      return; // exit the generator function
    }

    const cookieStore = cookies();
    console.log("data", data);
    cookieStore.set("userProfile", JSON.stringify(data));
    // storeUserData();
    // mixpanel.identify(response.data.id);
    // mixpanel.track("Login", {
    //   screen: "LoginMain",
    //   source: "web",
    // });
    // setIsopen(true);
    // console.log("User data fetched successfully", response.data);
  } catch (error) {
    console.log({ error });
  }
};
