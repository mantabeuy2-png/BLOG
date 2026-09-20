import React from 'react';
import { useCms } from '../../context/CmsContext';
import { ArticleCard } from '../../components/frontend/ArticleCard';
import { ChevronRight, Mail, Twitter, Linkedin, Instagram } from 'lucide-react';

interface AuthorPageProps {
  slug: string;
}

export const AuthorPage: React.FC<AuthorPageProps> = ({ slug }) => {
  const { authors, articles, goToHome } = useCms();

  const author = authors.find(
    (a) => a.slug.toLowerCase() === slug.toLowerCase() || a.id.toLowerCase() === slug.toLowerCase()
  ) || authors[0];

  const authorArticles = articles.filter(
    (art) => art.author.id === author.id || art.author.slug === author.slug
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-neutral-500 mb-6 font-sans-ui">
        <button onClick={goToHome} className="hover:text-neutral-900">
          Beranda
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
        <span>Penulis</span>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
        <span className="text-neutral-900 font-semibold">{author.name}</span>
      </div>

      {/* Author Profile Bio Card */}
      <div className="p-8 sm:p-12 rounded-2xl bg-white border border-neutral-200 shadow-xs mb-12">
        <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start text-center sm:text-left">
          <img
            src={author.avatar}
            alt={author.name}
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover ring-4 ring-neutral-100 shadow-sm shrink-0"
          />

          <div className="flex-1">
            <span className="text-xs font-bold uppercase tracking-widest text-red-600 block mb-1">
              {author.role}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-serif-editorial text-neutral-900">
              {author.name}
            </h1>

            <p className="mt-4 text-base sm:text-lg text-neutral-600 font-sans-ui leading-relaxed max-w-3xl">
              {author.bio}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-semibold text-neutral-700">
              {author.email && (
                <a
                  href={`mailto:${author.email}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{author.email}</span>
                </a>
              )}
              {author.twitter && (
                <a
                  href={author.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
                >
                  <Twitter className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Twitter</span>
                </a>
              )}
              {author.linkedin && (
                <a
                  href={author.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
                >
                  <Linkedin className="w-3.5 h-3.5 text-neutral-500" />
                  <span>LinkedIn</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Articles by Author */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b-2 border-neutral-900 mb-8">
          <h2 className="text-2xl font-bold font-serif-editorial text-neutral-900">
            Naskah oleh {author.name}
          </h2>
          <span className="text-xs text-neutral-500 font-medium">
            {authorArticles.length} artikel terbit
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {authorArticles.map((art) => (
            <ArticleCard key={art.id} article={art} variant="grid" />
          ))}
        </div>
      </div>
    </div>
  );
};
