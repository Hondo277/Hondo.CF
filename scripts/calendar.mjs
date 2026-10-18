const escapeText = (value) => value.replaceAll('\\', '\\\\').replaceAll('\n', '\\n').replaceAll(';', '\\;').replaceAll(',', '\\,');

function foldLine(line) {
  let folded = '';
  let current = '';
  for (const character of line) {
    if (Buffer.byteLength(current + character, 'utf8') > 75) {
      folded += `${current}\r\n`;
      current = ' ';
    }
    current += character;
  }
  return folded + current;
}

export function calendar(now = new Date()) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now).map(({ type, value }) => [type, value]));
  const today = new Date(Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), 12));
  const dateFor = (weekday, extraDays = 0) => {
    const date = new Date(today);
    date.setUTCDate(date.getUTCDate() + (weekday - today.getUTCDay() + 7) % 7 + extraDays);
    return date.toISOString().slice(0, 10).replaceAll('-', '');
  };
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Hondo.CF//Rendez-vous Twitch//FR', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'X-WR-CALNAME:Les lives de Hondo_27', 'X-WR-TIMEZONE:Europe/Paris',
    'BEGIN:VTIMEZONE', 'TZID:Europe/Paris', 'BEGIN:DAYLIGHT', 'TZOFFSETFROM:+0100', 'TZOFFSETTO:+0200', 'TZNAME:CEST', 'DTSTART:20000326T020000', 'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU', 'END:DAYLIGHT', 'BEGIN:STANDARD', 'TZOFFSETFROM:+0200', 'TZOFFSETTO:+0100', 'TZNAME:CET', 'DTSTART:20001029T030000', 'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU', 'END:STANDARD', 'END:VTIMEZONE'];
  for (const [weekday, rule, name] of [[2, 'TU', 'mardi'], [3, 'WE', 'mercredi'], [4, 'TH', 'jeudi'], [0, 'SU', 'dimanche']]) {
    const sunday = weekday === 0;
    lines.push('BEGIN:VEVENT', `UID:hondo-27-${rule.toLowerCase()}@hondocf.vercel.app`, `DTSTAMP:${now.toISOString().replaceAll('-', '').replaceAll(':', '').replace(/\.\d{3}Z$/, 'Z')}`, `DTSTART;TZID=Europe/Paris:${dateFor(weekday)}T${sunday ? '120000' : '203000'}`);
    if (sunday) lines.push(`DTEND;TZID=Europe/Paris:${dateFor(weekday, 1)}T000000`);
    lines.push(`RRULE:FREQ=WEEKLY;BYDAY=${rule}`, `SUMMARY:${escapeText(sunday ? 'Hondo_27 — Le live de 12 heures' : `Hondo_27 — Début du live du ${name}`)}`, `DESCRIPTION:${escapeText(sunday ? 'Rendez-vous habituel de midi à minuit. Heure de Paris. Les changements sont annoncés sur Discord et Twitch.' : 'Le live démarre habituellement entre 20h30 et 21h (heure de Paris). Cet événement rappelle le début du live. Les changements sont annoncés sur Discord et Twitch.')}`, 'LOCATION:https://twitch.tv/hondo_27', 'URL:https://hondocf.vercel.app/lives/', 'TRANSP:TRANSPARENT', 'END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  return lines.map(foldLine).join('\r\n') + '\r\n';
}
