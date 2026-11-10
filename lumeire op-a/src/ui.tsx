import React, { useState } from 'react';
import type { IconType } from 'react-icons';
import {
  IoGridOutline,
  IoBookOutline,
  IoLeafOutline,
  IoPencilOutline,
  IoSchoolOutline,
  IoEarthOutline,
  IoDiamondOutline,
  IoSearchOutline,
  IoClose,
  IoCloseOutline,
  IoArrowForward,
  IoArrowBack,
  IoArrowUp,
  IoArrowUpOutline,
  IoSparklesOutline,
  IoHeart,
  IoHeartOutline,
  IoStar,
  IoAdd,
  IoCheckmark,
  IoCheckmarkCircleOutline,
  IoBagOutline,
  IoBagAddOutline,
  IoBagCheckOutline,
  IoPersonOutline,
  IoPerson,
  IoSunnyOutline,
  IoMoonOutline,
  IoLibraryOutline,
  IoCompassOutline,
  IoAlbumsOutline,
  IoOptionsOutline,
  IoFlashOutline,
  IoRibbonOutline,
  IoMailOpenOutline,
  IoShieldCheckmarkOutline,
  IoCloudDownloadOutline,
  IoPhonePortraitOutline,
  IoReaderOutline,
  IoDownloadOutline,
  IoTrashOutline,
  IoCardOutline,
  IoWalletOutline,
  IoRadioButtonOn,
  IoRadioButtonOff,
  IoLockClosedOutline,
  IoLogOutOutline,
  IoInformationCircleOutline,
  IoStatsChartOutline,
  IoReceiptOutline,
  IoColorPaletteOutline,
  IoAnalyticsOutline,
  IoTrendingUpOutline,
  IoCreateOutline,
  IoEyeOutline,
  IoEyeOffOutline,
  IoRemove,
  IoChevronUp,
} from 'react-icons/io5';
import { useStore } from './store';
import type { Book } from './data';
import { money } from './data';

const icons: Record<string, IconType> = {
  'grid-outline': IoGridOutline,
  'book-outline': IoBookOutline,
  'leaf-outline': IoLeafOutline,
  'pencil-outline': IoPencilOutline,
  feather: IoPencilOutline,
  'school-outline': IoSchoolOutline,
  'earth-outline': IoEarthOutline,
  'diamond-outline': IoDiamondOutline,
  'search-outline': IoSearchOutline,
  close: IoClose,
  'close-outline': IoCloseOutline,
  'arrow-forward': IoArrowForward,
  'arrow-back': IoArrowBack,
  'arrow-up': IoArrowUp,
  'arrow-up-outline': IoArrowUpOutline,
  'sparkles-outline': IoSparklesOutline,
  heart: IoHeart,
  'heart-outline': IoHeartOutline,
  star: IoStar,
  add: IoAdd,
  checkmark: IoCheckmark,
  'checkmark-circle-outline': IoCheckmarkCircleOutline,
  'bag-outline': IoBagOutline,
  'bag-add-outline': IoBagAddOutline,
  'bag-check-outline': IoBagCheckOutline,
  'person-outline': IoPersonOutline,
  person: IoPerson,
  'sunny-outline': IoSunnyOutline,
  'moon-outline': IoMoonOutline,
  'library-outline': IoLibraryOutline,
  'compass-outline': IoCompassOutline,
  'albums-outline': IoAlbumsOutline,
  'options-outline': IoOptionsOutline,
  'flash-outline': IoFlashOutline,
  'ribbon-outline': IoRibbonOutline,
  'mail-open-outline': IoMailOpenOutline,
  'shield-checkmark-outline': IoShieldCheckmarkOutline,
  'cloud-download-outline': IoCloudDownloadOutline,
  'phone-portrait-outline': IoPhonePortraitOutline,
  'reader-outline': IoReaderOutline,
  'download-outline': IoDownloadOutline,
  'trash-outline': IoTrashOutline,
  'card-outline': IoCardOutline,
  'wallet-outline': IoWalletOutline,
  'radio-button-on': IoRadioButtonOn,
  'radio-button-off': IoRadioButtonOff,
  'lock-closed-outline': IoLockClosedOutline,
  'log-out-outline': IoLogOutOutline,
  'information-circle-outline': IoInformationCircleOutline,
  'stats-chart-outline': IoStatsChartOutline,
  'receipt-outline': IoReceiptOutline,
  'color-palette-outline': IoColorPaletteOutline,
  'analytics-outline': IoAnalyticsOutline,
  'trending-up-outline': IoTrendingUpOutline,
  'create-outline': IoCreateOutline,
  'eye-outline': IoEyeOutline,
  'eye-off-outline': IoEyeOffOutline,
  remove: IoRemove,
  'chevron-up': IoChevronUp,
};

