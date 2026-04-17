const revealItems = document.querySelectorAll('.reveal');

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
  const month = 6; // July (0-indexed)
  const year = new Date().getFullYear();
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
  const randomDay = Math.floor(Math.random() * daysInMonth) + 1;

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
      if (dayNumber === randomDay) {
        cell.classList.add('calendar__day--selected');
      }
    } else {
      cell.classList.add('calendar__day--muted');
      cell.textContent = String(i - (offset + daysInMonth) + 1);
    }

    calendarGrid.appendChild(cell);
  }
}
