import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AppHeader } from "@/components/AppHeader";
import { NewProjectForm } from "@/components/dashboard/NewProjectForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Page — LandingGen",
  description: "Describe your product and generate a landing page in seconds.",
};

export default async function NewProjectPage() {
  const session = await auth();
  if (!session?.user) redirect("/");

  return (
    <div className="min-h-screen bg-surface-base">
      <AppHeader user={session.user} />
      <NewProjectForm />
    </div>
  );
}
