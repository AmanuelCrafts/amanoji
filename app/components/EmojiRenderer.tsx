'use client';

import { useEffect, useRef } from 'react';

const EMOJI_RE = /(\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]|\uD83D[\uDE80-\uDEFF]|[\u2600-\u27BF]|\uD83E[\uDD00-\uDDFF]|\uD83C[\uDDE6-\uDDFF]{2}|\uD83C[\uDFFB-\uDFFF]|\u200D|\uFE0F)/g;

function emojiToImg(text: string): (string | HTMLImageElement)[] {
  const parts: (string | HTMLImageElement)[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  const re = new RegExp(EMOJI_RE.source, 'g');
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const emoji = match[0];
    const img = document.createElement('img');
    img.src = `https://emojicdn.elk.sh/${encodeURIComponent(emoji)}`;
    img.alt = emoji;
    img.style.cssText = 'width:1.2em;height:1.2em;vertical-align:-0.2em;display:inline';
    img.loading = 'lazy';
    parts.push(img);
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function walk(node: Node) {
  if (node.nodeType === 3) {
    const text = node.textContent || '';
    if (EMOJI_RE.test(text)) {
      EMOJI_RE.lastIndex = 0;
      const parts = emojiToImg(text);
      if (parts.length > 0) {
        const frag = document.createDocumentFragment();
        parts.forEach(p => frag.appendChild(typeof p === 'string' ? document.createTextNode(p) : p));
        node.parentNode?.replaceChild(frag, node);
      }
    }
  } else if (node.nodeType === 1 && !(node as HTMLElement).tagName.match(/^(SCRIPT|STYLE|IMG|IFRAME|INPUT|SELECT|TEXTAREA)$/i)) {
    Array.from(node.childNodes).forEach(walk);
  }
}

export default function EmojiRenderer({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    walk(ref.current);

    const mo = new MutationObserver(() => { walk(ref.current!); });
    mo.observe(ref.current, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, []);

  return <div ref={ref} style={{ display: 'contents' }}>{children}</div>;
}
