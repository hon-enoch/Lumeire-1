import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store';
import { money } from '../data';
import { BookCover, Icon, IconButton, Pressable, Txt, row } from '../ui';

type Msg = { id: string; text: string; user?: boolean; ids?: string[] };

export function Curator() {
  const { curator, setCurator, palette, dark, books, setModal, width } = useStore();
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      id: 'hello',
      text: 'Hello, curious mind. ✨\nI’m The Book Curator. Tell me what you’re in the mood for, and let’s find a book that feels like you.',
    },
  ]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, busy]);

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text || busy) return;
    setInput('');
    setMsgs((m) => [...m, { id: Date.now() + '-user', text, user: true }]);
    setBusy(true);
    setTimeout(() => {
      const q = text.toLowerCase();
      const hints: string[] = [];
      if (/escape|fiction|story|stories|adventure|novel/.test(q)) hints.push('fiction', 'escape', 'adventure');
      if (/fresh|grow|start|habit|productive|focus|goal|improv/.test(q))
        hints.push('habits', 'productivity', 'goals', 'self-growth');
      if (/soul|sad|poem|poetry|love|heart|healing/.test(q)) hints.push('poetry', 'healing', 'comfort');
      if (/calm|stress|quiet|purpose|anxious|peace/.test(q)) hints.push('mindfulness', 'calm', 'purpose');
      if (/africa|culture|history|identity/.test(q)) hints.push('africa', 'culture', 'history');
      if (/creat|art|inspir/.test(q)) hints.push('creativity', 'inspiration', 'art');
      const terms = [...q.split(/\W+/).filter((w) => w.length > 3), ...hints];
      const scored = books
        .filter((b) => !b.hidden)
        .map((b) => ({
          b,
          score: terms.reduce(
            (s, t) =>
              s + (`${b.title} ${b.author} ${b.tags.join(' ')} ${b.category}`.toLowerCase().includes(t) ? 1 : 0),
            0,
          ),
        }))
        .sort((a, b) => b.score - a.score);
      const hits = scored.filter((s) => s.score > 0);
      const ids = (hits.length ? hits : [scored[2], scored[1]]).slice(0, 2).map((s) => s.b.id);
      const reply = hits.length
        ? `I have ${ids.length === 1 ? 'just the book' : 'a couple of lovely places to start'}. ${scored[0].b.title} explores ${scored[0].b.tags.slice(0, 2).join(' and ')}—a thoughtful match for what you have in mind.\n\nTap a book to take a closer look, or tell me a little more about your reading goals.`
        : 'Let’s start with two reader favorites that open up a little possibility. Tell me a genre, a topic, or how you’d like to feel, and I’ll narrow it down for you.';
      setMsgs((m) => [...m, { id: Date.now() + '-reply', text: reply, ids }]);
      setBusy(false);
    }, 850);
  };

  const bottom = width < 800 ? 83 : 25;

  if (!curator && width < 600) {
    return (
      <Pressable
        label="Chat with The Book Curator"
        onClick={() => setCurator(true)}
        style={{
          position: 'fixed',
          bottom,
          right: 18,
          width: 51,
          height: 51,
          borderRadius: 18,
          backgroundColor: dark ? '#aec49a' : '#354b3d',
          border: `1px solid ${dark ? '#c9d6bc' : '#65765c'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          boxShadow: '0 8px 24px rgba(59,73,50,0.15)',
        }}
      >
        <Icon name="sparkles-outline" size={23} color={dark ? '#263b27' : '#e0eacb'} />
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: 5,
            backgroundColor: '#b2cc8c',
            position: 'absolute',
            top: 7,
            right: 7,
            border: '1px solid #354b3d',
          }}
        />
      </Pressable>
    );
  }

  if (curator) {
    return (
      <div
        className="lm-fade-in-fast"
        style={{
          position: 'fixed',
          right: width < 600 ? 12 : 30,
          bottom,
          width: Math.min(375, width - 24),
          height: width < 600 ? 490 : 530,
          maxHeight: '78vh',
          borderRadius: 20,
          backgroundColor: palette.solid,
          border: `1px solid ${palette.border}`,
          overflow: 'hidden',
          boxShadow: '0 8px 35px rgba(59,73,50,0.17)',
          zIndex: 101,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            ...row,
            gap: 12,
            padding: 17,
            backgroundColor: dark ? '#354b3d' : '#edf1e7',
            borderBottom: `1px solid ${palette.border}`,
          }}
        >
          <div style={{ backgroundColor: dark ? '#52634c' : '#dbe5cc', padding: 10, borderRadius: 12, display: 'flex' }}>
            <Icon name="sparkles-outline" size={22} color={palette.green} />
          </div>
          <div style={{ flex: 1 }}>
            <Txt style={{ fontWeight: 600, fontSize: 14 }}>The Book Curator</Txt>
            <Txt style={{ color: palette.green, fontSize: 10, marginTop: 3 }}>Your personal discovery companion</Txt>
          </div>
          <IconButton name="remove" label="Minimize Book Curator" onClick={() => setCurator(false)} />
        </div>
        <div
          ref={listRef}
          className="lm-scroll"
          style={{ flex: 1, overflowY: 'auto', padding: 17, display: 'flex', flexDirection: 'column', gap: 13 }}
        >
          {msgs.map((m) => (
            <div
              key={m.id}
              style={{
                alignSelf: m.user ? 'flex-end' : 'flex-start',
                maxWidth: '94%',
                backgroundColor: m.user ? palette.darkGreen : palette.tint,
                padding: 14,
                borderRadius: 15,
                borderBottomRightRadius: m.user ? 3 : 15,
                borderBottomLeftRadius: m.user ? 15 : 3,
              }}
            >
              <Txt style={{ fontSize: 12, lineHeight: '20px', color: m.user ? (dark ? '#253326' : '#fff') : palette.text }}>
                {m.text}
              </Txt>
              {m.ids?.map((id) => {
                const b = books.find((x) => x.id === id)!;
                return (
                  <Pressable
                    key={id}
                    onClick={() => setModal({ type: 'book', id })}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10,
                      marginTop: 12,
                      backgroundColor: palette.solid,
                      borderRadius: 9,
                      padding: 10,
                      width: '100%',
                    }}
                  >
                    <BookCover book={b} width={36} height={53} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Txt style={{ fontWeight: 600, fontSize: 11 }}>{b.title}</Txt>
                      <Txt style={{ fontSize: 9, color: palette.muted, marginTop: 3 }}>{b.author}</Txt>
                      <Txt style={{ color: palette.green, fontSize: 10, marginTop: 5 }}>{money(b.price)}</Txt>
                    </div>
                    <Icon name="arrow-forward" size={15} color={palette.green} />
                  </Pressable>
                );
              })}
            </div>
          ))}
          {busy ? (
            <Txt style={{ fontSize: 11, color: palette.muted, padding: '8px 0' }}>Finding a little book magic…</Txt>
          ) : msgs.length === 1 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {['A little escape', 'A fresh start', 'Something soulful'].map((s) => (
                <Pressable
                  key={s}
                  onClick={() => send(s)}
                  style={{ padding: '8px 10px', borderRadius: 15, border: `1px solid ${palette.border}` }}
                >
                  <Txt style={{ fontSize: 10, color: palette.green }}>{s}</Txt>
                </Pressable>
              ))}
            </div>
          ) : null}
        </div>
        <div style={{ padding: '11px 15px 12px', borderTop: `1px solid ${palette.border}` }}>
          <div
            style={{
              ...row,
              gap: 9,
              paddingLeft: 13,
              paddingRight: 5,
              borderRadius: 12,
              border: `1px solid ${palette.border}`,
              backgroundColor: palette.surface,
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send(input)}
              aria-label="Message The Book Curator"
              placeholder="What are you in the mood for?"
              style={{
                flex: 1,
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: 11,
                color: palette.text,
                padding: '13px 0',
                border: 'none',
                background: 'transparent',
                outline: 'none',
                minWidth: 0,
              }}
            />
            <IconButton
              name="arrow-up"
              size={17}
              label="Send message"
              onClick={() => send(input)}
              color={dark ? '#263023' : '#fff'}
              style={{ backgroundColor: palette.darkGreen, height: 31, width: 31, borderRadius: 9, opacity: busy ? 0.5 : 1 }}
            />
          </div>
          <Txt style={{ fontSize: 8, color: palette.muted, textAlign: 'center', marginTop: 9 }}>
            Local discovery preview · Recommendations from our catalog
          </Txt>
        </div>
      </div>
    );
  }

  return (
    <Pressable
      label="Chat with The Book Curator"
      onClick={() => setCurator(true)}
      style={({ hovered }) => ({
        position: 'fixed',
        bottom,
        right: width < 600 ? 18 : 30,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 11,
        backgroundColor: dark ? '#aec49a' : '#354b3d',
        padding: '11px 18px 11px 11px',
        borderRadius: 17,
        border: `1px solid ${dark ? '#c9d6bc' : '#65765c'}`,
        boxShadow: '0 6px 18px rgba(38,59,39,0.19)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'transform .2s ease',
        zIndex: 100,
      })}
    >
      <div
        style={{
          backgroundColor: dark ? '#8ca974' : '#52634c',
          width: 33,
          height: 33,
          borderRadius: 11,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon name="sparkles-outline" size={19} color={dark ? '#263b27' : '#e0eacb'} />
      </div>
      <div>
        <Txt style={{ color: dark ? '#203222' : '#fff', fontWeight: 600, fontSize: 11 }}>The Book Curator</Txt>
        <div style={{ ...row, gap: 4, marginTop: 3 }}>
          <div style={{ width: 4, height: 4, borderRadius: 5, backgroundColor: '#b2cc8c' }} />
          <Txt style={{ fontSize: 9, color: dark ? '#415734' : '#c3ccb9' }}>A good read starts here</Txt>
        </div>
      </div>
      <Icon name="chevron-up" size={13} color={dark ? '#263b27' : '#e0eacb'} />
    </Pressable>
  );
}
