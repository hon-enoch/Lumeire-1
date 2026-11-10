import { useEffect, useState } from 'react';
import { useStore, defaultFilters, type Order } from '../store';
import { money, samplePages, type Book } from '../data';
import {
  BookCover,
  Button,
  Chip,
  EmptyState,
  Icon,
  IconButton,
  Pressable,
  Txt,
  glass,
  inputStyle,
  row,
  between,
  shadow,
} from '../ui';

export function downloadCompanion(b: Book) {
  const text = samplePages(b)
    .map((p, i) => `${b.title} — Reading companion\nPage ${i + 1} of 5\n\n${p.title}\n\n${p.body}`)
    .join('\n\n————————————\n\n');
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `${b.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-lumiere-companion.txt`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function BookDetail({ book }: { book: Book }) {
  const { palette, dark, wishlist, toggleWish, addCart, cart, setModal, owned, width } = useStore();
  const [tab, setTab] = useState<'Overview' | 'Reading guide' | 'Reader notes'>('Overview');
  const [fmt, setFmt] = useState('ePub');
  const inCart = cart.includes(book.id);
  const isOwned = owned.includes(book.id);
  return (
    <>
      <div className="lm-scroll" style={{ overflowY: 'auto', flex: 1, minHeight: 0 }}>
        <div style={{ padding: width > 600 ? 28 : 20 }}>
          <div style={{ display: 'flex', flexDirection: width > 650 ? 'row' : 'column', gap: 30 }}>
            <div
              style={{
                width: width > 650 ? 215 : '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 28,
                borderRadius: 17,
                backgroundColor: dark ? palette.tint : book.color,
                flexShrink: 0,
              }}
            >
              <BookCover book={book} width={142} height={211} style={{ transform: 'rotate(-4deg)' }} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 11 }}>
              <Txt style={{ fontSize: 10, letterSpacing: 1.5, color: palette.green }}>
                {book.category.toUpperCase()}
              </Txt>
              <Txt serif style={{ fontSize: 35, lineHeight: '40px' }}>
                {book.title}
              </Txt>
              <Txt style={{ color: palette.muted }}>by {book.author}</Txt>
              <div style={{ ...row, gap: 5 }}>
                <Icon name="star" size={14} color="#c2944f" />
                <Txt style={{ fontSize: 12, fontWeight: 600 }}>{book.rating}</Txt>
                <Txt style={{ fontSize: 11, color: palette.muted }}>
                  {' '}
                  · {book.reviews.toLocaleString()} sample ratings
                </Txt>
              </div>
              <div style={{ ...row, gap: 9, marginTop: 4 }}>
                <Txt style={{ fontSize: 24, fontWeight: 600 }}>{money(book.price)}</Txt>
                {book.originalPrice && (
                  <Txt style={{ textDecoration: 'line-through', color: palette.muted }}>
                    {money(book.originalPrice)}
                  </Txt>
                )}
              </div>
              <div style={{ ...row, gap: 7, flexWrap: 'wrap' }}>
                {book.formats.map((f) => (
                  <Chip key={f} title={f} active={fmt === f} onClick={() => setFmt(f)} style={{ height: 34, padding: '0 12px' }} />
                ))}
              </div>
              <Pressable
                onClick={() => setModal({ type: 'reader', id: book.id })}
                style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 7, padding: '6px 0' }}
              >
                <Icon name="reader-outline" size={16} color={palette.green} />
                <Txt style={{ color: palette.green, fontSize: 12, textDecoration: 'underline' }}>
                  Read a free 5-page companion
                </Txt>
              </Pressable>
            </div>
          </div>

          <div style={{ ...row, gap: 23, marginTop: 29, borderBottom: `1px solid ${palette.border}` }}>
            {(['Overview', 'Reading guide', 'Reader notes'] as const).map((t) => (
              <Pressable
                key={t}
                onClick={() => setTab(t)}
                style={{
                  paddingBottom: 12,
                  borderBottom: `2px solid ${tab === t ? palette.green : 'transparent'}`,
                  marginBottom: -1,
                }}
              >
                <Txt style={{ fontSize: 12, color: tab === t ? palette.text : palette.muted, fontWeight: tab === t ? 600 : 400 }}>
                  {t}
                </Txt>
              </Pressable>
            ))}
          </div>

          {tab === 'Overview' && (
            <div style={{ paddingTop: 22, display: 'flex', flexDirection: 'column', gap: 17 }}>
              <Txt serif style={{ fontSize: 24 }}>
                A little about this book
              </Txt>
              <Txt style={{ lineHeight: '24px', color: palette.muted, fontSize: 13 }}>{book.description}</Txt>
              <div style={{ ...row, gap: 7, flexWrap: 'wrap' }}>
                {book.tags.map((t) => (
                  <div key={t} style={{ backgroundColor: palette.tint, borderRadius: 5, padding: '5px 9px' }}>
                    <Txt style={{ fontSize: 10, color: palette.green }}>{t}</Txt>
                  </div>
                ))}
              </div>
              <Txt style={{ fontSize: 10, color: palette.muted }}>
                ISBN {book.isbn} · Available formats: {book.formats.join(', ')}
              </Txt>
            </div>
          )}
          {tab === 'Reading guide' && (
            <div style={{ paddingTop: 18, display: 'flex', flexDirection: 'column', gap: 15 }}>
              <Txt style={{ color: palette.muted, fontSize: 12, lineHeight: '20px' }}>
                An editorial reading roadmap, not the publisher’s official chapter index.
              </Txt>
              {book.chapters.map((c, i) => (
                <div key={c} style={{ ...row, gap: 15, borderBottom: `1px solid ${palette.border}`, paddingBottom: 12 }}>
                  <Txt style={{ color: palette.accent, fontSize: 11 }}>{String(i + 1).padStart(2, '0')}</Txt>
                  <Txt style={{ fontSize: 13 }}>{c}</Txt>
                </div>
              ))}
            </div>
          )}
          {tab === 'Reader notes' && (
            <div style={{ paddingTop: 18, display: 'flex', flexDirection: 'column', gap: 15 }}>
              <Txt style={{ color: palette.muted, fontSize: 11 }}>
                Illustrative community reviews · no verified purchases yet
              </Txt>
              {[
                {
                  name: 'Amara O.',
                  review:
                    'One of those books that arrives at just the right moment. I’m already looking forward to reading it again.',
                },
                {
                  name: 'Daniel K.',
                  review:
                    'A thoughtful addition to my reading shelf. There is so much here to sit with and share with a friend.',
                },
              ].map((r) => (
                <div key={r.name} style={{ padding: 17, backgroundColor: palette.tint, borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 9 }}>
                  <div style={between}>
                    <Txt style={{ fontSize: 12, fontWeight: 600 }}>{r.name}</Txt>
                    <Txt style={{ color: '#c2944f', fontSize: 12 }}>★★★★★</Txt>
                  </div>
                  <Txt style={{ fontSize: 12, color: palette.muted, lineHeight: '20px' }}>{r.review}</Txt>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div style={{ padding: 20, borderTop: `1px solid ${palette.border}`, ...row, gap: 10, backgroundColor: palette.solid }}>
        <IconButton
          label="Save book to wishlist"
          name={wishlist.includes(book.id) ? 'heart' : 'heart-outline'}
          onClick={() => toggleWish(book.id)}
          color={palette.accent}
          style={{ border: `1px solid ${palette.border}`, width: 46, height: 46, borderRadius: 12 }}
        />
        <Button
          title={inCart ? 'In your bag' : 'Add to bag'}
          icon={inCart ? 'checkmark' : 'bag-add-outline'}
          secondary
          onClick={() => addCart(book.id)}
          style={{ flex: 1 }}
        />
        <Button
          title={isOwned ? 'Read now' : 'Buy now'}
          icon="arrow-forward"
          onClick={() => {
            if (isOwned) setModal({ type: 'reader', id: book.id });
            else {
              if (!inCart) addCart(book.id);
              setModal({ type: 'cart' });
            }
          }}
          style={{ flex: 1 }}
        />
      </div>
    </>
  );
}

function Reader({ book }: { book: Book }) {
  const { palette, setModal } = useStore();
  const [page, setPage] = useState(0);
  const pages = samplePages(book);
  const p = pages[page];
  return (
    <>
      <div className="lm-scroll" style={{ overflowY: 'auto', flex: 1, minHeight: 0 }}>
        <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 22 }}>
          <Txt style={{ color: palette.green, fontSize: 10, letterSpacing: 2 }}>THE LUMIÈRE READING COMPANION</Txt>
          <Txt serif style={{ fontSize: 34 }}>
            {p.title}
          </Txt>
          <Txt serif style={{ fontSize: 19, lineHeight: '32px' }}>
            {p.body}
          </Txt>
        </div>
      </div>
      <div style={{ padding: '18px 24px', borderTop: `1px solid ${palette.border}`, ...between }}>
        <IconButton name="arrow-back" label="Previous page" onClick={() => setPage((x) => Math.max(0, x - 1))} />
        <Txt style={{ color: palette.muted, fontSize: 12 }}>Page {page + 1} of 5</Txt>
        <IconButton name="arrow-forward" label="Next page" onClick={() => setPage((x) => Math.min(4, x + 1))} />
      </div>
      <div style={{ ...row, gap: 10, padding: '0 24px 20px' }}>
        <Button title="Back to book" secondary onClick={() => setModal({ type: 'book', id: book.id })} style={{ flex: 1 }} />
        <Button title="Download companion" icon="download-outline" onClick={() => downloadCompanion(book)} style={{ flex: 1 }} />
      </div>
    </>
  );
}

function Cart() {
  const { books, cart, removeCart, palette, checkout, setModal, subscribed } = useStore();
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [provider, setProvider] = useState('Stripe');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const items = books.filter((b) => cart.includes(b.id));
  const subtotal = items.reduce((s, b) => s + b.price, 0);
  const total = subtotal * (subscribed ? 0.85 : 1);

  if (step === 2 && order) {
    return (
      <div className="lm-scroll" style={{ overflowY: 'auto', padding: 26 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 13, paddingBottom: 25 }}>
          <div
            style={{
              width: 66,
              height: 66,
              borderRadius: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: palette.tint,
            }}
          >
            <Icon name="checkmark" size={30} color={palette.green} />
          </div>
          <Txt serif style={{ fontSize: 31, textAlign: 'center' }}>
            Happy reading.
          </Txt>
          <Txt style={{ color: palette.muted, textAlign: 'center', fontSize: 13, lineHeight: '22px', maxWidth: 380 }}>
            Your demo order {order.id} is complete. The original Lumière companions for your new books are ready in
            your library.
          </Txt>
        </div>
        {order.ids.map((id) => {
          const b = books.find((x) => x.id === id)!;
          return (
            <div key={id} style={{ ...row, gap: 14, padding: '12px 0', borderTop: `1px solid ${palette.border}` }}>
              <BookCover book={b} width={38} height={56} />
              <div style={{ flex: 1 }}>
                <Txt style={{ fontSize: 13, fontWeight: 600 }}>{b.title}</Txt>
                <Txt style={{ fontSize: 10, color: palette.muted, marginTop: 3 }}>{b.author}</Txt>
              </div>
              <Button title="Read" secondary icon="book-outline" onClick={() => setModal({ type: 'reader', id })} style={{ minHeight: 38, padding: '8px 14px' }} />
            </div>
          );
        })}
        <div style={{ ...between, paddingTop: 16, borderTop: `1px solid ${palette.border}` }}>
          <Txt style={{ color: palette.muted }}>Paid with {order.provider} (preview)</Txt>
          <Txt style={{ fontWeight: 600, fontSize: 18 }}>{money(order.total)}</Txt>
        </div>
        <Button title="Back to the library" icon="arrow-forward" onClick={() => setModal(null)} style={{ marginTop: 20, width: '100%' }} />
      </div>
    );
  }

  if (!items.length)
    return (
      <EmptyState
        icon="bag-outline"
        title="A little room for a good book."
        text="Your bag is empty. Explore the library and add something that speaks to you."
        action="Keep exploring"
        onClick={() => setModal(null)}
      />
    );

  return (
    <div className="lm-scroll" style={{ overflowY: 'auto', padding: 26 }}>
      {step === 1 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 17 }}>
          <Pressable onClick={() => setStep(0)} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 7 }}>
            <Icon name="arrow-back" size={14} />
            <Txt style={{ fontSize: 12 }}>Back to your bag</Txt>
          </Pressable>
          <Txt serif style={{ fontSize: 29 }}>
            Almost your next chapter.
          </Txt>
          <Txt style={{ fontSize: 12, color: palette.muted, lineHeight: '21px' }}>
            This is a checkout preview. Payment providers are not connected, no charges or emails are sent, and only
            original Lumière companions are available for download.
          </Txt>
          <Txt style={{ fontSize: 12, fontWeight: 600, marginTop: 8 }}>Email address</Txt>
          <input
            aria-label="Checkout email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="you@example.com"
            style={{ ...inputStyle(palette), borderColor: err ? palette.accent : palette.border }}
          />
          {!!err && <Txt style={{ color: palette.accent, fontSize: 12 }}>{err}</Txt>}
          <Txt style={{ fontSize: 12, fontWeight: 600, marginTop: 8 }}>Preferred payment method</Txt>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              ['Stripe', 'card-outline', 'Cards & international payments'],
              ['PayPal', 'wallet-outline', 'Your PayPal balance or linked card'],
              ['Paystack', 'phone-portrait-outline', 'Mobile money & regional payments'],
            ].map(([name, ic, desc]) => (
              <Pressable
                key={name}
                onClick={() => setProvider(name)}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 13,
                  padding: 15,
                  border: `1px solid ${provider === name ? palette.green : palette.border}`,
                  backgroundColor: provider === name ? palette.tint : palette.surface,
                  borderRadius: 11,
                  width: '100%',
                }}
              >
                <Icon name={ic} color={palette.green} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <Txt style={{ fontWeight: 600, fontSize: 13 }}>{name}</Txt>
                  <Txt style={{ color: palette.muted, fontSize: 11 }}>{desc}</Txt>
                </div>
                <Icon name={provider === name ? 'radio-button-on' : 'radio-button-off'} color={palette.green} />
              </Pressable>
            ))}
          </div>
        </div>
      ) : (
        <>
          <Txt style={{ color: palette.muted, fontSize: 12 }}>
            {cart.length} {cart.length === 1 ? 'good book' : 'good books'}. Endless possibilities.
          </Txt>
          {items.map((b) => (
            <div key={b.id} style={{ ...row, gap: 14, padding: '14px 0', borderBottom: `1px solid ${palette.border}` }}>
              <BookCover book={b} width={44} height={64} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <Txt style={{ fontSize: 13, fontWeight: 600 }}>{b.title}</Txt>
                <Txt style={{ fontSize: 10, color: palette.muted, marginTop: 3 }}>{b.author}</Txt>
                <Txt style={{ fontSize: 10, color: palette.green, marginTop: 5 }}>{b.formats.join(' · ')}</Txt>
              </div>
              <Txt style={{ fontWeight: 600, fontSize: 13 }}>{money(b.price)}</Txt>
              <IconButton name="trash-outline" size={16} label={`Remove ${b.title}`} onClick={() => removeCart(b.id)} />
            </div>
          ))}
        </>
      )}
      <div style={{ paddingTop: 25, display: 'flex', flexDirection: 'column', gap: 13 }}>
        <div style={between}>
          <Txt style={{ color: palette.muted }}>Subtotal</Txt>
          <Txt>{money(subtotal)}</Txt>
        </div>
        {subscribed && (
          <div style={between}>
            <Txt style={{ color: palette.green }}>Reading circle discount · 15%</Txt>
            <Txt style={{ color: palette.green }}>−{money(0.15 * subtotal)}</Txt>
          </div>
        )}
        <div style={between}>
          <Txt style={{ fontWeight: 600, fontSize: 18 }}>Total</Txt>
          <Txt style={{ fontWeight: 600, fontSize: 20 }}>{money(total)}</Txt>
        </div>
        <Button
          title={step === 0 ? 'Continue to checkout' : 'Complete demo order'}
          icon="arrow-forward"
          loading={busy}
          onClick={
            step === 0
              ? () => setStep(1)
              : () => {
                  if (EMAIL.test(email)) {
                    setErr('');
                    setBusy(true);
                    setTimeout(() => {
                      setOrder(checkout(email, provider));
                      setStep(2);
                      setBusy(false);
                    }, 900);
                  } else setErr('Please enter a valid email for your receipt.');
                }
          }
          style={{ marginTop: 7 }}
        />
        <div style={{ ...row, gap: 6, justifyContent: 'center' }}>
          <Icon name="lock-closed-outline" size={11} color={palette.muted} />
          <Txt style={{ fontSize: 10, color: palette.muted }}>Demo storefront · No real payment will be collected</Txt>
        </div>
      </div>
    </div>
  );
}