export const glass: React.CSSProperties = {
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
};
export const shadow: React.CSSProperties = {
  boxShadow: '0 8px 24px rgba(59,73,50,0.06)',
};
export const row: React.CSSProperties = { display: 'flex', flexDirection: 'row', alignItems: 'center' };
export const between: React.CSSProperties = { ...row, justifyContent: 'space-between' };

export function Icon({ name, size = 20, color }: { name: string; size?: number; color?: string }) {
  const { palette } = useStore();
  const C = icons[name] || IoBookOutline;
  return <C size={size} color={color || palette.text} style={{ flexShrink: 0 }} />;
}

export function Txt({
  children,
  style,
  serif,
  lines,
  className,
  onClick,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  serif?: boolean;
  lines?: number;
  className?: string;
  onClick?: () => void;
}) {
  const { palette } = useStore();
  const clamp: React.CSSProperties = lines
    ? { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }
    : {};
  return (
    <span
      onClick={onClick}
      className={className}
      style={{
        fontFamily: serif ? "'DM Serif Display', Georgia, serif" : "'DM Sans', system-ui, sans-serif",
        fontSize: 14,
        color: palette.text,
        display: 'block',
        whiteSpace: 'pre-line',
        ...clamp,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

type PressableProps = {
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties | ((s: { hovered: boolean; pressed: boolean }) => React.CSSProperties);
  children?: React.ReactNode;
  label?: string;
  disabled?: boolean;
  className?: string;
  title?: string;
};

export function Pressable({ onClick, style, children, label, disabled, className, title }: PressableProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const s = typeof style === 'function' ? style({ hovered, pressed }) : style;
  return (
    <button
      type="button"
      aria-label={label}
      title={title}
      disabled={disabled}
      className={className}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        margin: 0,
        cursor: disabled ? 'default' : 'pointer',
        textAlign: 'left',
        font: 'inherit',
        color: 'inherit',
        ...s,
      }}
    >
      {children}
    </button>
  );
}

export function IconButton({
  name,
  onClick,
  label,
  style,
  size = 20,
  color,
}: {
  name: string;
  onClick?: (e: React.MouseEvent) => void;
  label: string;
  style?: React.CSSProperties;
  size?: number;
  color?: string;
}) {
  const { palette } = useStore();
  return (
    <Pressable
      label={label}
      title={label}
      onClick={onClick}
      style={({ hovered, pressed }) => ({
        width: 38,
        height: 38,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        backgroundColor: hovered ? palette.tint : 'transparent',
        opacity: pressed ? 0.6 : 1,
        transition: 'transform .2s ease, opacity .2s ease, background-color .2s ease',
        flexShrink: 0,
        ...style,
      })}
    >
      <Icon name={name} size={size} color={color} />
    </Pressable>
  );
}

export function Button({
  title,
  onClick,
  secondary,
  icon,
  style,
  disabled,
  loading,
}: {
  title: string;
  onClick?: () => void;
  secondary?: boolean;
  icon?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  loading?: boolean;
}) {
  const { palette } = useStore();
  const fg = secondary ? palette.text : '#fff';
  return (
    <Pressable
      label={title}
      disabled={disabled || loading}
      onClick={onClick}
      style={({ hovered, pressed }) => ({
        minHeight: 46,
        padding: '12px 22px',
        borderRadius: 12,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 9,
        backgroundColor: secondary ? palette.surface : palette.accent,
        border: `1px solid ${secondary ? palette.border : 'transparent'}`,
        opacity: disabled ? 0.45 : pressed ? 0.75 : 1,
        transform: hovered && !disabled ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'transform .18s ease, opacity .18s ease',
        ...style,
      })}
    >
      {loading ? (
        <Spinner color={fg} size={18} />
      ) : (
        <>
          <Txt style={{ color: fg, fontWeight: 600, fontSize: 13 }}>{title}</Txt>
          {icon && <Icon name={icon} color={fg} size={17} />}
        </>
      )}
    </Pressable>
  );
}

export function Spinner({ color, size = 28 }: { color: string; size?: number }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: `2px solid ${color}`,
        borderTopColor: 'transparent',
        display: 'inline-block',
        animation: 'lm-spin .8s linear infinite',
      }}
    />
  );
}

