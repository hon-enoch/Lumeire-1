import { useState } from 'react';
import { useStore } from '../store';
import { collections } from '../data';
import { BookCard, BookCover, Button, Chip, EmptyState, Icon, Pressable, Txt, row, between } from '../ui';

export function ShelfScreen() {
  const { books, wishlist, owned, palette, setModal, navigate, width } = useStore();
  const [tab, setTab] = useState<'Wishlist' | 'My library'>('Wishlist');
  const ids = tab === 'Wishlist' ? wishlist : owned;
  const list = books.filter((b) => ids.includes(b.id));
  const cols = width > 1000 ? 5 : width > 720 ? 4 : width > 540 ? 3 : 2;

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 1260,
        margin: '0 auto',
        padding: width > 800 ? 42 : 20,
        paddingBottom: 90,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 13, marginBottom: 30 }}>
        <Txt style={{ color: palette.green, fontSize: 10, letterSpacing: 2 }}>A SPACE THAT’S YOURS</Txt>
        <Txt serif style={{ fontSize: 45, letterSpacing: -1 }}>
          Your reading shelf.
        </Txt>
        <Txt style={{ color: palette.muted }}>The books you love, and the ones you can’t wait to meet.</Txt>
        <div style={{ ...row, gap: 10, marginTop: 10 }}>
          {(['Wishlist', 'My library'] as const).map((t) => (
            <Chip
              key={t}
              title={`${t}  ${t === 'Wishlist' ? wishlist.length : owned.length}`}
              active={tab === t}
              onClick={() => setTab(t)}
              icon={t === 'Wishlist' ? 'heart-outline' : 'library-outline'}
            />
          ))}
        </div>
      </div>
      {list.length ? (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: '20px 14px' }}>
          {list.map((b) => (
            <div key={b.id}>
              <BookCard book={b} compact={width < 550} />
              {tab === 'My library' && (
                <Button
                  title="Read companion"
                  secondary
                  icon="book-outline"
                  onClick={() => setModal({ type: 'reader', id: b.id })}
                  style={{ marginTop: 10, padding: '12px 10px', width: '100%' }}
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={tab === 'Wishlist' ? 'heart-outline' : 'library-outline'}
          title={tab === 'Wishlist' ? 'Room for a little obsession.' : 'Your next chapter is waiting.'}
          text={
            tab === 'Wishlist'
              ? 'Tap the heart on any book to save it here. Your future self will thank you.'
              : 'After a demo checkout, your books and original reading companions will live right here.'
          }
          action="Find your next read"
          onClick={() => navigate('Explore')}
        />
      )}
    </div>
  );
}

export function CollectionsScreen() {
  const { books, palette, dark, width } = useStore();
  const [sel, setSel] = useState<string | null>(null);
  const current = collections.find((c) => c.id === sel);
  const cols = width > 750 ? 2 : 1;

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 1260,
        margin: '0 auto',
        padding: width > 800 ? 42 : 20,
        paddingBottom: 100,
      }}
    >
      <div style={{ marginBottom: 30, display: 'flex', flexDirection: 'column', gap: 13 }}>
        <Txt style={{ color: palette.green, fontSize: 10, letterSpacing: 2 }}>CURATED WITH A LITTLE EXTRA LOVE</Txt>
        <Txt serif style={{ fontSize: 45, letterSpacing: -1 }}>
          {current ? current.title : 'Not just books. A feeling.'}
        </Txt>
        <Txt style={{ color: palette.muted }}>
          {current ? current.subtitle : 'Thoughtful collections for wherever life finds you.'}
        </Txt>
        {current && (
          <div style={{ marginTop: 15, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Pressable
              onClick={() => setSel(null)}
              style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 7 }}
            >
              <Icon name="arrow-back" size={15} />
              <Txt>All collections</Txt>
            </Pressable>
            <div className="lm-scroll-x" style={{ display: 'flex', gap: 16, overflowX: 'auto', padding: '10px 0' }}>
              {current.ids.map((id) => {
                const b = books.find((x) => x.id === id)!;
                return (
                  <div key={id} style={{ width: 190, flexShrink: 0 }}>
                    <BookCard book={b} />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`, gap: '22px 20px' }}>
        {collections.map((c) => (
          <Pressable
            key={c.id}
            onClick={() => {
              setSel(c.id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={({ hovered }) => ({
              display: 'block',
              width: '100%',
              transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
              transition: 'all .2s',
            })}
          >
            <div
              style={{
                backgroundColor: dark ? '#2c372d' : c.color,
                borderRadius: 22,
                border: `1px solid ${palette.border}`,
                padding: 27,
                overflow: 'hidden',
              }}
            >
              <div style={between}>
                <div style={{ padding: 12, backgroundColor: palette.surface, borderRadius: 15, display: 'flex' }}>
                  <Icon name={c.icon} color={palette.green} size={22} />
                </div>
                <Icon name="arrow-up-outline" size={22} color={palette.green} />
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  height: 203,
                  paddingTop: 22,
                }}
              >
                {c.ids.map((id, i) => (
                  <div
                    key={id}
                    style={{
                      marginLeft: i ? -8 : 0,
                      transform: `rotate(${7 * (i - 1)}deg) translateY(${i === 1 ? -8 : 0}px)`,
                    }}
                  >
                    <BookCover book={books.find((b) => b.id === id)!} width={95} height={143} />
                  </div>
                ))}
              </div>
              <Txt serif style={{ fontSize: 29 }}>
                {c.title}
              </Txt>
              <Txt style={{ color: palette.muted, marginTop: 6, fontSize: 12 }}>{c.subtitle}</Txt>
              <Txt style={{ color: palette.green, marginTop: 20, fontSize: 10, letterSpacing: 1 }}>
                {c.count.toUpperCase()}
              </Txt>
            </div>
          </Pressable>
        ))}
      </div>
    </div>
  );
}