function FiltersPane() {
  const { filters, setFilters, setModal, palette } = useStore();
  const [f, setF] = useState(filters);
  return (
    <div className="lm-scroll" style={{ overflowY: 'auto', padding: 26, display: 'flex', flexDirection: 'column', gap: 23 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Txt style={{ fontWeight: 600 }}>Digital format</Txt>
        <div style={{ ...row, gap: 8, flexWrap: 'wrap' }}>
          {['All formats', 'ePub', 'PDF', 'Audiobook'].map((x) => (
            <Chip key={x} title={x} active={f.format === x} onClick={() => setF({ ...f, format: x })} />
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Txt style={{ fontWeight: 600 }}>Your budget</Txt>
        <div style={{ ...row, gap: 8, flexWrap: 'wrap' }}>
          {[10, 13, 15, 25].map((x) => (
            <Chip key={x} title={x === 25 ? 'Any price' : `Under $${x}`} active={f.maxPrice === x} onClick={() => setF({ ...f, maxPrice: x })} />
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Txt style={{ fontWeight: 600 }}>Reader rating</Txt>
        <div style={{ ...row, gap: 8, flexWrap: 'wrap' }}>
          {[0, 4.8, 4.9].map((x) => (
            <Chip key={x} title={x === 0 ? 'All ratings' : `${x} & up`} icon={x ? 'star' : undefined} active={f.minRating === x} onClick={() => setF({ ...f, minRating: x })} />
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Txt style={{ fontWeight: 600 }}>Sort by</Txt>
        {['Curator’s picks', 'Price: low to high', 'Highest rated'].map((x) => (
          <Pressable key={x} onClick={() => setF({ ...f, sort: x })} style={{ ...between, padding: '5px 0', width: '100%' }}>
            <Txt style={{ fontSize: 13, color: palette.muted }}>{x}</Txt>
            <Icon name={f.sort === x ? 'radio-button-on' : 'radio-button-off'} color={palette.green} size={18} />
          </Pressable>
        ))}
      </div>
      <div style={{ ...row, gap: 12 }}>
        <Button title="Reset" secondary onClick={() => setF(defaultFilters)} />
        <Button
          title="Find my next read"
          onClick={() => {
            setFilters(f);
            setModal(null);
          }}
          style={{ flex: 1 }}
        />
      </div>
    </div>
  );
}

function Newsletter() {
  const { palette, subscribed, subscribe, setModal } = useStore();
  const [email, setEmail] = useState('');
  const [err, setErr] = useState('');
  const go = () => (EMAIL.test(email) ? subscribe(email) : setErr('A valid email helps good stories find you.'));
  return (
    <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
      <div style={{ padding: 22, borderRadius: 50, backgroundColor: palette.tint, display: 'flex' }}>
        <Icon name={subscribed ? 'checkmark' : 'mail-open-outline'} color={palette.green} size={33} />
      </div>
      <Txt serif style={{ fontSize: 33, textAlign: 'center' }}>
        {subscribed ? 'You’re in good company.' : 'For the love of a good book.'}
      </Txt>
      <Txt style={{ color: palette.muted, textAlign: 'center', lineHeight: '23px', fontSize: 13 }}>
        {subscribed
          ? 'Your 15% reading circle discount will be applied automatically to your demo order. Here’s to your next chapter.'
          : 'Join our reading circle for thoughtful recommendations, hidden gems, and 15% off your first order.'}
      </Txt>
      {!subscribed && (
        <>
          <input
            aria-label="Newsletter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && go()}
            type="email"
            placeholder="Your email address"
            style={inputStyle(palette)}
          />
          {!!err && <Txt style={{ color: palette.accent, fontSize: 12 }}>{err}</Txt>}
          <Button title="Save my seat in the circle" icon="arrow-forward" onClick={go} style={{ width: '100%' }} />
          <Txt style={{ fontSize: 10, color: palette.muted, textAlign: 'center' }}>
            Preview signup is saved on this device. No email is sent.
          </Txt>
        </>
      )}
      {subscribed && <Button title="Find my next read" onClick={() => setModal(null)} />}
    </div>
  );
}

function Account({ onAdmin, onShelf }: { onAdmin: () => void; onShelf: () => void }) {
  const { palette, wishlist, owned, orders, setModal } = useStore();
  return (
    <div className="lm-scroll" style={{ overflowY: 'auto', padding: 26 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 20 }}>
        <Txt serif style={{ fontSize: 30 }}>
          Hello, fellow reader.
        </Txt>
        <Txt style={{ color: palette.muted, lineHeight: '23px', fontSize: 13 }}>
          Your reading life, kept close. Your shelf and order history are saved on this device.
        </Txt>
        <div style={{ ...row, gap: 12 }}>
          {[
            [wishlist.length, 'saved books'],
            [owned.length, 'in your library'],
            [orders.length, 'demo orders'],
          ].map(([n, label]) => (
            <div key={label} style={{ flex: 1, padding: 17, backgroundColor: palette.tint, borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Txt serif style={{ fontSize: 27 }}>
                {n}
              </Txt>
              <Txt style={{ color: palette.muted, fontSize: 10 }}>{label}</Txt>
            </div>
          ))}
        </div>
        <Button
          title="Go to my reading shelf"
          icon="library-outline"
          onClick={() => {
            setModal(null);
            onShelf();
          }}
        />
        <Txt style={{ fontSize: 13, fontWeight: 600, marginTop: 10 }}>Your order history</Txt>
        {!orders.length && (
          <Txt style={{ color: palette.muted, fontSize: 12 }}>Your first bookish adventure is yet to come.</Txt>
        )}
      </div>
      {orders.map((o) => (
        <div key={o.id} style={{ padding: 15, border: `1px solid ${palette.border}`, borderRadius: 12, marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={between}>
            <Txt style={{ fontWeight: 600, fontSize: 12 }}>{o.id}</Txt>
            <Txt style={{ fontSize: 12 }}>{money(o.total)}</Txt>
          </div>
          <Txt style={{ fontSize: 11, color: palette.muted }}>
            {o.ids.length} books · {new Date(o.date).toLocaleDateString()} · Demo complete
          </Txt>
        </div>
      ))}
      <Pressable
        onClick={() => {
          setModal(null);
          onAdmin();
        }}
        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'center', paddingTop: 25, width: '100%' }}
      >
        <Icon name="lock-closed-outline" size={13} color={palette.muted} />
        <Txt style={{ fontSize: 11, color: palette.muted }}>Store owner? Open the management desk</Txt>
        <Icon name="arrow-forward" size={13} color={palette.muted} />
      </Pressable>
    </div>
  );
}

export function CommerceModals({ onAdmin, onShelf }: { onAdmin: () => void; onShelf: () => void }) {
  const { modal, setModal, books, palette, width } = useStore();
  const book = modal && 'id' in modal ? books.find((b) => b.id === modal.id) : undefined;

  useEffect(() => {
    if (!modal) return;
    const h = (e: KeyboardEvent) => e.key === 'Escape' && setModal(null);
    window.addEventListener('keydown', h);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', h);
      document.body.style.overflow = prev;
    };
  }, [modal, setModal]);

  if (!modal) return null;
  const title =
    modal.type === 'book'
      ? 'A closer look'
      : modal.type === 'reader'
        ? 'A little light reading'
        : modal.type === 'cart'
          ? 'Your book bag'
          : modal.type === 'filters'
            ? 'Find your kind of book'
            : modal.type === 'account'
              ? 'Your reader space'
              : 'The reading circle';
  const wide = modal.type === 'book' || modal.type === 'reader';

  return (
    <div
      className="lm-fade-in-fast"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: width > 600 ? 25 : 10,
      }}
    >
      <div
        aria-label="Close dialog"
        onClick={() => setModal(null)}
        style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(21,30,23,.40)', ...glass }}
      />
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: wide ? 770 : 550,
          maxHeight: '90vh',
          backgroundColor: palette.solid,
          borderRadius: 23,
          border: `1px solid ${palette.border}`,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          ...shadow,
          boxShadow: '0 24px 60px rgba(20,30,22,.25)',
        }}
      >
        <div style={{ ...between, padding: '14px 23px', borderBottom: `1px solid ${palette.border}`, flexShrink: 0 }}>
          <div style={{ ...row, gap: 9 }}>
            <Icon name={modal.type === 'cart' ? 'bag-outline' : 'book-outline'} size={17} color={palette.green} />
            <Txt style={{ fontSize: 13, fontWeight: 600 }}>{title}</Txt>
          </div>
          <IconButton name="close" label="Close" onClick={() => setModal(null)} size={21} />
        </div>
        {modal.type === 'book' && book && <BookDetail key={book.id} book={book} />}
        {modal.type === 'reader' && book && <Reader key={book.id} book={book} />}
        {modal.type === 'cart' && <Cart />}
        {modal.type === 'filters' && <FiltersPane />}
        {modal.type === 'newsletter' && <Newsletter />}
        {modal.type === 'account' && <Account onAdmin={onAdmin} onShelf={onShelf} />}
      </div>
    </div>
  );
}
