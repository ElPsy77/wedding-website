const revealItems = document.querySelectorAll('.reveal');
const introScreen = document.getElementById('introScreen');
const openInviteButton = document.getElementById('openInviteButton');
const confettiLayer = document.getElementById('confettiLayer');
const greetingCard = document.getElementById('greetingCard');
const readInviteButton = document.getElementById('readInviteButton');
const openCalendarModal = document.getElementById('openCalendarModal');
const calendarModal = document.getElementById('calendarModal');
const calendarModalBackdrop = document.getElementById('calendarModalBackdrop');
const closeCalendarModal = document.getElementById('closeCalendarModal');
const googleCalendarLink = document.getElementById('googleCalendarLink');
const appleCalendarLink = document.getElementById('appleCalendarLink');
const outlookCalendarLink = document.getElementById('outlookCalendarLink');

const weddingEvent = {
  title: 'Свадьба Андрей & Анна',
  description:
    'ГРАФИК ПРАЗДНИКА:\n\n' +
    '14:00 — Венчание\n' +
    'Иверско-Серафимовский женский монастырь\n' +
    'https://2gis.kz/almaty/geo/9429940000795677/76.958845,43.269692\n\n' +
    '16:00 — Сбор гостей\n' +
    'Tau Hills, Алматы\n' +
    'https://2gis.kz/almaty/firm/70000001097835953\n\n' +
    '17:00 — Церемония\n' +
    'Tau Hills, Алматы\n\n' +
    '18:00 — Банкет\n' +
    'Tau Hills, Алматы',
  location: 'Иверско-Серафимовский монастырь / Tau Hills, Алматы',
  year: 2026,
  month: 8, // September (0-indexed)
  day: 20,
};

function burstConfetti() {
  if (!confettiLayer) return;
  confettiLayer.innerHTML = '';
  const confettiColors = ['#7f866f', '#abb0a1', '#bca19a', '#dfc0ba', '#eedfde', '#f8f3ef'];

  for (let i = 0; i < 90; i += 1) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.setProperty('--dx', `${(Math.random() - 0.5) * 260}px`);
    piece.style.setProperty('--delay', `${Math.random() * 240}ms`);
    piece.style.setProperty('--dur', `${1100 + Math.random() * 900}ms`);
    piece.style.setProperty('--rot', `${Math.random() * 540}deg`);
    piece.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    confettiLayer.appendChild(piece);
  }
}

if (openInviteButton && introScreen) {
  openInviteButton.addEventListener('click', () => {
    burstConfetti();
    document.body.classList.remove('intro-active');
    introScreen.classList.add('intro-screen--closing');
    setTimeout(() => {
      introScreen.remove();
    }, 900);
  });
}

if (readInviteButton && greetingCard) {
  readInviteButton.addEventListener('click', () => {
    greetingCard.classList.remove('card--locked');
  });
}

function initCalendarLinks() {
  if (!googleCalendarLink || !appleCalendarLink || !outlookCalendarLink) return;

  const { year, month, day, title, description, location } = weddingEvent;
  
  // Format dates for Google and Outlook (YYYYMMDD)
  // Month is 0-indexed in JS, so we add 1 for the string representation
  const dateObj = new Date(year, month, day);
  const nextDayObj = new Date(year, month, day + 1);
  
  const pad = (n) => String(n).padStart(2, '0');
  const formatDate = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  const startDate = formatDate(dateObj);
  const endDate = formatDate(nextDayObj);

  const googleUrl = new URL('https://calendar.google.com/calendar/render');
  googleUrl.searchParams.set('action', 'TEMPLATE');
  googleUrl.searchParams.set('text', title);
  googleUrl.searchParams.set('dates', `${startDate}/${endDate}`);
  googleUrl.searchParams.set('details', description);
  googleUrl.searchParams.set('location', location);
  googleCalendarLink.href = googleUrl.toString();

  appleCalendarLink.href = 'wedding-andrey-anna.ics';

  const outlookUrl = new URL('https://outlook.live.com/calendar/0/deeplink/compose');
  outlookUrl.searchParams.set('path', '/calendar/action/compose');
  outlookUrl.searchParams.set('rru', 'addevent');
  outlookUrl.searchParams.set('subject', title);
  
  // Format for Outlook YYYY-MM-DD
  const formatOutlook = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  outlookUrl.searchParams.set('startdt', formatOutlook(dateObj));
  outlookUrl.searchParams.set('enddt', formatOutlook(nextDayObj));
  
  outlookUrl.searchParams.set('allday', 'true');
  outlookUrl.searchParams.set('body', description);
  outlookUrl.searchParams.set('location', location);
  outlookCalendarLink.href = outlookUrl.toString();
}

function showCalendarModal() {
  if (!calendarModal) return;
  calendarModal.classList.add('is-open');
  calendarModal.setAttribute('aria-hidden', 'false');
}

function hideCalendarModal() {
  if (!calendarModal) return;
  calendarModal.classList.remove('is-open');
  calendarModal.setAttribute('aria-hidden', 'true');
}

if (openCalendarModal && calendarModal) {
  openCalendarModal.addEventListener('click', showCalendarModal);
}

if (calendarModalBackdrop) {
  calendarModalBackdrop.addEventListener('click', hideCalendarModal);
}

if (closeCalendarModal) {
  closeCalendarModal.addEventListener('click', hideCalendarModal);
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && calendarModal && calendarModal.classList.contains('is-open')) {
    hideCalendarModal();
  }
});

initCalendarLinks();

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
    }
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 90}ms`;
    observer.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const calendarTitle = document.getElementById('calendarTitle');
const calendarGrid = document.getElementById('calendarGrid');

if (calendarTitle && calendarGrid) {
  const month = weddingEvent.month;
  const year = weddingEvent.year;
  const selectedDay = weddingEvent.day;
  const monthsRu = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ];

  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const offset = (firstDay.getDay() + 6) % 7;

  calendarTitle.textContent = `${monthsRu[month]} ${year}`;

  const totalCells = Math.ceil((offset + daysInMonth) / 7) * 7;
  calendarGrid.innerHTML = '';

  for (let i = 0; i < totalCells; i += 1) {
    const cell = document.createElement('div');
    cell.className = 'calendar__day';

    if (i < offset) {
      cell.classList.add('calendar__day--muted');
      cell.textContent = String(daysInPrevMonth - offset + i + 1);
    } else if (i < offset + daysInMonth) {
      const dayNumber = i - offset + 1;
      cell.textContent = String(dayNumber);
      if (dayNumber === selectedDay) {
        cell.classList.add('calendar__day--selected');
      }
    } else {
      cell.classList.add('calendar__day--muted');
      cell.textContent = String(i - (offset + daysInMonth) + 1);
    }

    calendarGrid.appendChild(cell);
  }
}
