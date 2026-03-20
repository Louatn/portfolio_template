import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import HomeClient from "./HomeClient";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.isAdmin === true;
  const firstName = session?.user?.name?.split(" ")[0] ?? "Admin";

  return <HomeClient isAdmin={isAdmin} firstName={firstName} />;
}
