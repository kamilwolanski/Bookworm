import AuthorDetails from '@/components/author/AuthorDetails';
import { getAllAuthorSlugs, getAuthor } from '@/lib/author';

interface AuthorPageProps {
  params: Promise<{ slug: string }>;
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
      <AuthorDetails authorData={authorResponse} />
    </div>
  );
}
