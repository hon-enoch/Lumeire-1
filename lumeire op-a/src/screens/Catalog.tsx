import { useEffect, useMemo, useRef, useState } from 'react';
import { useStore, defaultFilters } from '../store';
import { categories, categoryIcons, money } from '../data';
import {
  BookCard,
  BookCover,
  Button,
  Chip,
  EmptyState,
  Icon,
  IconButton,
  Pressable,
  Txt,
  glass,
  row,
  between,
  shadow,
} from '../ui';

export function SearchBar({ large = false }: { large?: boolean }) {
  const { palette, books, query, setQuery, setModal } = useStore();
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        ref.current?.focus();
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const results =
    query.length > 0
      ? books
          .filter(
            (b) =>
              !b.hidden &&
              `${b.title} ${b.author} ${b.isbn} ${b.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase()),
          )
          .slice(0, 4)
      : [];

  return (
    <div style={{ position: 'relative', zIndex: 40, maxWidth: large ? 570 : undefined, width: '100%' }}>
      <div
        style={{
          ...row,
          backgroundColor: palette.surface,
          borderRadius: 12,
          border: `1px solid ${focused ? '#a1ae90' : palette.border}`,
          height: 54,
          padding: '0 17px',
          gap: 12,
          ...glass,
          ...shadow,
        }}
      >
        <Icon name="search-outline" size={20} color={palette.green} />
        <input
          ref={ref}
          aria-label="Search books, authors or ISBN"
          placeholder="A title, an author, a whole new world…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          style={{
            flex: 1,
            minWidth: 0,
            color: palette.text,
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 13,
            height: '100%',
            border: 'none',
            background: 'transparent',
            outline: 'none',
          }}
          className="lm-input"
        />
        {query ? (
          <IconButton name="close" size={17} label="Clear search" onClick={() => setQuery('')} />
        ) : (
          <div style={{ border: `1px solid ${palette.border}`, borderRadius: 5, padding: '3px 6px' }}>
            <Txt style={{ fontSize: 10, color: palette.muted }}>⌘ K</Txt>
          </div>
        )}
      </div>
      {focused && query.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: 61,
            left: 0,
            right: 0,
            padding: 8,
            borderRadius: 12,
            backgroundColor: palette.solid,
            border: `1px solid ${palette.border}`,
            ...shadow,
          }}
        >
          {results.length ? (
            results.map((b) => (
              <Pressable
                key={b.id}
                onClick={() => {
                  setModal({ type: 'book', id: b.id });
                  setFocused(false);
                }}
                style={({ hovered }) => ({
                  display: 'flex',
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  padding: 10,
                  borderRadius: 7,
                  backgroundColor: hovered ? palette.tint : 'transparent',
                })}
              >
                <BookCover book={b} width={26} height={38} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Txt style={{ fontSize: 12, fontWeight: 600 }}>{b.title}</Txt>
                  <Txt style={{ color: palette.muted, fontSize: 10, marginTop: 2 }}>{b.author}</Txt>
                </div>
                <Txt style={{ fontSize: 12 }}>{money(b.price)}</Txt>
                <Icon name="arrow-up-outline" size={13} color={palette.muted} />
              </Pressable>
            ))
          ) : (
            <div style={{ padding: 15 }}>
              <Txt>No stories found. Try a different keyword.</Txt>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Spotlight() {
  const { books, palette, dark, setModal } = useStore();
  const [i, setI] = useState(0);
  const trio = [books[2], books[0], books[1]];
  const b = trio[i];
  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 344,
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 22,
          right: 0,
          top: 13,
          bottom: 15,
          borderRadius: 27,
          border: '1px solid rgba(255,255,255,.45)',
          background: dark
            ? 'linear-gradient(135deg,#353e31,#28362f,#3e3c32)'
            : 'linear-gradient(135deg,#e9eddb,#ecf0e5,#f3ece2)',
        }}
      />
      <div style={{ position: 'absolute', top: 26, left: 42, ...row, gap: 6 }}>
        <div style={{ width: 5, height: 5, borderRadius: 5, backgroundColor: palette.green }} />
        <Txt style={{ fontSize: 9, letterSpacing: 1.6, fontWeight: 600, color: palette.green }}>
          THE WEEKLY SPOTLIGHT
        </Txt>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 28,
          right: 22,
          width: 43,
          height: 43,
          borderRadius: 30,
          border: `1px solid ${dark ? '#6e765a' : '#c6cfb4'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: 'rotate(14deg)',
        }}
      >
        <Icon name="sparkles-outline" size={20} color={palette.green} />
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: 26,
          paddingTop: 10,
          position: 'relative',
        }}
      >
        <Pressable
          onClick={() => setI((i + 2) % 3)}
          label="Previous spotlight"
          style={{ transform: 'rotate(-13deg) translate(16px, 8px)' }}
        >
          <BookCover book={trio[(i + 2) % 3]} width={103} height={156} />
        </Pressable>
        <Pressable
          onClick={() => setModal({ type: 'book', id: b.id })}
          label={`Discover ${b.title}`}
          style={{ zIndex: 2, transform: 'rotate(-3deg) translateY(-7px)' }}
        >
          <BookCover book={b} width={142} height={211} />
        </Pressable>
        <Pressable
          onClick={() => setI((i + 1) % 3)}
          label="Next spotlight"
          style={{ transform: 'rotate(12deg) translate(-14px, 10px)' }}
        >
          <BookCover book={trio[(i + 1) % 3]} width={103} height={156} />
        </Pressable>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 45,
          right: 21,
          bottom: 30,
          padding: '13px 16px',
          borderRadius: 13,
          backgroundColor: dark ? '#323d32df' : '#ffffffb8',
          border: `1px solid ${dark ? palette.border : '#ffffffb8'}`,
          ...glass,
          ...row,
          gap: 10,
          ...shadow,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <Txt serif style={{ fontSize: 19 }}>
            {b.title}
          </Txt>
          <Txt style={{ fontSize: 10, color: palette.muted, marginTop: 3 }}>
            {b.author}  <span style={{ color: '#b58e4d' }}> ★ </span> {b.rating}
          </Txt>
        </div>
        <Txt style={{ fontWeight: 600, fontSize: 13 }}>{money(b.price)}</Txt>
        <IconButton
          name="arrow-forward"
          label="View spotlight book"
          onClick={() => setModal({ type: 'book', id: b.id })}
          style={{ backgroundColor: dark ? '#b5c59d' : '#354b3d', width: 33, height: 33 }}
          size={16}
          color={dark ? '#263023' : '#fff'}
        />
      </div>
      <div style={{ position: 'absolute', bottom: -4, ...row, gap: 7 }}>
        {trio.map((t, k) => (
          <Pressable
            key={t.id}
            label={`Spotlight ${k + 1}`}
            onClick={() => setI(k)}
            style={{
              width: k === i ? 19 : 5,
              height: 5,
              borderRadius: 5,
              backgroundColor: k === i ? palette.green : dark ? '#47523e' : '#d6dccc',
              transition: 'width .2s ease',
            }}
          />
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 102,
          left: 1,
          padding: '9px 12px',
          backgroundColor: dark ? '#37432ae8' : '#ffffffe8',
          borderRadius: 10,
          ...glass,
          ...shadow,
          ...row,
          gap: 6,
          transform: 'rotate(-5deg)',
        }}
      >
        <Icon name="ribbon-outline" size={14} color={palette.green} />
        <Txt style={{ fontSize: 9, color: palette.green }}>Good books. Great company.</Txt>
      </div>
    </div>
  );
}

