// Postcards: a picture Sora takes of a square becomes a postcard; sent to grandmother, it
// brings her answer the next day. One postcard a square: taking another replaces it (and
// what was sent with it). The picture itself is made by the screen (ui/photo.js) and kept
// here as a data URL.
//
// A postcard: { image, at ('then' | 'today'), label (the date on the screen when it was
// taken), takenDay, sentDay (or null), replyRead }. Days are 'YYYY-MM-DD' on the device's
// own calendar. Records are never changed in place.

export const emptyCards = () => ({});

export function takeCard(cards, id, { image, at, label }, today) {
  return { ...cards, [id]: { image, at, label, takenDay: today, sentDay: null, replyRead: false } };
}

export function sendCard(cards, id, today) {
  const card = cards[id];
  if (!card || card.sentDay) return cards;
  return { ...cards, [id]: { ...card, sentDay: today } };
}

// The answer comes the day after the postcard was sent, or any day later.
export const replyDue = (card, today) => Boolean(card && card.sentDay && today > card.sentDay);

export function readReply(cards, id, today) {
  const card = cards[id];
  if (!replyDue(card, today) || card.replyRead) return cards;
  return { ...cards, [id]: { ...card, replyRead: true } };
}

// How many answers have come and not been read: the mark on the notebook's button.
export const repliesWaiting = (cards, today) => Object.values(cards).filter((card) => replyDue(card, today) && !card.replyRead).length;

const DAY = /^\d{4}-\d{2}-\d{2}$/;

// What was kept, read back: only squares that exist and only cards whose every part is
// what it should be survive. Anything unreadable is no postcards, never an error.
export function sanitizeCards(raw, ids) {
  let kept;
  try { kept = JSON.parse(raw); } catch { return emptyCards(); }
  if (!kept || typeof kept !== 'object' || Array.isArray(kept)) return emptyCards();
  const cards = {};
  for (const id of ids) {
    const was = kept[id];
    if (!was || typeof was !== 'object') continue;
    if (typeof was.image !== 'string' || !was.image.startsWith('data:image/')) continue;
    if (was.at !== 'then' && was.at !== 'today') continue;
    if (typeof was.takenDay !== 'string' || !DAY.test(was.takenDay)) continue;
    const sentDay = typeof was.sentDay === 'string' && DAY.test(was.sentDay) ? was.sentDay : null;
    cards[id] = {
      image: was.image, at: was.at, label: typeof was.label === 'string' ? was.label : '', takenDay: was.takenDay,
      sentDay, replyRead: sentDay !== null && was.replyRead === true,
    };
  }
  return cards;
}
