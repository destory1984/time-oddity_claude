import { describe, expect, it } from 'vitest';
import { emptyCards, readReply, repliesWaiting, replyDue, sanitizeCards, sendCard, takeCard } from '../game/src/core/postcard.js';
import { SQUARES } from '../game/src/core/squares.js';

const picture = { image: 'data:image/jpeg;base64,AAAA', at: 'then', label: '1851.5.1' };

describe('postcards', () => {
  it('keeps one postcard a square, and a new picture replaces the old one and what was sent', () => {
    let cards = takeCard(emptyCards(), 'crystalPalace', picture, '2026-10-07');
    expect(cards.crystalPalace).toEqual({ ...picture, takenDay: '2026-10-07', sentDay: null, replyRead: false });
    cards = sendCard(cards, 'crystalPalace', '2026-10-07');
    cards = takeCard(cards, 'crystalPalace', { ...picture, at: 'today', label: '2026.10.8' }, '2026-10-08');
    expect(cards.crystalPalace).toMatchObject({ at: 'today', takenDay: '2026-10-08', sentDay: null });
  });
  it('is sent once', () => {
    const taken = takeCard(emptyCards(), 'khufu', picture, '2026-10-07');
    const sent = sendCard(taken, 'khufu', '2026-10-07');
    expect(sent.khufu.sentDay).toBe('2026-10-07');
    expect(sendCard(sent, 'khufu', '2026-10-09')).toBe(sent);
    expect(sendCard(taken, 'nowhere', '2026-10-07')).toBe(taken);
  });
  it('brings an answer the next day, not the same day', () => {
    const sent = sendCard(takeCard(emptyCards(), 'khufu', picture, '2026-10-07'), 'khufu', '2026-10-07');
    expect(replyDue(sent.khufu, '2026-10-07')).toBe(false);
    expect(replyDue(sent.khufu, '2026-10-08')).toBe(true);
    expect(replyDue(sent.khufu, '2026-11-01')).toBe(true);
    expect(replyDue(takeCard(emptyCards(), 'khufu', picture, '2026-10-07').khufu, '2026-10-09')).toBe(false);
    expect(replyDue(undefined, '2026-10-09')).toBe(false);
  });
  it('counts answers that have come and not been read', () => {
    let cards = sendCard(takeCard(emptyCards(), 'khufu', picture, '2026-10-07'), 'khufu', '2026-10-07');
    cards = sendCard(takeCard(cards, 'eiffel', picture, '2026-10-07'), 'eiffel', '2026-10-07');
    expect(repliesWaiting(cards, '2026-10-07')).toBe(0);
    expect(repliesWaiting(cards, '2026-10-08')).toBe(2);
    expect(readReply(cards, 'khufu', '2026-10-07')).toBe(cards);
    cards = readReply(cards, 'khufu', '2026-10-08');
    expect(repliesWaiting(cards, '2026-10-08')).toBe(1);
    expect(readReply(cards, 'khufu', '2026-10-08')).toBe(cards);
  });
  it('keeps only whole postcards of squares that exist when read back', () => {
    const ids = ['khufu', 'eiffel'];
    const good = sendCard(takeCard(emptyCards(), 'khufu', picture, '2026-10-07'), 'khufu', '2026-10-07');
    expect(sanitizeCards(JSON.stringify(good), ids)).toEqual(good);
    const raw = JSON.stringify({
      khufu: { ...good.khufu, sentDay: 'yesterday', replyRead: true },
      eiffel: { image: 'https://example.com/x.jpg', at: 'then', takenDay: '2026-10-07' },
      atlantis: good.khufu,
    });
    expect(sanitizeCards(raw, ids)).toEqual({ khufu: { ...picture, takenDay: '2026-10-07', sentDay: null, replyRead: false } });
    for (const bad of [null, '', 'x', '[]', '7']) expect(sanitizeCards(bad, ids)).toEqual({});
  });
});

describe('grandmother\'s answers', () => {
  it('labels every square with AD or BC', () => {
    for (const s of SQUARES) expect(s.dateLabel, s.id).toMatch(/^(AD|BC) \d/);
  });
  it('has one for every square, short enough for a postcard', () => {
    for (const s of SQUARES) {
      expect(s.reply.length, s.id).toBeGreaterThan(8);
      expect(s.reply.length, s.id).toBeLessThanOrEqual(60);
    }
  });
});
