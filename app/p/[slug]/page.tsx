import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageRenderer } from "@/components/PageRenderer";
import type { PageSchema } from "@/lib/schema/page";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await db.project.findUnique({
    where: { slug },
    include: {
      versions: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!project || !project.isPublished || !project.versions[0]) {
    return {
      title: "Page Not Found",
    };
  }

  const schema = project.versions[0].schema as unknown as PageSchema;
  const meta = schema?.meta ?? { title: project.name, description: "" };

  return {
    title: meta.title || project.name,
    description: meta.description || "",
    openGraph: {
      title: meta.title || project.name,
      description: meta.description || "",
      images: meta.ogImageUrl ? [{ url: meta.ogImageUrl }] : [],
    },
  };
}

export default async function PublishedPage({ params }: PageProps) {
  const { slug } = await params;

  const project = await db.project.findUnique({
    where: { slug },
    include: {
      versions: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  // Check if project exists, is published, and has a saved version
  if (!project || !project.isPublished || !project.versions[0]) {
    return notFound();
  }

  const schema = project.versions[0].schema as unknown as PageSchema;

  return (
    <main className="min-h-screen bg-white">
      <PageRenderer schema={schema} isEditable={false} />
    </main>
  );
}
