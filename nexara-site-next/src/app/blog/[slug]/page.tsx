import { BlogPostPage, blogPostMeta, blogStaticParams } from '@/components/BlogPages';

export const dynamicParams = false;
export const generateStaticParams = blogStaticParams;
export const generateMetadata = ({ params }: { params: Promise<{ slug: string }> }) => blogPostMeta(params);
export default function Page({ params }: { params: Promise<{ slug: string }> }) { return <BlogPostPage theme="neo" params={params} />; }
