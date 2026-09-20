import React from 'react';
import { Article } from '../../types';
import { useCms } from '../../context/CmsContext';
import { Clock, Bookmark, ChevronRight, Play } from 'lucide-react';
import { extractYouTubeVideoId } from '../../utils/youtube';

interface FeaturedStoriesProps {
  articles: Article[];
}

export const FeaturedStories: React.FC<FeaturedStoriesProps> = ({ articles }) => {
  const { goToArticle, goToCategory, goToAuthor, isBookmarked, toggleBookmark } = useCms();

  if (articles.length === 0) return null;

  const mainStory = articles[0];
  const sideStories = articles.slice(1, 6);
  const isMainVideo = mainStory && (mainStory.mediaType === 'video' || Boolean(mainStory.youtubeVideoId) || Boolean(extractYouTubeVideoId(mainStory.youtubeUrl)));

  return (
    <section className="my-12">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-neutral-900 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold font-serif-editorial text-neutral-900 tracking-tight flex items-center gap-2">
          <span>Artikel Pilihan Redaksi</span>
          <span className="text-xs font-sans-ui font-semibold text-red-600 uppercase tracking-widest px-2 py-0.5 bg-red-50 rounded">
            Jangan Lewatkan
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        {/* Main Prominent Story (7 Cols) */}
        {mainStory && (
          <div
            onClick={() => goToArticle(mainStory.slug)}
            className="group cursor-pointer lg:col-span-7 flex flex-col justify-between rounded-xl bg-white border border-neutral-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all h-full"
          >
            <div>
              <div className="aspect-16/10 overflow-hidden bg-neutral-100 relative">
                <img
                  src={mainStory.featuredImage}
                  alt={mainStory.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                />
                {isMainVideo && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="w-14 h-14 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg backdrop-blur-xs group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-current ml-1" />
                    </span>
                  </div>
                )}
                <div className="absolute top-4 left-4 flex items-center gap-1.5">
                  <span className="px-3 py-1 bg-neutral-900 text-white text-[11px] font-bold uppercase tracking-wider rounded-md">
                    {mainStory.category}
                  </span>
                  {isMainVideo && (
                    <span className="px-2.5 py-1 bg-black/80 text-white text-[10px] font-bold uppercase tracking-wider rounded-md flex items-center gap-1 backdrop-blur-xs">
                      <Play className="w-2.5 h-2.5 fill-current" /> Video
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6 sm:p-7">
                <h3 className="text-2xl sm:text-3xl font-bold font-serif-editorial text-neutral-900 leading-tight group-hover:text-red-600 transition-colors">
                  {mainStory.title}
                </h3>
                <p className="mt-3 text-sm sm:text-base text-neutral-600 font-sans-ui line-clamp-3 leading-relaxed">
                  {mainStory.excerpt}
                </p>
              </div>
            </div>

            <div className="px-6 sm:px-7 pb-6 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  goToAuthor(mainStory.author.slug);
                }}
                className="flex items-center gap-2.5 hover:text-neutral-900"
              >
                <img
                  src={mainStory.author.avatar}
                  alt={mainStory.author.name}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-neutral-200"
                />
                <span className="font-semibold text-neutral-800">{mainStory.author.name}</span>
                <span>•</span>
                <span>{mainStory.publishedAt}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-neutral-400 text-xs">
                  <Clock className="w-3.5 h-3.5" />
                  {mainStory.readingTime}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(mainStory.id);
                  }}
                  className={`p-1.5 rounded-full hover:bg-neutral-100 ${
                    isBookmarked(mainStory.id) ? 'text-red-600' : 'text-neutral-400'
                  }`}
                >
                  <Bookmark className="w-4 h-4 fill-current" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stacked Horizontal Secondary Articles (5 Cols) - 5 tight thumbnail items */}
        <div className="lg:col-span-5 flex flex-col justify-between divide-y divide-neutral-200/70 h-full bg-white rounded-xl border border-neutral-200/80 p-4 sm:p-5 shadow-xs">
          {sideStories.map((story) => {
            const isStoryVideo = story.mediaType === 'video' || Boolean(story.youtubeVideoId) || Boolean(extractYouTubeVideoId(story.youtubeUrl));
            return (
              <div
                key={story.id}
                onClick={() => goToArticle(story.slug)}
                className="group cursor-pointer py-2.5 first:pt-0 last:pb-0 flex gap-3.5 items-center transition-colors hover:bg-neutral-50/90 rounded-lg p-1.5 -mx-1.5"
              >
                <div className="w-20 sm:w-24 h-18 sm:h-20 rounded-lg overflow-hidden bg-neutral-100 shrink-0 relative">
                  <img
                    src={story.featuredImage}
                    alt={story.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {isStoryVideo && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/25">
                      <span className="w-6 h-6 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-xs">
                        <Play className="w-3 h-3 fill-current ml-0.5" />
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-red-600 mb-0.5">
                    <span>{story.category}</span>
                    <span className="text-neutral-300">•</span>
                    <span className="text-neutral-400 font-normal">{story.readingTime}</span>
                    {isStoryVideo && (
                      <>
                        <span className="text-neutral-300">•</span>
                        <span className="text-red-600 font-bold flex items-center gap-0.5">
                          <Play className="w-2.5 h-2.5 fill-current" /> Video
                        </span>
                      </>
                    )}
                  </div>

                  <h4 className="text-xs sm:text-[13px] font-bold font-serif-editorial text-neutral-900 leading-snug group-hover:text-red-600 transition-colors line-clamp-2">
                    {story.title}
                  </h4>

                  <div className="mt-1 flex items-center justify-between text-[11px] text-neutral-400">
                    <span className="truncate max-w-[170px] sm:max-w-[200px]">{story.author.name}</span>
                    <span className="group-hover:translate-x-1 transition-transform text-neutral-600 shrink-0 ml-1">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
