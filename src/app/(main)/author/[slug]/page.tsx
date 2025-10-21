import AuthorDetails from '@/components/author/AuthorDetails';
import { getAllAuthorSlugs, getAuthor } from '@/lib/author';
import { Suspense } from 'react';
import AuthorBooks from './AuthorBooks';
import { Metadata, ResolvingMetadata } from 'next';

interface AuthorPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  { params }: AuthorPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = (await params).slug;

  const authorResponse = await getAuthor(slug);
  const parentMetadata = await parent;
  return {
    title: `${parentMetadata.title?.absolute} | ${authorResponse.name}`,
    description: authorResponse.bio,
  };
}

export async function generateStaticParams() {
  const slugs = await getAllAuthorSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function Author({ params }: AuthorPageProps) {
  const { slug } = await params;

  const authorResponse = await getAuthor(slug);

  return (
    <div className="mt-10 max-w-7xl mx-auto ">
      <div className="space-y-10">
        <AuthorDetails authorData={authorResponse} />
        <Suspense
          fallback={
            <div className="bg-sidebar shadow-lg rounded-xl p-4 sm:p-8">
              <h3 className="font-semibold">Książki autora</h3>
              <div className="flex items-center justify-center min-h-[280px] w-full">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-foreground" />
              </div>
            </div>
          }
        >
          <AuthorBooks authorSlug={slug} />
        </Suspense>
      </div>
    </div>
  );
}
