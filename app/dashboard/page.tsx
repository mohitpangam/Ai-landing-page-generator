import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AppHeader } from "@/components/AppHeader";
import { ProjectGrid } from "@/components/dashboard/ProjectGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — LandingGen",
  description: "Manage all your AI-generated landing pages.",
};

export default async function DashboardPage() {
  const session = await auth();

  // Middleware already handles redirect, but belt-and-suspenders
  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-surface-base">
      <AppHeader user={session.user} />

      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        {/* Page heading */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">
              My Pages
            </h1>
            <p className="mt-1 text-sm text-text-tertiary">
              All your AI-generated landing pages in one place.
            </p>
          </div>
        </div>

        {/* Client-side grid with search, filter, and CRUD */}
        <ProjectGrid />
      </main>
    </div>
  );
}
