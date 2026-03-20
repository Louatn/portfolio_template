import { getAllPublishedProjects, getCategories } from "../actions/get-projects";
import PortfolioClient from "./PortfolioClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export const metadata = {
  title: "Portfolio | Landscape Photography",
  description: "Browse the complete collection of landscape photography work",
};

export default async function PortfolioPage() {
  const [projects, categories, session] = await Promise.all([
    getAllPublishedProjects(),
    getCategories(),
    getServerSession(authOptions),
  ]);

  const isAdmin = session?.user?.isAdmin === true;

  return <PortfolioClient projects={projects} categories={categories} isAdmin={isAdmin} />;
}
