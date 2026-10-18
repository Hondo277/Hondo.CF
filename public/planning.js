const parisClock = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
const frenchDay = new Intl.DateTimeFormat('fr-FR', { timeZone: 'UTC', weekday: 'long', day: 'numeric', month: 'long' });

export function nextSlot(now = new Date()) {
  const parts = Object.fromEntries(parisClock.formatToParts(now).map(({ type, value }) => [type, value]));
  const today = new Date(Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), 12));
  const minutes = Number(parts.hour) * 60 + Number(parts.minute);
  for (let offset = 0; offset < 8; offset++) {
    const candidate = new Date(today);
    candidate.setUTCDate(candidate.getUTCDate() + offset);
    const weekday = candidate.getUTCDay();
    if (![0, 2, 3, 4].includes(weekday)) continue;
    const sunday = weekday === 0;
    if (offset === 0 && minutes >= (sunday ? 1440 : 1261)) continue;
    const dayLabel = offset === 0 ? 'Aujourd’hui' : frenchDay.format(candidate);
    const timeLabel = sunday ? '12h → 00h' : 'début entre 20h30 et 21h';
    return { date: candidate.toISOString().slice(0, 10), weekday, isToday: offset === 0, label: `${dayLabel} · ${timeLabel}` };
  }
}
