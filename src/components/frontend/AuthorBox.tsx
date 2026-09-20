import React from 'react';
import { Author } from '../../types';
import { useCms } from '../../context/CmsContext';
import { Globe } from 'lucide-react';

interface AuthorBoxProps {
  author: Author;
}

export const AuthorBox: React.FC<AuthorBoxProps> = ({ author }) => {
  const { goToAuthor } = useCms();

  return (
    <div className="p-6 sm:p-8 rounded-xl bg-white border border-neutral-200/80 shadow-xs flex flex-col sm:flex-row gap-6 items-start">
      <img
        src={author.avatar}
        alt={author.name}
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover shrink-0 ring-2 ring-neutral-100"
      />

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-red-600 block mb-0.5">
              Profil Penulis
            </span>
            <button
              onClick={() => goToAuthor(author.slug)}
              className="text-lg sm:text-xl font-bold font-serif-editorial text-neutral-900 hover:text-red-600 transition-colors"
            >
              {author.name}
            </button>
          </div>

          <span className="text-xs font-medium text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full">
            {author.role}
          </span>
        </div>

        <p className="mt-2 text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans-ui">
          {author.bio}
        </p>

        <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center gap-4 text-xs font-semibold text-neutral-700">
          <button
            onClick={() => goToAuthor(author.slug)}
            className="text-red-600 hover:underline"
          >
            Lihat semua naskah ({author.articleCount || 12})
          </button>
          {author.twitter && (
            <a href={author.twitter} target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-neutral-900">
              Twitter/X
            </a>
          )}
          {author.linkedin && (
            <a href={author.linkedin} target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-neutral-900">
              LinkedIn
            </a>
          )}
          {author.email && (
            <a href={`mailto:${author.email}`} className="text-neutral-500 hover:text-neutral-900">
              Email
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
