// Share list for a debit entry; falls back to equal split for older entries.
export const shareList = (e) =>
  e.shares?.length
    ? e.shares.map((s) => ({ user: String(s.user), amount: s.amount }))
    : e.participants.map((p) => ({ user: String(p), amount: e.amount / e.participants.length }));

export function spentByUser(entries) {
  const map = {};
  entries.filter((e) => e.type === 'debit').forEach((e) =>
    shareList(e).forEach((s) => { map[s.user] = (map[s.user] || 0) + s.amount; }));
  return map;
}
