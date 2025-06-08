import { deleteSession } from "@/app/_lib/session";
import { ReS } from "@/app/_utils/responseHandler.util";

export async function GET() {
    await deleteSession();
    return ReS(`Logout Successfully!`,[],200)
}