export function Chip({
  title,
  active,
  onClick,
  icon,
  style,
}: {
  title: string;
  active?: boolean;
  onClick?: () => void;
  icon?: string;
  style?: React.CSSProperties;
}) {
  const { palette, dark } = useStore();
  const activeFg = dark ? '#263023' : '#fff';
  return (
    <Pressable
      label={title}
      onClick={onClick}
      style={({ hovered }) => ({
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: '0 18px',
        height: 41,
        borderRadius: 25,
        border: `1px solid ${active ? palette.darkGreen : palette.border}`,
        backgroundColor: active ? palette.darkGreen : hovered ? palette.tint : palette.surface,
        transition: 'transform .2s ease, opacity .2s ease, background-color .2s ease',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        ...style,
      })}
    >
      {icon && <Icon name={icon} size={15} color={active ? activeFg : palette.muted} />}
      <Txt
        style={{
          fontSize: 12,
          fontWeight: active ? 600 : 400,
          color: active ? activeFg : palette.text,
        }}
      >
        {title}
      </Txt>
    </Pressable>
  );
}

/* ---------- Original typographic cover art ---------- */

function CoverArt({ book, w, h }: { book: Book; w: number; h: number }) {
  const { bg, fg, accent, style } = book.cover;
  const s = w / 126; // scale relative to default width
  const titleSize = Math.max(7, (book.title.length > 16 ? 13 : 16) * s);
  const authorSize = Math.max(5, 7 * s);
  const pad = 12 * s;

  const deco = (() => {
    switch (style) {
      case 'dots':
        return (
          <svg width={w} height={h} style={{ position: 'absolute', inset: 0 }}>
            {Array.from({ length: 5 }).map((_, r) =>
              Array.from({ length: 4 }).map((_, c) => (
                <circle
                  key={`${r}-${c}`}
                  cx={w * 0.2 + c * w * 0.2}
                  cy={h * 0.58 + r * h * 0.065}
                  r={(r === 0 && c === 3 ? 4.5 : 2) * s}
                  fill={r === 0 && c === 3 ? accent : fg}
                  opacity={r === 0 && c === 3 ? 1 : 0.35}
                />
              )),
            )}
          </svg>
        );
      case 'circle':
        return (
          <svg width={w} height={h} style={{ position: 'absolute', inset: 0 }}>
            <circle cx={w * 0.5} cy={h * 0.62} r={w * 0.28} fill={accent} opacity={0.9} />
            <circle cx={w * 0.5} cy={h * 0.62} r={w * 0.36} fill="none" stroke={fg} strokeOpacity={0.3} strokeWidth={1} />
            {Array.from({ length: 14 }).map((_, i) => (
              <circle key={i} cx={(i * 37) % w} cy={(i * 53 + 20) % (h * 0.4)} r={1.2 * s} fill={fg} opacity={0.6} />
            ))}
          </svg>
        );
      case 'lines':
        return (
          <svg width={w} height={h} style={{ position: 'absolute', inset: 0 }}>
            {Array.from({ length: 9 }).map((_, i) => (
              <line
                key={i}
                x1={pad}
                x2={w - pad}
                y1={h * 0.56 + i * h * 0.04}
                y2={h * 0.56 + i * h * 0.04}
                stroke={fg}
                strokeWidth={1}
                opacity={0.8 - i * 0.07}
              />
            ))}
          </svg>
        );
      case 'bands':
        return (
          <svg width={w} height={h} style={{ position: 'absolute', inset: 0 }}>
            <rect x={0} y={h * 0.6} width={w} height={h * 0.07} fill={accent} opacity={0.9} />
            <rect x={0} y={h * 0.7} width={w} height={h * 0.03} fill={fg} opacity={0.6} />
            <rect x={0} y={h * 0.76} width={w} height={h * 0.07} fill={accent} opacity={0.5} />
            <path d={`M${w * 0.5},${h * 0.1} l${w * 0.12},${h * 0.1} l-${w * 0.24},0 z`} fill={accent} opacity={0.85} />
          </svg>
        );
      case 'sun':
        return (
          <svg width={w} height={h} style={{ position: 'absolute', inset: 0 }}>
            <circle cx={w * 0.5} cy={h * 0.3} r={w * 0.16} fill={accent} />
            {Array.from({ length: 5 }).map((_, i) => (
              <path
                key={i}
                d={`M${pad},${h * (0.62 + i * 0.06)} q${w * 0.25},-${8 * s} ${w * 0.5},0 t${w * 0.5},0`}
                fill="none"
                stroke={fg}
                strokeOpacity={0.35}
                strokeWidth={1}
              />
            ))}
          </svg>
        );
      case 'arc':
        return (
          <svg width={w} height={h} style={{ position: 'absolute', inset: 0 }}>
            <path
              d={`M${w * 0.2},${h * 0.72} q${w * 0.3},-${h * 0.3} ${w * 0.6},0`}
              fill="none"
              stroke={fg}
              strokeWidth={1.2 * s}
            />
            <circle cx={w * 0.32} cy={h * 0.3} r={2.2 * s} fill={fg} />
            <circle cx={w * 0.5} cy={h * 0.26} r={2.2 * s} fill={fg} />
            <circle cx={w * 0.68} cy={h * 0.3} r={2.2 * s} fill={fg} />
          </svg>
        );
      case 'grid':
        return (
          <svg width={w} height={h} style={{ position: 'absolute', inset: 0 }}>
            {Array.from({ length: 3 }).map((_, r) =>
              Array.from({ length: 3 }).map((_, c) => (
                <rect
                  key={`${r}-${c}`}
                  x={w * 0.22 + c * w * 0.2}
                  y={h * 0.5 + r * h * 0.1}
                  width={w * 0.12}
                  height={w * 0.12}
                  rx={1.5 * s}
                  fill={r === 1 && c === 1 ? accent : fg}
                  opacity={r === 1 && c === 1 ? 1 : 0.25}
                  transform={`rotate(45 ${w * 0.22 + c * w * 0.2 + w * 0.06} ${h * 0.5 + r * h * 0.1 + w * 0.06})`}
                />
              )),
            )}
          </svg>
        );
      case 'wave':
      default:
        return (
          <svg width={w} height={h} style={{ position: 'absolute', inset: 0 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <path
                key={i}
                d={`M0,${h * (0.5 + i * 0.07)} c${w * 0.25},-${12 * s} ${w * 0.5},${12 * s} ${w},0`}
                fill="none"
                stroke={i % 2 ? accent : fg}
                strokeOpacity={0.6}
                strokeWidth={1.2}
              />
            ))}
          </svg>
        );
    }
  })();

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: bg,
        overflow: 'hidden',
      }}
    >
      {deco}
      <div
        style={{
          position: 'absolute',
          left: pad,
          right: pad,
          top: pad * 1.1,
          display: 'flex',
          flexDirection: 'column',
          gap: 3 * s,
        }}
      >
        <span
          style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: titleSize,
            lineHeight: 1.05,
            color: fg,
            letterSpacing: -0.3 * s,
            display: 'block',
          }}
        >
          {book.title}
        </span>
        <span
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: authorSize,
            letterSpacing: 0.8 * s,
            textTransform: 'uppercase',
            color: fg,
            opacity: 0.75,
            display: 'block',
            marginTop: 2 * s,
          }}
        >
          {book.author}
        </span>
      </div>
      <span
        style={{
          position: 'absolute',
          bottom: pad * 0.8,
          left: pad,
          fontFamily: "'DM Sans', system-ui, sans-serif",
          fontSize: Math.max(4, 5 * s),
          letterSpacing: 1 * s,
          color: fg,
          opacity: 0.55,
        }}
      >
        LUMIÈRE
      </span>
    </div>
  );
}

