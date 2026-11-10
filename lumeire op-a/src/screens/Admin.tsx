import { useEffect, useState } from 'react';
import { useStore, DEFAULT_PROMO } from '../store';
import { money, type Book } from '../data';
import { BookCover, Button, Chip, EmptyState, Icon, IconButton, Txt, glass, inputStyle, row, between } from '../ui';

type Section = 'Overview' | 'Catalog' | 'Orders' | 'Storefront';

export function AdminScreen({ onBack }: { onBack: () => void }) {
  const { palette, books, updateBook, orders, promo, setPromo, notify, width } = useStore();
  const [authed, setAuthed] = useState(false);
  const [email, setEmail] = useState('owner@lumiere.books');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);
  const [section, setSection] = useState<Section>('Overview');
  const [editing, setEditing] = useState<Book | null>(null);
  const [ePrice, setEPrice] = useState('');
  const [eTitle, setETitle] = useState('');
  const [eAuthor, setEAuthor] = useState('');
  const [banner, setBanner] = useState(promo);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!authed) return;
    const t = setTimeout(() => {
      setAuthed(false);
      setPw('');
      notify('Your preview owner session has expired.');
    }, 900000);
    return () => clearTimeout(t);
  }, [authed, notify]);

  const login = () => {
    if (Date.now() < lockedUntil) {
      setErr('Too many attempts. Please wait 30 seconds and try again.');
      return;
    }
    if (email.trim().toLowerCase() === 'enochantwi2297@gmail.com'&& pw === 'Lumiere2026!') {
      setAuthed(true);
      setErr('');
      setAttempts(0);
      setPw('');
    } else {
      setAttempts((a) => a + 1);
      if (attempts >= 4) {
        setLockedUntil(Date.now() + 30000);
        setAttempts(0);
      }
      setErr('The email or preview password is incorrect.');
    }
  };

  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const pad = width > 700 ? 36 : 20;

  const header = (
    <div
      style={{
        ...row,
        gap: 12,
        height: 64,
        padding: `0 ${pad}px`,
        borderBottom: `1px solid ${palette.border}`,
        backgroundColor: palette.bg,
        position: 'sticky',
        top: 0,
        zIndex: 20,
      }}
    >
      <IconButton name="arrow-back" label="Back to storefront" onClick={onBack} />
      <Txt serif style={{ fontSize: 24 }}>
        The owner’s desk
      </Txt>
    </div>
  );

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: palette.bg }}>
        {header}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, minHeight: 'calc(100vh - 64px)' }}>
          <div
            style={{
              width: '100%',
              maxWidth: 420,
              padding: 30,
              backgroundColor: palette.solid,
              borderRadius: 20,
              border: `1px solid ${palette.border}`,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div style={{ padding: 14, backgroundColor: palette.tint, borderRadius: 14, alignSelf: 'flex-start', display: 'flex' }}>
              <Icon name="lock-closed-outline" size={22} color={palette.green} />
            </div>
            <Txt style={{ color: palette.green, fontSize: 10, letterSpacing: 1.5 }}>LUMIÈRE · OWNER DESK</Txt>
            <Txt serif style={{ fontSize: 31 }}>
              Welcome back, bookseller.
            </Txt>
            <Txt style={{ color: palette.muted, fontSize: 12, lineHeight: '20px' }}>
              Sign in to the preview workspace. Demo credentials: <b>owner@lumiere.books</b> / <b>Lumiere2026!</b>
            </Txt>
            <input
              aria-label="Owner email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              style={inputStyle(palette)}
            />
            <input
              aria-label="Preview password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && login()}
              placeholder="Preview password"
              type="password"
              style={inputStyle(palette)}
            />
            {!!err && <Txt style={{ color: palette.accent, fontSize: 12 }}>{err}</Txt>}
            <Button title="Open the desk" icon="arrow-forward" onClick={login} />
            <Txt style={{ fontSize: 10, color: palette.muted, textAlign: 'center' }}>
              Preview only · No live payments or protected assets are connected.
            </Txt>
          </div>
        </div>
      </div>
    );
  }

  const filteredBooks = books.filter((b) => `${b.title} ${b.author}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ minHeight: '100vh', backgroundColor: palette.bg }}>
      {header}
      <div style={{ width: '100%', maxWidth: 1180, margin: '0 auto', padding: pad, paddingBottom: 90, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={between}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Txt style={{ color: palette.green, fontSize: 10, letterSpacing: 1.5 }}>LUMIÈRE · OWNER DESK</Txt>
            <Txt serif style={{ fontSize: width > 600 ? 41 : 31 }}>
              Behind every good story.
            </Txt>
            <Txt style={{ color: palette.muted, fontSize: 12 }}>Your store, thoughtfully managed.</Txt>
          </div>
          <IconButton
            name="log-out-outline"
            label="Sign out of owner desk"
            onClick={() => {
              setAuthed(false);
              setPw('');
            }}
          />
        </div>
        <div style={{ padding: 12, backgroundColor: palette.tint, borderRadius: 10, ...row, gap: 9 }}>
          <Icon name="information-circle-outline" size={17} color={palette.green} />
          <Txt style={{ flex: 1, fontSize: 11, lineHeight: '18px', color: palette.muted }}>
            Preview workspace · Changes and demo orders live on this device. No live payments or protected assets are
            connected. Session expires after 15 minutes.
          </Txt>
        </div>
        <div className="lm-scroll-x" style={{ display: 'flex', gap: 10, overflowX: 'auto' }}>
          {(['Overview', 'Catalog', 'Orders', 'Storefront'] as Section[]).map((s) => (
            <Chip
              key={s}
              title={s}
              active={section === s}
              icon={{ Overview: 'stats-chart-outline', Catalog: 'library-outline', Orders: 'receipt-outline', Storefront: 'color-palette-outline' }[s]}
              onClick={() => setSection(s)}
            />
          ))}
        </div>

        {section === 'Overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 23 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
              {[
                [money(revenue), 'Demo sales', 'wallet-outline'],
                [orders.length, 'Completed orders', 'bag-check-outline'],
                [books.filter((b) => !b.hidden).length, 'Live catalog titles', 'book-outline'],
                [orders.length ? money(revenue / orders.length) : '$0.00', 'Average order', 'analytics-outline'],
              ].map(([v, label, ic]) => (
                <div
                  key={String(label)}
                  style={{
                    flexGrow: 1,
                    flexBasis: width > 700 ? '22%' : '44%',
                    padding: 22,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 13,
                    backgroundColor: palette.surface,
                    border: `1px solid ${palette.border}`,
                    borderRadius: 16,
                  }}
                >
                  <Icon name={String(ic)} color={palette.green} size={19} />
                  <Txt serif style={{ fontSize: 32 }}>
                    {v}
                  </Txt>
                  <Txt style={{ color: palette.muted, fontSize: 11 }}>{label}</Txt>
                </div>
              ))}
            </div>
            <div style={{ padding: 25, backgroundColor: palette.surface, border: `1px solid ${palette.border}`, borderRadius: 17 }}>
              <div style={between}>
                <Txt serif style={{ fontSize: 25 }}>
                  Sales at a glance
                </Txt>
                <Txt style={{ color: palette.muted, fontSize: 10 }}>Last 7 days · Demo data</Txt>
              </div>
              {orders.length ? (
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', height: 190, gap: 15, paddingTop: 25 }}>
                  {Array.from({ length: 7 }, (_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - (6 - i));
                    const v = orders
                      .filter((o) => new Date(o.date).toDateString() === d.toDateString())
                      .reduce((s, o) => s + o.total, 0);
                    return (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9, justifyContent: 'flex-end' }}>
                        <Txt style={{ fontSize: 10, color: palette.muted }}>{money(v)}</Txt>
                        <div style={{ height: Math.max(4, (v / Math.max(revenue, 1)) * 120), width: '65%', backgroundColor: palette.green, borderRadius: 5 }} />
                        <Txt style={{ fontSize: 10, color: palette.muted }}>{d.toLocaleDateString('en', { weekday: 'short' })}</Txt>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyState
                  icon="trending-up-outline"
                  title="Your story starts here."
                  text="Complete a demo order in the storefront to see your sales and order analytics come to life."
                  action="Visit storefront"
                  onClick={onBack}
                />
              )}
            </div>
            <div style={{ ...row, gap: 14, flexWrap: 'wrap' }}>
              <Button title="Manage the catalog" secondary icon="library-outline" onClick={() => setSection('Catalog')} />
              <Button title="Customize your banner" secondary icon="color-palette-outline" onClick={() => setSection('Storefront')} />
            </div>
          </div>
        )}

        {section === 'Catalog' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
            <div style={between}>
              <Txt serif style={{ fontSize: 27 }}>
                A well-kept library.
              </Txt>
              <Txt style={{ color: palette.muted, fontSize: 12 }}>{books.length} titles</Txt>
            </div>
            <input
              aria-label="Search inventory"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your inventory…"
              style={inputStyle(palette)}
            />
            <Txt style={{ color: palette.muted, fontSize: 11 }}>Edit metadata and prices, or hide a title from your storefront.</Txt>
            {filteredBooks.length ? (
              filteredBooks.map((b) => (
                <div key={b.id} style={{ ...row, gap: 16, padding: '17px 0', borderBottom: `1px solid ${palette.border}`, opacity: b.hidden ? 0.55 : 1 }}>
                  <BookCover book={b} width={38} height={56} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5, minWidth: 0 }}>
                    <Txt style={{ fontSize: 13, fontWeight: 600 }}>{b.title}</Txt>
                    <Txt style={{ color: palette.muted, fontSize: 10 }}>
                      {b.author} · {b.hidden ? 'Hidden' : 'Published'}
                    </Txt>
                  </div>
                  <Txt style={{ fontSize: 12 }}>{money(b.price)}</Txt>
                  <IconButton
                    name="create-outline"
                    label={`Edit ${b.title}`}
                    onClick={() => {
                      setEditing(b);
                      setETitle(b.title);
                      setEAuthor(b.author);
                      setEPrice(String(b.price));
                      setErr('');
                    }}
                  />
                  <IconButton
                    name={b.hidden ? 'eye-off-outline' : 'eye-outline'}
                    label={`${b.hidden ? 'Publish' : 'Hide'} ${b.title}`}
                    onClick={() => updateBook(b.id, { hidden: !b.hidden })}
                  />
                </div>
              ))
            ) : (
              <EmptyState title="No titles found" text="Try another title or author." />
            )}
          </div>
        )}

        {section === 'Orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
            <Txt serif style={{ fontSize: 27 }}>
              Every new chapter.
            </Txt>
            {orders.length ? (
              orders.map((o) => (
                <div key={o.id} style={{ padding: 20, backgroundColor: palette.surface, borderRadius: 13, border: `1px solid ${palette.border}`, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={between}>
                    <Txt style={{ fontWeight: 600 }}>{o.id}</Txt>
                    <Txt style={{ color: palette.green, fontSize: 10 }}>DEMO FULFILLED</Txt>
                  </div>
                  <Txt style={{ color: palette.muted, fontSize: 12 }}>
                    {o.email} · {new Date(o.date).toLocaleDateString()}
                  </Txt>
                  <Txt style={{ fontSize: 12 }}>{o.ids.map((id) => books.find((b) => b.id === id)?.title).join(' · ')}</Txt>
                  <div style={between}>
                    <Txt style={{ fontSize: 12 }}>{o.provider} preview · No charge</Txt>
                    <Txt style={{ fontWeight: 600 }}>{money(o.total)}</Txt>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                icon="receipt-outline"
                title="The first chapter is still ahead."
                text="Demo checkout orders will appear here with item details, totals, and fulfillment status."
              />
            )}
          </div>
        )}

        {section === 'Storefront' && (
          <div style={{ maxWidth: 680, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Txt serif style={{ fontSize: 28 }}>
              Make your welcome a little warmer.
            </Txt>
            <Txt style={{ color: palette.muted, fontSize: 12, lineHeight: '21px' }}>
              Update the announcement that appears above your library. Changes are immediately reflected in this
              device’s storefront.
            </Txt>
            <Txt style={{ fontWeight: 600, fontSize: 12 }}>Announcement banner</Txt>
            <textarea
              aria-label="Announcement text"
              value={banner}
              onChange={(e) => setBanner(e.target.value.slice(0, 130))}
              maxLength={130}
              style={{ ...inputStyle(palette), minHeight: 110, resize: 'vertical' }}
            />
            <Txt style={{ color: palette.muted, fontSize: 10, textAlign: 'right' }}>{banner.length}/130 characters</Txt>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              <Txt style={{ color: palette.green, fontSize: 10, letterSpacing: 1 }}>LIVE PREVIEW</Txt>
              <div style={{ padding: 17, borderRadius: 10, backgroundColor: palette.tint }}>
                <Txt style={{ color: palette.green, textAlign: 'center', fontSize: 12 }}>
                  {banner || 'Your announcement will appear here.'}
                </Txt>
              </div>
            </div>
            <div style={{ ...row, gap: 10 }}>
              <Button
                title="Publish announcement"
                icon="checkmark"
                disabled={!banner.trim()}
                onClick={() => {
                  setPromo(banner.trim());
                  notify('Your new welcome is live on this device.');
                }}
              />
              <Button title="Reset" secondary onClick={() => setBanner(DEFAULT_PROMO)} />
            </div>
          </div>
        )}
      </div>

      {editing && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            backgroundColor: 'rgba(20,30,22,.4)',
            zIndex: 300,
            ...glass,
          }}
          onClick={() => setEditing(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ padding: 27, width: '100%', maxWidth: 450, backgroundColor: palette.solid, borderRadius: 20, display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            <div style={between}>
              <Txt serif style={{ fontSize: 29 }}>
                A little fine-tuning.
              </Txt>
              <IconButton name="close" label="Close editor" onClick={() => setEditing(null)} />
            </div>
            <Txt style={{ fontSize: 12, fontWeight: 600 }}>Title</Txt>
            <input value={eTitle} onChange={(e) => setETitle(e.target.value)} style={inputStyle(palette)} />
            <Txt style={{ fontSize: 12, fontWeight: 600 }}>Author</Txt>
            <input value={eAuthor} onChange={(e) => setEAuthor(e.target.value)} style={inputStyle(palette)} />
            <Txt style={{ fontSize: 12, fontWeight: 600 }}>Price (USD)</Txt>
            <input value={ePrice} onChange={(e) => setEPrice(e.target.value)} type="number" step="0.01" style={inputStyle(palette)} />
            {!!err && <Txt style={{ color: palette.accent, fontSize: 12 }}>{err}</Txt>}
            <div style={{ ...row, gap: 10 }}>
              <Button title="Cancel" secondary onClick={() => setEditing(null)} />
              <Button
                title="Save changes"
                icon="checkmark"
                style={{ flex: 1 }}
                onClick={() => {
                  const p = parseFloat(ePrice);
                  if (!eTitle.trim() || !eAuthor.trim()) return setErr('Title and author are required.');
                  if (!(p > 0 && p < 1000)) return setErr('Please enter a valid price.');
                  updateBook(editing.id, { title: eTitle.trim(), author: eAuthor.trim(), price: Math.round(p * 100) / 100 });
                  setEditing(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
