export const inr = (n) => '₹' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });
export const fmtDate = (d) => new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
export const CATEGORIES = ['Food', 'Stay', 'Travel', 'Activity', 'Shopping', 'Other'];