function Hero({ onExplore }: { onExplore: () => void }) {
  const { palette, setCurator, width } = useStore();
  const wide = width >= 900;
  const size = wide ? 56 : 40;
  const lh = wide ? '62px' : '46px';
  const ls = wide ? -1.8 : -1.3;
  return (
    <div
      className="lm-fade-in"
      style={{
        display: 'flex',
        flexDirection: wide ? 'row' : 'column',
        gap: wide ? 50 : 12,
        paddingTop: wide ? 25 : 23,
        paddingBottom: wide ? 28 : 24,
        alignItems: wide ? 'center' : undefined,
        zIndex: 20,
        position: 'relative',
      }}
    >
      <div style={{ flex: wide ? 1.2 : undefined, minWidth: 0, zIndex: 30 }}>
        <div style={{ ...row, gap: 8, marginBottom: 16 }}>
          <div style={{ width: 18, height: 1, backgroundColor: palette.green }} />
          <Txt style={{ fontSize: 9, letterSpacing: 2.2, color: palette.green, fontWeight: 600 }}>
            FOR THE ENDLESSLY CURIOUS
          </Txt>
        </div>
        <Txt serif style={{ fontSize: size, lineHeight: lh, letterSpacing: ls }}>
          Find your next
          {'\n'}
          <span style={{ color: palette.green }}>beautiful obsession.</span>
        </Txt>
        <Txt style={{ fontSize: 13, lineHeight: '23px', color: palette.muted, marginTop: 16, maxWidth: 440 }}>
          Extraordinary stories. Fresh perspectives. A little escape.{'\n'}Discover digital books that meet you
          where you are.
        </Txt>
        <div style={{ marginTop: wide ? 19 : 20, zIndex: 30, position: 'relative' }}>
          <SearchBar large />
        </div>
        <div style={{ ...row, gap: 13, marginTop: 17, flexWrap: 'wrap' }}>
          <Button
            title="Explore the library"
            icon="arrow-forward"
            onClick={onExplore}
            style={{ minHeight: 43, padding: '0 18px', borderRadius: 9 }}
          />
          <Pressable
            onClick={() => setCurator(true)}
            style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 7, padding: 8 }}
          >
            <Icon name="sparkles-outline" size={16} color={palette.green} />
            <Txt style={{ fontSize: 11, fontWeight: 500 }}>
              {width < 600 ? 'Ask the Curator' : 'Let’s find your next read'}
            </Txt>
          </Pressable>
        </div>
        <div style={{ ...row, gap: 8, marginTop: 17 }}>
          <div style={{ display: 'flex', flexDirection: 'row', marginRight: 3 }}>
            {['#b8bba6', '#c5a493', '#a8b5b3'].map((c, n) => (
              <div
                key={c}
                style={{
                  marginLeft: n ? -7 : 0,
                  height: 23,
                  width: 23,
                  borderRadius: 15,
                  backgroundColor: c,
                  border: `2px solid ${palette.bg}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name="person" size={13} color="#fff" />
              </div>
            ))}
          </div>
          <Txt style={{ fontSize: width < 600 ? 9 : 10, color: palette.muted }}>
            {width < 600 ? 'A new chapter awaits.' : 'A new chapter, a little closer.'}
          </Txt>
          <div style={{ height: 10, width: 1, backgroundColor: palette.border, margin: '0 4px' }} />
          <Icon name="flash-outline" size={12} color={palette.green} />
          <Txt style={{ fontSize: width < 600 ? 9 : 10, color: palette.muted }}>Instant digital access</Txt>
        </div>
      </div>
      {wide && <Spotlight />}
      {!wide && width > 560 && (
        <div style={{ height: 344 }}>
          <Spotlight />
        </div>
      )}
    </div>
  );
}

export function Footer() {
  const { palette, dark, setCurator, setModal, width } = useStore();
  return (
    <div style={{ marginTop: 34, paddingBottom: 40 }}>
      <div style={{ display: 'flex', flexDirection: width > 700 ? 'row' : 'column', gap: 18 }}>
        <Pressable
          onClick={() => setCurator(true)}
          style={{
            flex: 1,
            backgroundColor: dark ? '#29392b' : '#eaf0e3',
            borderRadius: 17,
            padding: 26,
            border: `1px solid ${palette.border}`,
            display: 'flex',
            flexDirection: 'row',
            gap: 20,
            alignItems: 'center',
          }}
        >
          <div
            style={{
              height: 47,
              width: 47,
              borderRadius: 15,
              backgroundColor: dark ? '#3e4b36' : '#f9fcf5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon name="sparkles-outline" size={25} color={palette.green} />
          </div>
          <div style={{ flex: 1 }}>
            <Txt serif style={{ fontSize: 23 }}>
              Your mood. Your next read.
            </Txt>
            <Txt style={{ color: palette.muted, fontSize: 11, marginTop: 6, lineHeight: '18px' }}>
              A little guidance from The Book Curator goes a long way.
            </Txt>
          </div>
          <Icon name="arrow-forward" size={20} color={palette.green} />
        </Pressable>
        <Pressable
          onClick={() => setModal({ type: 'newsletter' })}
          style={{
            flex: 1,
            backgroundColor: dark ? '#3c322a' : '#f4eae0',
            borderRadius: 17,
            padding: 26,
            border: `1px solid ${palette.border}`,
            display: 'flex',
            flexDirection: 'row',
            gap: 20,
            alignItems: 'center',
          }}
        >
          <div
            style={{
              height: 47,
              width: 47,
              borderRadius: 15,
              backgroundColor: dark ? '#514031' : '#fcf5ee',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon name="mail-open-outline" size={25} color={palette.accent} />
          </div>
          <div style={{ flex: 1 }}>
            <Txt serif style={{ fontSize: 23 }}>
              Good stories travel together.
            </Txt>
            <Txt style={{ color: palette.muted, fontSize: 11, marginTop: 6, lineHeight: '18px' }}>
              Join our reading circle. Your first chapter is 15% off.
            </Txt>
          </div>
          <Icon name="arrow-forward" size={20} color={palette.accent} />
        </Pressable>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          gap: width > 700 ? 65 : 19,
          padding: '30px 0',
          borderBottom: `1px solid ${palette.border}`,
          flexWrap: 'wrap',
        }}
      >
        {[
          ['shield-checkmark-outline', 'Secure checkout'],
          ['cloud-download-outline', 'Instant downloads'],
          ['phone-portrait-outline', 'Read on any device'],
          ['heart-outline', 'Thoughtfully curated'],
        ].map(([ic, label]) => (
          <div key={label} style={{ ...row, gap: 7 }}>
            <Icon name={ic} color={palette.green} size={15} />
            <Txt style={{ fontSize: 10, color: palette.muted }}>{label}</Txt>
          </div>
        ))}
      </div>
      <div style={{ ...between, paddingTop: 23, flexWrap: 'wrap', gap: 15 }}>
        <div>
          <Txt serif style={{ fontSize: 22 }}>
            lumière<span style={{ color: palette.accent }}>.</span>
          </Txt>
          <Txt style={{ color: palette.muted, fontSize: 10, marginTop: 5 }}>A little light. A whole new world.</Txt>
        </div>
        <Txt style={{ fontSize: 10, color: palette.muted }}>© 2026 Lumière. Made for the love of reading.</Txt>
        <div style={{ ...row, gap: 14 }}>
          <Txt style={{ fontSize: 13, fontWeight: 700, color: palette.muted }}>stripe</Txt>
          <Txt style={{ fontSize: 12, fontWeight: 700, fontStyle: 'italic', color: palette.muted }}>PayPal</Txt>
          <Txt style={{ fontSize: 12, fontWeight: 700, color: palette.muted }}>paystack</Txt>
        </div>
      </div>
    </div>
  );
}

export function CatalogScreen({ discover }: { discover: boolean }) {
  const { books, palette, query, setQuery, category, setCategory, filters, setFilters, setModal, navigate, width } =
    useStore();
  const [showAll, setShowAll] = useState(false);
  const cols = width >= 1150 ? 6 : width >= 850 ? 4 : width >= 580 ? 3 : 2;

  const list = useMemo(() => {
    const l = books.filter(
      (b) =>
        !b.hidden &&
        (category === 'All books' || b.category === category) &&
        `${b.title} ${b.author} ${b.category} ${b.tags.join(' ')} ${b.isbn}`
          .toLowerCase()
          .includes(query.toLowerCase()) &&
        b.price <= filters.maxPrice &&
        b.rating >= filters.minRating &&
        (filters.format === 'All formats' || b.formats.includes(filters.format)),
    );
    if (filters.sort === 'Price: low to high') l.sort((a, b) => a.price - b.price);
    if (filters.sort === 'Highest rated') l.sort((a, b) => b.rating - a.rating);
    return !discover || showAll || query || category !== 'All books' ? l : l.slice(0, 6);
  }, [books, query, category, filters, discover, showAll]);

  const filtered = filters.format !== 'All formats' || filters.maxPrice !== 25 || filters.minRating !== 0;
  const heading = query
    ? `Results for “${query}”`
    : category !== 'All books'
      ? category
      : discover && !showAll
        ? 'A few books you’ll fall for.'
        : 'Your next chapter awaits.';

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 1320,
        margin: '0 auto',
        padding: `0 ${width >= 900 ? 48 : 20}px 35px`,
      }}
    >
      <div style={{ zIndex: 10, position: 'relative' }}>
        {discover ? (
          <Hero
            onExplore={() => {
              setQuery('');
              setCategory('All books');
              navigate('Explore');
            }}
          />
        ) : (
          <div style={{ padding: '34px 0', display: 'flex', flexDirection: 'column', gap: 16, zIndex: 20, position: 'relative' }}>
            <div style={{ ...row, gap: 6 }}>
              <Icon name="library-outline" color={palette.green} size={14} />
              <Txt style={{ fontSize: 10, letterSpacing: 1.6, color: palette.green }}>THE DIGITAL LIBRARY</Txt>
            </div>
            <Txt serif style={{ fontSize: width > 600 ? 47 : 37, letterSpacing: -1 }}>
              A world between the covers.
            </Txt>
            <Txt style={{ color: palette.muted }}>Find the story, perspective, or spark you’ve been looking for.</Txt>
            <div style={{ maxWidth: 620, marginTop: 8, zIndex: 30, position: 'relative' }}>
              <SearchBar />
            </div>
          </div>
        )}
        <div
          style={{
            paddingTop: discover ? 8 : 0,
            paddingBottom: 27,
            borderBottom: `1px solid ${palette.border}`,
          }}
        >
          <div className="lm-scroll-x" style={{ display: 'flex', gap: 9, overflowX: 'auto', paddingBottom: 2 }}>
            {categories.map((c) => (
              <Chip
                key={c}
                title={c}
                active={category === c}
                icon={categoryIcons[c]}
                onClick={() => {
                  setCategory(c);
                  setShowAll(true);
                }}
              />
            ))}
          </div>
        </div>
        <div style={{ ...between, paddingTop: 27, paddingBottom: 23, gap: 15, alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <div style={{ ...row, gap: 6, marginBottom: 6 }}>
              <Txt style={{ color: palette.accent, fontSize: 9, fontWeight: 600, letterSpacing: 1.8 }}>
                {query || category !== 'All books' ? `${list.length} GOOD FINDS` : 'HANDPICKED & HARD TO PUT DOWN'}
              </Txt>
            </div>
            <Txt serif style={{ fontSize: width > 600 ? 31 : 26, letterSpacing: -0.6 }}>
              {heading}
            </Txt>
          </div>
          <div style={{ ...row, gap: 17 }}>
            <Pressable
              onClick={() => setModal({ type: 'filters' })}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 7,
                padding: 9,
                border: `1px solid ${palette.border}`,
                borderRadius: 8,
                backgroundColor: palette.surface,
              }}
            >
              <Icon name="options-outline" size={15} />
              <Txt style={{ fontSize: 11 }}>Filters{filtered ? ' •' : ''}</Txt>
            </Pressable>
            {discover && width > 600 && (
              <Pressable
                onClick={() => {
                  setShowAll(true);
                  navigate('Explore');
                }}
                style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 7 }}
              >
                <Txt style={{ color: palette.green, fontSize: 11, fontWeight: 500 }}>View all books</Txt>
                <Icon name="arrow-forward" size={14} color={palette.green} />
              </Pressable>
            )}
          </div>
        </div>
      </div>

      {list.length ? (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: '17px 14px' }}>
          {list.map((b) => (
            <BookCard key={b.id} book={b} compact={width < 580} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="search-outline"
          title="A different kind of discovery?"
          text="No books match these filters. Broaden your search and let a new story find you."
          action="Reset search & filters"
          onClick={() => {
            setQuery('');
            setCategory('All books');
            setFilters(defaultFilters);
          }}
        />
      )}
      <Footer />
    </div>
  );
}
