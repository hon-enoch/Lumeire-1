import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { books as seedBooks, type Book } from './data';

export type Palette = {
  bg: string;
  surface: string;
  solid: string;
  text: string;
  muted: string;
  border: string;
  tint: string;
  accent: string;
  green: string;
  darkGreen: string;
  glass: string;
};

export const light: Palette = {
  bg: '#f9faf7',
  surface: 'rgba(255,255,255,0.65)',
  solid: '#ffffff',
  text: '#252a26',
  muted: '#7a7e76',
  border: 'rgba(91,106,85,0.12)',
  tint: '#f0f1eb',
  accent: '#d66945',
  green: '#667553',
  darkGreen: '#354b3d',
  glass: 'rgba(255,255,255,.6)',
};

export const darkPalette: Palette = {
  bg: '#171c19',
  surface: 'rgba(39,48,42,0.75)',
  solid: '#252e28',
  text: '#f0f1e9',
  muted: '#a4afa2',
  border: 'rgba(220,232,213,0.12)',
  tint: '#30392f',
  accent: '#ed9775',
  green: '#b7c49b',
  darkGreen: '#c3d1b9',
  glass: 'rgba(34,43,36,.7)',
};

export type Filters = { format: string; maxPrice: number; minRating: number; sort: string };
export const defaultFilters: Filters = {
  format: 'All formats',
  maxPrice: 25,
  minRating: 0,
  sort: 'Curator’s picks',
};

export type Order = {
  id: string;
  ids: string[];
  total: number;
  email: string;
  provider: string;
  date: string;
};

export type Modal =
  | { type: 'book'; id: string }
  | { type: 'reader'; id: string }
  | { type: 'cart' }
  | { type: 'filters' }
  | { type: 'newsletter' }
  | { type: 'account' }
  | null;

export type Tab = 'Discover' | 'Explore' | 'Collections' | 'My Shelf';
export type Screen = 'Main' | 'Admin';

type Store = {
  dark: boolean;
  toggleTheme: () => void;
  palette: Palette;
  books: Book[];
  updateBook: (id: string, patch: Partial<Book>) => void;
  wishlist: string[];
  toggleWish: (id: string) => void;
  cart: string[];
  addCart: (id: string) => void;
  removeCart: (id: string) => void;
  owned: string[];
  orders: Order[];
  checkout: (email: string, provider: string) => Order;
  modal: Modal;
  setModal: (m: Modal) => void;
  curator: boolean;
  setCurator: (v: boolean) => void;
  toast: string;
  notify: (msg: string) => void;
  query: string;
  setQuery: (q: string) => void;
  category: string;
  setCategory: (c: string) => void;
  filters: Filters;
  setFilters: (f: Filters) => void;
  promo: string;
  setPromo: (p: string) => void;
  subscribed: boolean;
  subscribe: (email: string) => void;
  tab: Tab;
  navigate: (t: Tab) => void;
  screen: Screen;
  setScreen: (s: Screen) => void;
  width: number;
  ready: boolean;
};

const Ctx = createContext<Store>({} as Store);
const KEY = 'lumiere-v1';
export const DEFAULT_PROMO = 'Your next chapter starts here. Enjoy 15% off your first order.';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches,
  );
  const [books, setBooks] = useState<Book[]>(seedBooks);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cart, setCart] = useState<string[]>([]);
  const [owned, setOwned] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [modal, setModal] = useState<Modal>(null);
  const [curator, setCurator] = useState(false);
  const [toast, setToast] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All books');
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [promo, setPromo] = useState(DEFAULT_PROMO);
  const [subscribed, setSubscribed] = useState(false);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<Tab>('Discover');
  const [screen, setScreen] = useState<Screen>('Main');
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const t = JSON.parse(raw);
        setWishlist(t.wishlist || []);
        setCart(t.cart || []);
        setOwned(t.owned || []);
        setOrders(t.orders || []);
        if (typeof t.dark === 'boolean') setDark(t.dark);
        if (t.promo) setPromo(t.promo);
        setSubscribed(!!t.subscribed);
        if (t.catalog) setBooks(seedBooks.map((b) => ({ ...b, ...(t.catalog[b.id] || {}) })));
      }
    } catch {
      setToast('Your saved shelf could not be loaded. You can still explore.');
    } finally {
      // Short delay to mimic the original splash
      setTimeout(() => setReady(true), 350);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    const catalog = Object.fromEntries(
      books.map(({ id, title, author, price, hidden }) => [id, { title, author, price, hidden }]),
    );
    try {
      localStorage.setItem(
        KEY,
        JSON.stringify({ wishlist, cart, owned, orders, dark, promo, subscribed, catalog }),
      );
    } catch {
      setToast('Device storage is unavailable. Changes will last for this visit.');
    }
  }, [wishlist, cart, owned, orders, dark, promo, subscribed, books, ready]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 3600);
    return () => clearTimeout(t);
  }, [toast]);

  const notify = useCallback((m: string) => setToast(m), []);

  const value: Store = {
    dark,
    toggleTheme: () => setDark((d) => !d),
    palette: dark ? darkPalette : light,
    books,
    updateBook: (id, patch) => {
      setBooks((bs) => bs.map((b) => (b.id === id ? { ...b, ...patch } : b)));
      notify('Catalog updated on this device.');
    },
    wishlist,
    toggleWish: (id) =>
      setWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id])),
    cart,
    addCart: (id) => {
      if (cart.includes(id)) notify('This book is already in your bag.');
      else {
        setCart((c) => [...c, id]);
        notify('A good choice. Added to your book bag.');
      }
    },
    removeCart: (id) => setCart((c) => c.filter((x) => x !== id)),
    owned,
    orders,
    checkout: (email, provider) => {
      const total =
        cart.reduce((s, id) => s + (books.find((b) => b.id === id)?.price || 0), 0) *
        (subscribed ? 0.85 : 1);
      const order: Order = {
        id: 'LM-' + Date.now().toString(36).toUpperCase(),
        ids: [...cart],
        total,
        email,
        provider,
        date: new Date().toISOString(),
      };
      setOrders((o) => [order, ...o]);
      setOwned((o) => [...new Set([...o, ...cart])]);
      setCart([]);
      return order;
    },
    modal,
    setModal,
    curator,
    setCurator,
    toast,
    notify,
    query,
    setQuery,
    category,
    setCategory,
    filters,
    setFilters,
    promo,
    setPromo,
    subscribed,
    subscribe: () => {
      setSubscribed(true);
      notify('Welcome to the inner circle. Your 15% discount is unlocked.');
    },
    tab,
    navigate: (t) => {
      setTab(t);
      setScreen('Main');
      window.scrollTo({ top: 0 });
    },
    screen,
    setScreen,
    width,
    ready,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useStore = () => useContext(Ctx);
