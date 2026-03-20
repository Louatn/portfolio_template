import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import HomeClient from "./HomeClient";
import { getFeaturedProjects } from "./actions/get-projects";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.isAdmin === true;
  const firstName = session?.user?.name?.split(" ")[0] ?? "Admin";

  // Fetch featured projects for homepage
  const projects = await getFeaturedProjects(6);

  return <HomeClient isAdmin={isAdmin} firstName={firstName} projects={projects} />;
}
