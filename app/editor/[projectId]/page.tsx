import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { EditorShell } from "./EditorShell";
import type { PageSchema } from "@/lib/schema/page";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ projectId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { projectId } = await params;
  const project = await db.project.findUnique({
    where: { id: projectId },
    select: { name: true },
  });
  return {
    title: project ? `Editing: ${project.name} — LandingGen` : "Editor — LandingGen",
  };
}

export default async function EditorPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  const { projectId } = await params;

  const project = await db.project.findUnique({
    where: { id: projectId },
    include: {
      versions: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!project || project.userId !== session.user.id) notFound();
  if (project.status === "DELETED") notFound();

  const latestVersion = project.versions[0];
  if (!latestVersion) notFound();

  return (
    <EditorShell
      projectId={projectId}
      projectName={project.name}
      schema={latestVersion.schema as unknown as PageSchema}
      user={session.user}
    />
  );
}
