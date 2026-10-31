import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, BookOpen } from 'lucide-react';
import { PublicShell } from '@/components/SiteChrome';
import { BLOG_POSTS } from '@/lib/staticContent';

export const metadata: Metadata = {
  title: 'Textile Yarn Knowledge Hub & B2B Sourcing Blog',
  description:
    'Technical guides on choosing cotton yarn for knitting, understanding Ne/Denier yarn counts, cotton vs polyester yarn, and Uster quality testing.',
};

export default function BlogIndexPage() {
  return (
    <PublicShell>
      <section className="bg-[#063B1B] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl space-y-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-300">
            <BookOpen className="w-3.5 h-3.5" /> INTERNATIONAL SOURCING INSIGHTS
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold">
            Technical Yarn &amp; Export Guides for Global Buyers
          </h1>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid md:grid-cols-2 gap-7">
        {BLOG_POSTS.map((post) => (
          <article
            key={post.slug}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-soft flex flex-col justify-between"
          >
            <div>
              <img src={post.image} alt={post.title} className="w-full h-56 object-cover" />
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#08752B] font-bold">
                    {post.category}
                  </span>
                  <span>{post.readTime} · {post.publishedAt}</span>
                </div>
                <h2 className="text-xl font-extrabold text-[#10371E]">{post.title}</h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{post.excerpt}</p>
              </div>
            </div>
            <div className="px-6 pb-6">
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#08752B] hover:underline"
              >
                Read Technical Article <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </section>
    </PublicShell>
  );
}
