import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  mockArticles,
  mockAuthors,
  mockCategories,
  mockComments,
  mockMedia,
  mockMenuItems,
  mockSettings,
  mockStaticPages,
  mockTags,
  mockCurrentUser,
  mockAds,
  mockUsers
} from '../data/mockData';
import {
  Article,
  Author,
  Category,
  Comment,
  MediaItem,
  MenuItem,
  SiteSettings,
  StaticPage,
  Tag,
  User,
  ViewState,
  AdSlot
} from '../types';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface CmsContextType {
  // State
  articles: Article[];
  categories: Category[];
  tags: Tag[];
  media: MediaItem[];
  mediaItems: MediaItem[]; // alias
  authors: Author[];
  comments: Comment[];
  staticPages: StaticPage[];
  menuItems: MenuItem[];
  settings: SiteSettings;
  adSlots: AdSlot[];
  users: User[];
  currentUser: User | null;
  bookmarks: string[];
  viewState: ViewState;
  view: ViewState; // alias
  toasts: Toast[];
  isAuthModalOpen: boolean;

  // Navigation
  navigateTo: (state: ViewState) => void;
  goToHome: () => void;
  goToArticle: (slug: string) => void;
  goToCategory: (slug: string) => void;
  goToAuthor: (slug: string) => void;
  goToTag: (slug: string) => void;
  goToSearch: (query?: string) => void;
  goToArchive: () => void;
  goToPage: (slug: string) => void;
  goToAdmin: (subPage?: ViewState['adminSubPage'], editId?: string) => void;

  // Article CRUD
  saveArticle: (article: Partial<Article>) => void;
  deleteArticle: (id: string, permanent?: boolean) => void;
  duplicateArticle: (id: string) => void;
  recordArticleView: (id: string) => void;

  // Category CRUD
  saveCategory: (category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Tag CRUD
  saveTag: (tag: Partial<Tag>) => void;
  deleteTag: (id: string) => void;

  // Author CRUD
  saveAuthor: (author: Partial<Author>) => void;
  deleteAuthor: (id: string) => void;

  // Media CRUD
  addMedia: (media: Omit<MediaItem, 'id' | 'uploadedAt'>) => void;
  addMediaItem: (media: Partial<MediaItem>) => void;
  deleteMedia: (id: string) => void;
  deleteMediaItem: (id: string) => void;
  updateMediaAlt: (id: string, altText: string) => void;

  // Comments
  addComment: (comment: Omit<Comment, 'id' | 'createdAt' | 'status'>) => void;
  updateCommentStatus: (id: string, status: Comment['status']) => void;
  deleteComment: (id: string) => void;

  // Pages
  savePage: (page: Partial<StaticPage>) => void;
  saveStaticPage: (page: Partial<StaticPage>) => void;
  deletePage: (id: string) => void;
  deleteStaticPage: (id: string) => void;

  // Menus
  saveMenuItem: (item: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  reorderMenuItems: (items: MenuItem[]) => void;

  // Settings
  updateSettings: (newSettings: Partial<SiteSettings>) => void;

  // Ads & Monetization
  saveAdSlot: (ad: Partial<AdSlot>) => void;
  deleteAdSlot: (id: string) => void;
  toggleAdSlotStatus: (id: string) => void;
  recordAdImpression: (id: string) => void;
  recordAdClick: (id: string) => void;

  // Users Management
  saveUser: (user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  toggleUserStatus: (id: string) => void;

  // Auth & Bookmarks
  toggleBookmark: (articleId: string) => void;
  isBookmarked: (articleId: string) => boolean;
  loginAsAdmin: () => void;
  logout: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const CmsContext = createContext<CmsContextType | undefined>(undefined);

export const CmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // LocalStorage safety helper
  const loadState = <T,>(key: string, fallback: T): T => {
    try {
      const saved = localStorage.getItem(`newsroom_${key}`);
      return saved ? JSON.parse(saved) : fallback;
    } catch {
      return fallback;
    }
  };

  const [articles, setArticles] = useState<Article[]>(() => loadState('articles', mockArticles));
  const [categories, setCategories] = useState<Category[]>(() => loadState('categories', mockCategories));
  const [tags, setTags] = useState<Tag[]>(() => loadState('tags', mockTags));
  const [media, setMedia] = useState<MediaItem[]>(() => loadState('media', mockMedia));
  const [authors, setAuthors] = useState<Author[]>(() => loadState('authors', mockAuthors));
  const [comments, setComments] = useState<Comment[]>(() => loadState('comments', mockComments));
  const [staticPages, setStaticPages] = useState<StaticPage[]>(() => loadState('staticPages', mockStaticPages));
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => loadState('menuItems', mockMenuItems));
  const [settings, setSettings] = useState<SiteSettings>(() => {
    const loaded = loadState('settings', mockSettings);
    if (!loaded.footerDescription || loaded.footerDescription.includes('Publikasi digital independen berfokus')) {
      return { ...loaded, footerDescription: mockSettings.footerDescription };
    }
    return loaded;
  });
  const [adSlots, setAdSlots] = useState<AdSlot[]>(() => loadState('adSlots', mockAds));
  const [users, setUsers] = useState<User[]>(() => loadState('users', mockUsers));
  const [currentUser, setCurrentUser] = useState<User | null>(() => loadState('currentUser', mockCurrentUser));
  const [bookmarks, setBookmarks] = useState<string[]>(() => loadState('bookmarks', ['art-1']));
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Navigation state (defaults to home)
  const [viewState, setViewState] = useState<ViewState>({
    page: 'home',
    slug: '',
    param: ''
  });

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem('newsroom_articles', JSON.stringify(articles));
      localStorage.setItem('newsroom_categories', JSON.stringify(categories));
      localStorage.setItem('newsroom_tags', JSON.stringify(tags));
      localStorage.setItem('newsroom_media', JSON.stringify(media));
      localStorage.setItem('newsroom_authors', JSON.stringify(authors));
      localStorage.setItem('newsroom_comments', JSON.stringify(comments));
      localStorage.setItem('newsroom_staticPages', JSON.stringify(staticPages));
      localStorage.setItem('newsroom_menuItems', JSON.stringify(menuItems));
      localStorage.setItem('newsroom_settings', JSON.stringify(settings));
      localStorage.setItem('newsroom_adSlots', JSON.stringify(adSlots));
      localStorage.setItem('newsroom_users', JSON.stringify(users));
      localStorage.setItem('newsroom_currentUser', JSON.stringify(currentUser));
      localStorage.setItem('newsroom_bookmarks', JSON.stringify(bookmarks));
    } catch (e) {
      console.error('Failed to sync to localStorage', e);
    }
  }, [articles, categories, tags, media, authors, comments, staticPages, menuItems, settings, adSlots, users, currentUser, bookmarks]);

  // Toast dispatch
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Navigation dispatchers
  const navigateTo = (state: ViewState) => {
    setViewState({
      ...state,
      slug: state.slug || state.param,
      param: state.param || state.slug
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToHome = () => navigateTo({ page: 'home', param: '', slug: '' });
  const goToArticle = (slug: string) => navigateTo({ page: 'article', param: slug, slug });
  const goToCategory = (slug: string) => navigateTo({ page: 'category', param: slug, slug });
  const goToAuthor = (slug: string) => navigateTo({ page: 'author', param: slug, slug });
  const goToTag = (slug: string) => navigateTo({ page: 'tag', param: slug, slug });
  const goToSearch = (query: string = '') => navigateTo({ page: 'search', param: query, slug: query });
  const goToArchive = () => navigateTo({ page: 'archive' });
  const goToPage = (slug: string) => navigateTo({ page: 'static-page', param: slug, slug });
  const goToAdmin = (subPage: ViewState['adminSubPage'] = 'dashboard', editId?: string) => {
    navigateTo({ page: 'admin', adminSubPage: subPage, editArticleId: editId, slug: editId, param: editId });
  };

  // Article CRUD
  const saveArticle = (data: Partial<Article>) => {
    const isNew = !data.id;
    const author = data.author || authors[0];
    const categoryName = data.category || 'Teknologi';
    const categoryObj = categories.find((c) => c.name.toLowerCase() === categoryName.toLowerCase()) || categories[0];

    const newArticle: Article = {
      id: data.id || `art-${Date.now()}`,
      title: data.title || 'Draf Artikel Baru',
      slug: data.slug || (data.title || 'draf-artikel').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      excerpt: data.excerpt || '',
      content: data.content || '<p>Tuliskan naskah editorial Anda di sini...</p>',
      featuredImage: data.featuredImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop&q=80',
      imageCaption: data.imageCaption || '',
      mediaType: data.mediaType || (data.youtubeUrl ? 'video' : 'image'),
      youtubeUrl: data.youtubeUrl || '',
      youtubeVideoId: data.youtubeVideoId || '',
      category: categoryObj.name,
      categoryId: categoryObj.id,
      tags: data.tags || ['Teknologi'],
      author: author,
      status: data.status || 'published',
      publishedAt: data.publishedAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      views: data.views ?? 0,
      readingTime: data.readingTime || `${Math.max(2, Math.round(((data.content?.length || 500) / 700)))} menit baca`,
      isFeaturedHero: data.isFeaturedHero ?? false,
      isFeaturedSecondary: data.isFeaturedSecondary ?? false,
      isTrending: data.isTrending ?? false,
      seoTitle: data.seoTitle || data.title,
      metaDescription: data.metaDescription || data.excerpt,
      focusKeyword: data.focusKeyword || '',
      canonicalUrl: data.canonicalUrl || `https://newsroom.id/article/${data.slug}`,
      ogImage: data.ogImage || data.featuredImage
    };

    setArticles((prev) => {
      const exists = prev.some((a) => a.id === newArticle.id);
      if (exists) {
        return prev.map((a) => (a.id === newArticle.id ? newArticle : a));
      }
      return [newArticle, ...prev];
    });

    showToast(isNew ? 'Artikel berhasil dipublikasikan' : 'Artikel berhasil diperbarui', 'success');
  };

  const deleteArticle = (id: string, permanent: boolean = false) => {
    setArticles((prev) => {
      if (permanent) {
        return prev.filter((a) => a.id !== id);
      }
      return prev.map((a) => (a.id === id ? { ...a, status: 'trash' } : a));
    });
    showToast(permanent ? 'Artikel dihapus permanen' : 'Artikel dipindahkan ke tempat sampah', 'info');
  };

  const duplicateArticle = (id: string) => {
    const item = articles.find((a) => a.id === id);
    if (!item) return;
    const duplicated: Article = {
      ...item,
      id: `art-${Date.now()}`,
      title: `${item.title} (Salinan)`,
      slug: `${item.slug}-salinan-${Math.floor(Math.random() * 1000)}`,
      status: 'draft',
      views: 0,
      publishedAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setArticles((prev) => [duplicated, ...prev]);
    showToast('Artikel berhasil diduplikasi ke Draf', 'success');
  };

  const recordArticleView = (id: string) => {
    setArticles((prev) => prev.map((a) => (a.id === id ? { ...a, views: a.views + 1 } : a)));
  };

  // Category CRUD
  const saveCategory = (cat: Partial<Category>) => {
    const isNew = !cat.id;
    const item: Category = {
      id: cat.id || `cat-${Date.now()}`,
      name: cat.name || 'Kategori Baru',
      slug: cat.slug || (cat.name || 'kategori').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: cat.description || '',
      color: cat.color || '#D9381E',
      image: cat.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
      seoTitle: cat.seoTitle,
      seoDescription: cat.seoDescription,
      articleCount: cat.articleCount || 0
    };
    setCategories((prev) => {
      if (prev.some((c) => c.id === item.id)) {
        return prev.map((c) => (c.id === item.id ? item : c));
      }
      return [...prev, item];
    });
    showToast(isNew ? 'Kategori baru berhasil dibuat' : 'Kategori diperbarui', 'success');
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast('Kategori telah dihapus', 'info');
  };

  // Tag CRUD
  const saveTag = (tag: Partial<Tag>) => {
    const isNew = !tag.id;
    const item: Tag = {
      id: tag.id || `tag-${Date.now()}`,
      name: tag.name || 'Tag Baru',
      slug: tag.slug || (tag.name || 'tag').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      articleCount: tag.articleCount || 0
    };
    setTags((prev) => {
      if (prev.some((t) => t.id === item.id)) {
        return prev.map((t) => (t.id === item.id ? item : t));
      }
      return [...prev, item];
    });
    showToast(isNew ? 'Tag berhasil dibuat' : 'Tag diperbarui', 'success');
  };

  const deleteTag = (id: string) => {
    setTags((prev) => prev.filter((t) => t.id !== id));
    showToast('Tag telah dihapus', 'info');
  };

  // Author CRUD
  const saveAuthor = (authorData: Partial<Author>) => {
    const isNew = !authorData.id;
    const item: Author = {
      id: authorData.id || `auth-${Date.now()}`,
      name: authorData.name || 'Penulis Baru',
      slug: authorData.slug || (authorData.name || 'penulis').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      avatar: authorData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      bio: authorData.bio || 'Jurnalis dan kontributor editorial Newsroom.',
      role: authorData.role || 'Jurnalis Investigasi',
      email: authorData.email || 'redaksi@newsroom.id',
      twitter: authorData.twitter,
      linkedin: authorData.linkedin,
      articleCount: authorData.articleCount || 0
    };
    setAuthors((prev) => {
      if (prev.some((a) => a.id === item.id)) {
        return prev.map((a) => (a.id === item.id ? item : a));
      }
      return [...prev, item];
    });
    showToast(isNew ? 'Penulis baru berhasil ditambahkan' : 'Profil penulis diperbarui', 'success');
  };

  const deleteAuthor = (id: string) => {
    setAuthors((prev) => prev.filter((a) => a.id !== id));
    showToast('Profil penulis telah dihapus', 'info');
  };

  // Media CRUD
  const addMedia = (data: Omit<MediaItem, 'id' | 'uploadedAt'>) => {
    const item: MediaItem = {
      ...data,
      id: `med-${Date.now()}`,
      uploadedAt: new Date().toISOString().split('T')[0]
    };
    setMedia((prev) => [item, ...prev]);
    showToast('Berkas media berhasil diunggah', 'success');
  };

  const addMediaItem = (data: Partial<MediaItem>) => {
    const item: MediaItem = {
      id: `med-${Date.now()}`,
      title: data.title || 'Foto Baru',
      fileName: data.fileName || data.filename || 'media.jpg',
      filename: data.filename || data.fileName || 'media.jpg',
      url: data.url || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200',
      mimeType: data.mimeType || 'image/jpeg',
      type: data.type || 'image',
      size: data.size || data.fileSize || '350 KB',
      fileSize: data.fileSize || data.size || '350 KB',
      dimensions: data.dimensions || '1920x1080',
      altText: data.altText || data.title || 'Foto Editorial',
      uploadedAt: new Date().toISOString().split('T')[0],
      caption: data.caption || ''
    };
    setMedia((prev) => [item, ...prev]);
    showToast('Berkas media berhasil disimpan', 'success');
  };

  const deleteMedia = (id: string) => {
    setMedia((prev) => prev.filter((m) => m.id !== id));
    showToast('Berkas media telah dihapus', 'info');
  };

  const deleteMediaItem = deleteMedia;

  const updateMediaAlt = (id: string, altText: string) => {
    setMedia((prev) => prev.map((m) => (m.id === id ? { ...m, altText } : m)));
    showToast('Teks alternatif (ALT) disimpan untuk SEO', 'success');
  };

  // Comments
  const addComment = (commentData: Omit<Comment, 'id' | 'createdAt' | 'status'>) => {
    const newComment: Comment = {
      ...commentData,
      id: `com-${Date.now()}`,
      status: 'pending', // Requires moderation
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setComments((prev) => [newComment, ...prev]);
    showToast('Komentar Anda telah dikirim dan menunggu moderasi dewan redaksi', 'info');
  };

  const updateCommentStatus = (id: string, status: Comment['status']) => {
    setComments((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    showToast(`Status komentar diubah menjadi ${status}`, 'success');
  };

  const deleteComment = (id: string) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
    showToast('Komentar berhasil dihapus', 'info');
  };

  // Pages
  const savePage = (page: Partial<StaticPage>) => {
    const isNew = !page.id;
    const item: StaticPage = {
      id: page.id || `page-${Date.now()}`,
      title: page.title || 'Halaman Baru',
      slug: page.slug || (page.title || 'halaman').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      content: page.content || '<p>Konten halaman...</p>',
      status: page.status || 'published',
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setStaticPages((prev) => {
      if (prev.some((p) => p.id === item.id)) {
        return prev.map((p) => (p.id === item.id ? item : p));
      }
      return [...prev, item];
    });
    showToast(isNew ? 'Halaman statis berhasil dibuat' : 'Halaman statis diperbarui', 'success');
  };

  const saveStaticPage = savePage;

  const deletePage = (id: string) => {
    setStaticPages((prev) => prev.filter((p) => p.id !== id));
    showToast('Halaman dihapus', 'info');
  };

  const deleteStaticPage = deletePage;

  // Menus
  const saveMenuItem = (item: Partial<MenuItem>) => {
    const label = item.label || item.title || 'Tautan';
    const newItem: MenuItem = {
      id: item.id || `menu-${Date.now()}`,
      label: label,
      title: label,
      type: item.type || 'custom',
      url: item.url || '/',
      order: item.order || menuItems.length + 1
    };
    setMenuItems((prev) => {
      if (prev.some((m) => m.id === newItem.id)) {
        return prev.map((m) => (m.id === newItem.id ? newItem : m));
      }
      return [...prev, newItem];
    });
    showToast('Menu berhasil diperbarui', 'success');
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems((prev) => prev.filter((m) => m.id !== id));
    showToast('Item navigasi dihapus', 'info');
  };

  const reorderMenuItems = (items: MenuItem[]) => {
    setMenuItems(items);
    showToast('Urutan navigasi diperbarui', 'success');
  };

  // Settings
  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Pengaturan situs berhasil disimpan', 'success');
  };

  // Ads & Monetization
  const saveAdSlot = (adData: Partial<AdSlot>) => {
    const isNew = !adData.id;
    const item: AdSlot = {
      id: adData.id || `ad-${Date.now()}`,
      title: adData.title || 'Slot Iklan Baru',
      position: adData.position || 'header_banner',
      type: adData.type || 'image',
      imageUrl: adData.imageUrl || '',
      targetUrl: adData.targetUrl || '',
      altText: adData.altText || '',
      code: adData.code || '',
      sponsorName: adData.sponsorName || '',
      isActive: adData.isActive ?? true,
      startDate: adData.startDate || new Date().toISOString().split('T')[0],
      endDate: adData.endDate,
      impressions: adData.impressions ?? 0,
      clicks: adData.clicks ?? 0
    };

    setAdSlots((prev) => {
      if (prev.some((a) => a.id === item.id)) {
        return prev.map((a) => (a.id === item.id ? item : a));
      }
      return [...prev, item];
    });
    showToast(isNew ? 'Slot iklan berhasil ditambahkan' : 'Slot iklan berhasil diperbarui', 'success');
  };

  const deleteAdSlot = (id: string) => {
    setAdSlots((prev) => prev.filter((a) => a.id !== id));
    showToast('Slot iklan berhasil dihapus', 'info');
  };

  const toggleAdSlotStatus = (id: string) => {
    setAdSlots((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a))
    );
    showToast('Status penayangan iklan berhasil diubah', 'success');
  };

  const recordAdImpression = (id: string) => {
    setAdSlots((prev) =>
      prev.map((a) => (a.id === id ? { ...a, impressions: a.impressions + 1 } : a))
    );
  };

  const recordAdClick = (id: string) => {
    setAdSlots((prev) =>
      prev.map((a) => (a.id === id ? { ...a, clicks: a.clicks + 1 } : a))
    );
  };

  // User Management
  const saveUser = (userData: Partial<User>) => {
    if (userData.id) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userData.id ? ({ ...u, ...userData } as User) : u))
      );
      // If updating current user's profile
      if (currentUser && currentUser.id === userData.id) {
        setCurrentUser((prev) => (prev ? ({ ...prev, ...userData } as User) : prev));
      }
      showToast(`Data pengguna @${userData.username || userData.name} berhasil diperbarui`, 'success');
    } else {
      const cleanUsername = (userData.username || userData.name || `user_${Date.now().toString().slice(-4)}`)
        .toLowerCase()
        .replace(/[^a-z0-9_.]+/g, '')
        .trim();

      const newUser: User = {
        id: `usr-${Date.now()}`,
        name: userData.name || userData.username || 'Pengguna Baru',
        username: cleanUsername,
        email: userData.email || '',
        avatar: userData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        password: userData.password || 'Password123!',
        role: userData.role || 'subscriber',
        status: userData.status || 'active',
        createdAt: new Date().toISOString().split('T')[0]
      };
      setUsers((prev) => [newUser, ...prev]);
      showToast(`Pengguna baru "@${newUser.username}" berhasil didaftarkan`, 'success');
    }
  };

  const deleteUser = (id: string) => {
    const target = users.find((u) => u.id === id);
    if (target && currentUser && target.id === currentUser.id) {
      showToast('Tidak dapat menghapus akun yang sedang aktif digunakan', 'error');
      return;
    }
    setUsers((prev) => prev.filter((u) => u.id !== id));
    showToast(`Pengguna "@${target?.username || id}" berhasil dihapus`, 'info');
  };

  const toggleUserStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const nextStatus = u.status === 'active' ? 'inactive' : 'active';
          showToast(`Status pengguna @${u.username} diubah menjadi ${nextStatus === 'active' ? 'Aktif' : 'Nonaktif'}`, 'info');
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  // Bookmarks
  const toggleBookmark = (articleId: string) => {
    setBookmarks((prev) => {
      const exists = prev.includes(articleId);
      const updated = exists ? prev.filter((id) => id !== articleId) : [...prev, articleId];
      showToast(exists ? 'Dihapus dari daftar bacaan' : 'Disimpan ke daftar bacaan', 'info');
      return updated;
    });
  };

  const isBookmarked = (articleId: string) => bookmarks.includes(articleId);

  // Auth simulation
  const loginAsAdmin = () => {
    setCurrentUser(mockCurrentUser);
    showToast(`Masuk sebagai ${mockCurrentUser.name} (${mockCurrentUser.role})`, 'success');
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Anda telah keluar dari akun', 'info');
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <CmsContext.Provider
      value={{
        articles,
        categories,
        tags,
        media,
        mediaItems: media,
        authors,
        comments,
        staticPages,
        menuItems,
        settings,
        adSlots,
        currentUser,
        bookmarks,
        viewState,
        view: viewState,
        toasts,
        isAuthModalOpen,
        navigateTo,
        goToHome,
        goToArticle,
        goToCategory,
        goToAuthor,
        goToTag,
        goToSearch,
        goToArchive,
        goToPage,
        goToAdmin,
        saveArticle,
        deleteArticle,
        duplicateArticle,
        recordArticleView,
        saveCategory,
        deleteCategory,
        saveTag,
        deleteTag,
        saveAuthor,
        deleteAuthor,
        addMedia,
        addMediaItem,
        deleteMedia,
        deleteMediaItem,
        updateMediaAlt,
        addComment,
        updateCommentStatus,
        deleteComment,
        savePage,
        saveStaticPage,
        deletePage,
        deleteStaticPage,
        saveMenuItem,
        deleteMenuItem,
        reorderMenuItems,
        updateSettings,
        saveAdSlot,
        deleteAdSlot,
        toggleAdSlotStatus,
        recordAdImpression,
        recordAdClick,
        users,
        saveUser,
        deleteUser,
        toggleUserStatus,
        toggleBookmark,
        isBookmarked,
        loginAsAdmin,
        logout,
        openAuthModal,
        closeAuthModal,
        showToast
      }}
    >
      {children}
    </CmsContext.Provider>
  );
};

export const useCms = () => {
  const context = useContext(CmsContext);
  if (!context) {
    throw new Error('useCms must be used within a CmsProvider');
  }
  return context;
};
