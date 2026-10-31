import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { PublicShell } from '@/components/SiteChrome';
import { BLOG_POSTS } from '@/lib/staticContent';

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);
  if (!post) return { title: 'Article Not Found' };
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.targetKeywords,
  };
}

export default function BlogArticlePage({ params }: { params: { slug: string } }) {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);
  if (!post) notFound();

  return (
    <PublicShell>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#08752B] hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Knowledge Hub
        </Link>
        <div className="space-y-3">
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-[#08752B] text-xs font-extrabold">
            {post.category}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#10371E] leading-tight">
            {post.title}
          </h1>
          <div className="text-xs text-slate-500">
            By <strong>{post.author}</strong> · {post.publishedAt} · {post.readTime}
          </div>
        </div>

        <img src={post.image} alt={post.title} className="w-full h-72 sm:h-96 object-cover rounded-3xl border border-slate-200" />

        <div className="space-y-6 pt-2">
          {post.sections.map((sec) => (
            <section key={sec.heading} className="space-y-2">
              <h2 className="text-xl font-extrabold text-[#10371E]">{sec.heading}</h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">{sec.body}</p>
            </section>
          ))}
        </div>

        <div className="bg-[#ECF6EE] rounded-3xl p-6 flex flex-wrap items-center justify-between gap-4 mt-8">
          <div>
            <div className="font-extrabold text-[#10371E]">Ready to source specification-verified yarn?</div>
            <div className="text-xs text-slate-600">Request physical sample cones or a 24h FOB/CIF quotation.</div>
          </div>
          <Link
            href="/request-quote"
            className="inline-flex items-center gap-2 bg-[#08752B] text-white text-xs font-bold px-5 py-3 rounded-full"
          >
            Request a Quote <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </article>
    </PublicShell>
  );
}
