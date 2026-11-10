import { useState } from 'react';
import { StoreProvider, useStore, type Tab } from './store';
import { Icon, IconButton, Pressable, Spinner, Txt, glass, row, between } from './ui';
import { CatalogScreen } from './screens/Catalog';
import { CollectionsScreen, ShelfScreen } from './screens/Shelf';
import { CommerceModals } from './screens/Modals';
import { Curator } from './screens/Curator';
import { AdminScreen } from './screens/Admin';

const TABS: Tab[] = ['Discover', 'Explore', 'Collections', 'My Shelf'];
const TAB_ICONS: Record<Tab, string> = {
  Discover: 'compass-outline',
  Explore: 'search-outline',
  Collections: 'albums-outline',
  'My Shelf': 'library-outline',
};

function Header() {
  const { width, palette, dark, toggleTheme, setModal, cart, wishlist, promo, tab, navigate } = useStore();
  const [showBanner, setShowBanner] = useState(true);
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 50 }}>
      {showBanner && (
        <div
          style={{
            backgroundColor: dark ? '#293425' : '#eaf0e3',
            minHeight: 31,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '7px 40px',
            position: 'relative',
          }}
        >
          <Pressable
            onClick={() => setModal({ type: 'newsletter' })}
            style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 7, minWidth: 0 }}
          >
            <Icon name="sparkles-outline" size={11} color={palette.green} />
            <Txt
              lines={1}
              style={{ fontSize: width < 600 ? 8 : 10, color: palette.darkGreen, letterSpacing: 0.15, whiteSpace: 'nowrap' }}
            >
              {promo}{' '}
              <span style={{ textDecoration: 'underline', fontWeight: 600 }}>A little welcome gift</span>{' '}
              <Icon name="arrow-forward" size={10} color={palette.darkGreen} />
            </Txt>
          </Pressable>
          <Pressable
            onClick={() => setShowBanner(false)}
            label="Dismiss announcement"
            style={{ position: 'absolute', right: width > 800 ? 42 : 14, top: 8, display: 'flex' }}
          >
            <Icon name="close-outline" size={13} color={palette.green} />
          </Pressable>
        </div>
      )}
      <div style={{ backgroundColor: palette.glass, borderBottom: `1px solid ${palette.border}`, ...glass }}>
        <div
          style={{
            ...between,
            height: width > 800 ? 83 : 72,
            width: '100%',
            maxWidth: 1320,
            padding: `0 ${width > 900 ? 48 : 20}px`,
            margin: '0 auto',
            gap: 20,
          }}
        >
          <Pressable
            onClick={() => navigate('Discover')}
            label="Lumière home"
            style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}
          >
            <div style={{ width: 32, height: 35, display: 'flex', alignItems: 'center', position: 'relative' }}>
              <Icon name="book-outline" size={30} color={palette.green} />
              <div style={{ position: 'absolute', left: 14, top: 0, width: 4, height: 4, backgroundColor: palette.accent, borderRadius: 3 }} />
            </div>
            <div>
              <Txt serif style={{ fontSize: width > 900 ? 32 : 28, letterSpacing: -1, lineHeight: 1.1 }}>
                lumière<span style={{ color: palette.accent, fontSize: 32 }}>.</span>
              </Txt>
              <Txt style={{ color: palette.muted, fontSize: 6.8, letterSpacing: 2.1, marginTop: -2 }}>
                THE DIGITAL BOOK ATELIER
              </Txt>
            </div>
          </Pressable>
          {width >= 800 && (
            <div style={{ ...row, gap: width > 1100 ? 35 : 23, marginLeft: 30, flex: 1 }}>
              {TABS.map((t) => (
                <Pressable
                  key={t}
                  onClick={() => navigate(t)}
                  style={{ padding: '27px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}
                >
                  <Txt style={{ color: tab === t ? palette.text : palette.muted, fontSize: 12, fontWeight: tab === t ? 600 : 400 }}>
                    {t}
                  </Txt>
                  {tab === t && (
                    <div style={{ width: 4, height: 4, borderRadius: 4, backgroundColor: palette.accent, position: 'absolute', bottom: 15 }} />
                  )}
                </Pressable>
              ))}
            </div>
          )}
          <div style={{ ...row, gap: width > 1000 ? 11 : 3 }}>
            <IconButton
              name={dark ? 'moon-outline' : 'sunny-outline'}
              label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              onClick={toggleTheme}
              size={19}
            />
            {width > 900 && <div style={{ width: 1, height: 19, backgroundColor: palette.border, margin: '0 4px' }} />}
            {width > 600 && (
              <div style={{ position: 'relative' }}>
                <IconButton name="heart-outline" label="Open wishlist" onClick={() => navigate('My Shelf')} size={20} />
                {wishlist.length > 0 && <Badge n={wishlist.length} />}
              </div>
            )}
            <div style={{ position: 'relative' }}>
              <IconButton name="bag-outline" label="Open book bag" onClick={() => setModal({ type: 'cart' })} size={19} />
              {cart.length > 0 && <Badge n={cart.length} />}
            </div>
            <IconButton
              name="person-outline"
              label="Open reader account"
              onClick={() => setModal({ type: 'account' })}
              size={16}
              color={palette.green}
              style={{ backgroundColor: dark ? '#344330' : '#eef0e4', width: 32, height: 32, marginLeft: width > 600 ? 9 : 2 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Badge({ n }: { n: number }) {
  const { palette } = useStore();
  return (
    <div
      style={{
        position: 'absolute',
        top: 2,
        right: 0,
        width: 15,
        height: 15,
        borderRadius: 8,
        backgroundColor: palette.accent,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <Txt style={{ color: '#fff', fontSize: 8 }}>{n}</Txt>
    </div>
  );
}

function TabBar() {
  const { palette, tab, navigate, width } = useStore();
  if (width >= 800) return null;
  return (
    <div
      style={{
        ...row,
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: palette.glass,
        borderTop: `1px solid ${palette.border}`,
        padding: '9px 0 13px',
        zIndex: 60,
        ...glass,
      }}
    >
      {TABS.map((t) => (
        <Pressable
          key={t}
          onClick={() => navigate(t)}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}
        >
          <Icon name={TAB_ICONS[t]} size={21} color={tab === t ? palette.green : palette.muted} />
          <Txt style={{ fontSize: 9, fontWeight: tab === t ? 600 : 400, color: tab === t ? palette.green : palette.muted }}>
            {t}
          </Txt>
        </Pressable>
      ))}
    </div>
  );
}

function Toast() {
  const { toast, palette, dark, width } = useStore();
  if (!toast) return null;
  const fg = dark ? '#263023' : '#fff';
  return (
    <div
      className="lm-fade-in-fast"
      style={{
        position: 'fixed',
        top: width > 800 ? 127 : 113,
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: palette.darkGreen,
        borderRadius: 12,
        padding: '13px 19px',
        display: 'flex',
        flexDirection: 'row',
        gap: 9,
        alignItems: 'center',
        maxWidth: '90%',
        zIndex: 150,
        boxShadow: '0 4px 12px rgba(0,0,0,.1)',
        pointerEvents: 'none',
      }}
    >
      <Icon name="checkmark-circle-outline" size={16} color={fg} />
      <Txt style={{ color: fg, fontSize: 12 }}>{toast}</Txt>
    </div>
  );
}

function Main() {
  const { palette, dark, tab, width, navigate, setScreen } = useStore();
  return (
    <div style={{ minHeight: '100vh', backgroundColor: palette.bg, position: 'relative' }}>
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: dark
              ? 'linear-gradient(115deg,#171c19 0%,#252d22 50%,#171c19 100%)'
              : 'linear-gradient(115deg,#fcfaf6 0%,#f4f6ed 50%,#fafbf8 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: '4%',
            top: 120,
            width: 430,
            height: 340,
            borderRadius: 300,
            backgroundColor: dark ? 'rgba(134,157,75,.06)' : 'rgba(215,226,187,.16)',
            filter: 'blur(65px)',
          }}
        />
      </div>
      <div style={{ position: 'relative', zIndex: 1, paddingBottom: width < 800 ? 70 : 0 }}>
        <Header />
        <div key={tab} className="lm-fade-in-fast">
          {tab === 'Discover' && <CatalogScreen discover />}
          {tab === 'Explore' && <CatalogScreen discover={false} />}
          {tab === 'Collections' && <CollectionsScreen />}
          {tab === 'My Shelf' && <ShelfScreen />}
        </div>
      </div>
      <TabBar />
      <Curator />
      <CommerceModals onAdmin={() => setScreen('Admin')} onShelf={() => navigate('My Shelf')} />
      <Toast />
    </div>
  );
}

function Root() {
  const { palette, ready, screen, setScreen } = useStore();
  if (!ready) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: palette.bg,
          gap: 17,
        }}
      >
        <Txt serif style={{ fontSize: 39 }}>
          lumière.
        </Txt>
        <Spinner color={palette.green} />
      </div>
    );
  }
  if (screen === 'Admin') {
    return (
      <>
        <AdminScreen onBack={() => setScreen('Main')} />
        <Toast />
      </>
    );
  }
  return <Main />;
}

export default function App() {
  return (
    <StoreProvider>
      <Root />
    </StoreProvider>
  );
}
