import { adminAuth } from "@/app/_lib/auth";
import CONFIG from "@/app/_utils/config";
import ImageKit from "imagekit"
import { NextResponse } from "next/server";

const imagekit = new ImageKit({
  publicKey: CONFIG.IK_PUBLIC_KEY,
  privateKey: process.env.IK_PRIVATE_KEY,
  urlEndpoint: CONFIG.IK_URL_ENDPOINT
});

export async function GET() {
  const authError = await adminAuth();
  if (authError) 
    return authError;
  return NextResponse.json(imagekit.getAuthenticationParameters());
}