export function BookCover({
  book,
  width = 126,
  height = 181,
  style,
}: {
  book: Book;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 2,
        backgroundColor: '#e7e4d9',
        boxShadow: '7px 11px 11px rgba(28,36,26,0.23)',
        overflow: 'hidden',
        position: 'relative',
        flexShrink: 0,
        ...style,
      }}
    >
      <CoverArt book={book} w={width} h={height} />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 2,
          bottom: 0,
          width: 4,
          backgroundColor: 'rgba(0,0,0,.1)',
          borderRight: '1px solid rgba(255,255,255,.22)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

export function BookCard({ book, compact }: { book: Book; compact?: boolean }) {
  const { palette, dark, wishlist, toggleWish, setModal, addCart, cart } = useStore();
  return (
    <Pressable
      label={`View ${book.title}`}
      onClick={() => setModal({ type: 'book', id: book.id })}
      style={({ hovered, pressed }) => ({
        display: 'block',
        width: '100%',
        minWidth: 0,
        backgroundColor: palette.surface,
        borderRadius: 17,
        padding: 9,
        border: `1px solid ${hovered ? (dark ? '#6e785d' : '#cdd4c1') : palette.border}`,
        transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
        opacity: pressed ? 0.9 : 1,
        transition: 'transform .23s ease, opacity .23s ease, border-color .23s ease',
        ...glass,
        ...shadow,
      })}
    >
      <div
        style={{
          height: compact ? 172 : 213,
          backgroundColor: dark ? '#343c32' : book.color,
          borderRadius: 11,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: 200,
            height: 200,
            borderRadius: 100,
            backgroundColor: 'rgba(255,255,255,.18)',
            right: -80,
            top: -60,
          }}
        />
        <BookCover book={book} width={compact ? 98 : 123} height={compact ? 144 : 179} />
        <span
          role="button"
          aria-label={`Wishlist ${book.title}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWish(book.id);
          }}
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 29,
            height: 29,
            backgroundColor: dark ? 'rgba(34,43,36,.85)' : 'rgba(255,255,255,.85)',
            borderRadius: 20,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Icon
            name={wishlist.includes(book.id) ? 'heart' : 'heart-outline'}
            size={16}
            color={wishlist.includes(book.id) ? palette.accent : palette.text}
          />
        </span>
        {book.badge && (
          <div
            style={{
              position: 'absolute',
              left: 8,
              bottom: 9,
              padding: '4px 9px',
              borderRadius: 5,
              backgroundColor: dark ? '#384131' : '#fffffff0',
              ...glass,
            }}
          >
            <Txt style={{ fontSize: 9, fontWeight: 600 }}>{book.badge}</Txt>
          </div>
        )}
      </div>
      <div style={{ padding: 5, paddingTop: 13 }}>
        <Txt lines={1} style={{ fontSize: 13, fontWeight: 700, letterSpacing: -0.2 }}>
          {book.title}
        </Txt>
        <Txt lines={1} style={{ fontSize: 10, color: palette.muted, marginTop: 4 }}>
          {book.author}
        </Txt>
        <div style={{ ...row, gap: 4, marginTop: 11 }}>
          <Icon name="star" color="#c2944f" size={11} />
          <Txt style={{ fontSize: 10, fontWeight: 600 }}>{book.rating}</Txt>
          <Txt style={{ fontSize: 9, color: palette.muted }}>({(book.reviews / 1000).toFixed(1)}k)</Txt>
          <div style={{ flex: 1 }} />
          <Txt style={{ fontSize: 9, color: palette.muted }}>ePub · PDF</Txt>
        </div>
        <div
          style={{
            ...row,
            marginTop: 10,
            paddingTop: 10,
            borderTop: `1px solid ${palette.border}`,
          }}
        >
          <Txt style={{ fontSize: 14, fontWeight: 700 }}>{money(book.price)}</Txt>
          {book.originalPrice && (
            <Txt
              style={{
                fontSize: 10,
                color: palette.muted,
                textDecoration: 'line-through',
                marginLeft: 6,
              }}
            >
              {money(book.originalPrice)}
            </Txt>
          )}
          <div style={{ flex: 1 }} />
          <span
            role="button"
            aria-label={`Add ${book.title} to bag`}
            onClick={(e) => {
              e.stopPropagation();
              addCart(book.id);
            }}
            style={{
              width: 28,
              height: 28,
              borderRadius: 9,
              backgroundColor: palette.tint,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name={cart.includes(book.id) ? 'checkmark' : 'add'} size={18} color={palette.darkGreen} />
          </span>
        </div>
      </div>
    </Pressable>
  );
}

export function EmptyState({
  icon = 'book-outline',
  title,
  text,
  action,
  onClick,
}: {
  icon?: string;
  title: string;
  text: string;
  action?: string;
  onClick?: () => void;
}) {
  const { palette } = useStore();
  return (
    <div style={{ padding: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      <div style={{ backgroundColor: palette.tint, padding: 20, borderRadius: 50, display: 'flex' }}>
        <Icon name={icon} size={32} color={palette.green} />
      </div>
      <Txt serif style={{ fontSize: 27, textAlign: 'center' }}>
        {title}
      </Txt>
      <Txt style={{ color: palette.muted, textAlign: 'center', maxWidth: 350, lineHeight: '22px' }}>{text}</Txt>
      {action && onClick && <Button title={action} onClick={onClick} style={{ marginTop: 6 }} />}
    </div>
  );
}

export const inputStyle = (palette: { text: string; border: string; surface?: string }): React.CSSProperties => ({
  fontFamily: "'DM Sans', system-ui, sans-serif",
  fontSize: 14,
  border: `1px solid ${palette.border}`,
  borderRadius: 10,
  padding: '13px 14px',
  minHeight: 46,
  color: palette.text,
  backgroundColor: palette.surface || 'transparent',
  outline: 'none',
  width: '100%',
});
