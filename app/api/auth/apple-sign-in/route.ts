import { NextRequest,NextResponse } from "next/server";
import crypto from "crypto";

const {NEXT_PUBLIC_DOMAIN_URL,NEXT_PUBLIC_CLIENT_ID}=process.env;

export async function GET(request:NextRequest) {
    let authorizeParams = new URLSearchParams();
    const url=request.nextUrl.origin;
    const state=crypto.randomBytes(16).toString("hex");
    authorizeParams.append("response_type","code");
    authorizeParams.append("client_id",NEXT_PUBLIC_CLIENT_ID as string);
    authorizeParams.append("redirect_uri",`${url}/api/auth/callback`);
    // authorizeParams.append("state",state);
    authorizeParams.append("identity_provider","SignInWithApple");
    authorizeParams.append("scope","openid profile email");
    return NextResponse.redirect(`${NEXT_PUBLIC_DOMAIN_URL}/oauth2/authorize?${authorizeParams.toString()}`);
}