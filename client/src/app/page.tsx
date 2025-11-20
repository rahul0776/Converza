import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import LandingPage from "./landing/page";

export default async function Home() {
  const session = await getServerSession(authOptions);

  // If user is authenticated, redirect to chat
  if (session) {
    redirect("/chat");
  }

  // Otherwise show landing page
  return <LandingPage />;
}
