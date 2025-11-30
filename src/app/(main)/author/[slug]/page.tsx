import AuthorDetails from '@/components/author/AuthorDetails';
import { getAllAuthorSlugs, getAuthor } from '@/lib/author';
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

        <AuthorBooks authorSlug={slug} />
      </div>
    </div>
  );
}
