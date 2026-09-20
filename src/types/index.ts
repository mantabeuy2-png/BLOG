export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string; // photo profile
  password?: string;
  role: 'admin' | 'editor' | 'author' | 'subscriber';
  status?: 'active' | 'inactive';
  createdAt?: string;
}

export interface Author {
  id: string;
  name: string;
  slug: string;
  avatar: string;
  bio: string;
  role: string;
  email?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  website?: string;
  articleCount?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color?: string;
  image?: string;
  seoTitle?: string;
  seoDescription?: string;
  articleCount?: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  articleCount?: number;
}

export interface Comment {
  id: string;
  articleId: string;
  articleTitle?: string;
  authorName: string;
  authorEmail: string;
  authorAvatar?: string;
  content: string;
  status: 'pending' | 'approved' | 'spam' | 'trash';
  createdAt: string;
  parentId?: string;
}

export interface MediaItem {
  id: string;
  title?: string;
  filename?: string;
  fileName?: string;
  url: string;
  mimeType?: string;
  type?: 'image' | 'video' | 'document';
  size?: string;
  fileSize?: string;
  dimensions?: string;
  altText: string;
  uploadedAt: string;
  caption?: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  imageCaption?: string;
  mediaType?: 'image' | 'video';
  youtubeUrl?: string;
  youtubeVideoId?: string;
  category: string; // category slug or name
  categoryId: string;
  tags: string[];
  author: Author;
  status: 'published' | 'draft' | 'scheduled' | 'trash';
  publishedAt: string;
  updatedAt: string;
  views: number;
  readingTime: string;
  isFeaturedHero?: boolean;
  isFeaturedSecondary?: boolean;
  isTrending?: boolean;
  seoTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
}

export interface StaticPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  status?: 'published' | 'draft';
  updatedAt: string;
}

export interface MenuItem {
  id: string;
  label?: string;
  title?: string;
  type: 'category' | 'page' | 'custom';
  url: string;
  target?: '_blank' | '_self';
  order: number;
}

export interface SiteSettings {
  siteName: string;
  tagline?: string;
  siteTagline?: string;
  description: string;
  siteDescription?: string;
  logoText: string;
  logoBadge?: string;
  primaryColor: string;
  secondaryColor?: string;
  accentColor?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  footerDescription: string;
  copyrightText: string;
  // AI Generation Settings
  aiProvider?: string;
  aiModel?: string;
  aiCustomModel?: string;
  aiDefaultTone?: string;
  aiCustomBaseUrl?: string;
  aiCustomApiKey?: string;
  aiDetectedModels?: string[];
}

export type AdPosition = 'header_banner' | 'sidebar_top' | 'article_in_feed' | 'article_bottom' | 'footer_banner';
export type AdType = 'image' | 'code' | 'sponsored';

export interface AdSlot {
  id: string;
  title: string;
  position: AdPosition;
  type: AdType;
  imageUrl?: string;
  targetUrl?: string;
  altText?: string;
  code?: string;
  sponsorName?: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  impressions: number;
  clicks: number;
}

export interface ViewState {
  page: 'home' | 'article' | 'category' | 'author' | 'tag' | 'search' | 'archive' | 'static' | 'static-page' | 'admin';
  param?: string; // slug or search keyword
  slug?: string;
  adminSubPage?: 'dashboard' | 'articles' | 'article-editor' | 'categories' | 'tags' | 'media' | 'authors' | 'comments' | 'pages' | 'menus' | 'seo' | 'settings' | 'ads' | 'users';
  editArticleId?: string;
}
