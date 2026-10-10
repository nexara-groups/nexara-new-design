import { BlogIndexPage, blogIndexMeta } from '@/components/BlogPages';

export const metadata = blogIndexMeta();
export default function Page() { return <BlogIndexPage theme="neo" />; }
