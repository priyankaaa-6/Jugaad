const timer = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4,
    sessions: 0,
  };
  
  let interval;
  
  const buttonSound = new Audio('button-sound.mp3');
  const mainButton = document.getElementById('js-btn');
  mainButton.addEventListener('click', () => {
    buttonSound.play();
    const { action } = mainButton.dataset;
    if (action === 'start') {
      startTimer();
    } else {
      stopTimer();
    }
  });
  
  const modeButtons = document.querySelector('#js-mode-buttons');
  modeButtons.addEventListener('click', handleMode);
  
  function getRemainingTime(endTime) {
    const currentTime = Date.parse(new Date());
    const difference = endTime - currentTime;
  
    const total = Number.parseInt(difference / 1000, 10);
    const minutes = Number.parseInt((total / 60) % 60, 10);
    const seconds = Number.parseInt(total % 60, 10);
  
    return {
      total,
      minutes,
      seconds,
    };
  }
  
  function startTimer() {
    let { total } = timer.remainingTime;
    const endTime = Date.parse(new Date()) + total * 1000;
  
    if (timer.mode === 'pomodoro') timer.sessions++;
  
    mainButton.dataset.action = 'stop';
    mainButton.textContent = 'stop';
    mainButton.classList.add('active');
  
    interval = setInterval(function() {
      timer.remainingTime = getRemainingTime(endTime);
      updateClock();
  
      total = timer.remainingTime.total;
      if (total <= 0) {
        clearInterval(interval);
  
        switch (timer.mode) {
          case 'pomodoro':
            if (timer.sessions % timer.longBreakInterval === 0) {
              switchMode('longBreak');
            } else {
              switchMode('shortBreak');
            }
            break;
          default:
            switchMode('pomodoro');
        }
  
        if (Notification.permission === 'granted') {
          const text =
            timer.mode === 'pomodoro' ? 'Get back to work!' : 'Take a break!';
          new Notification(text);
        }
  
        document.querySelector(`[data-sound="${timer.mode}"]`).play();
  
        startTimer();
      }
    }, 1000);
  }
  
  function stopTimer() {
    clearInterval(interval);
  
    mainButton.dataset.action = 'start';
    mainButton.textContent = 'start';
    mainButton.classList.remove('active');
  }
  
  function updateClock() {
    const { remainingTime } = timer;
    const minutes = `${remainingTime.minutes}`.padStart(2, '0');
    const seconds = `${remainingTime.seconds}`.padStart(2, '0');
  
    const min = document.getElementById('js-minutes');
    const sec = document.getElementById('js-seconds');
    min.textContent = minutes;
    sec.textContent = seconds;
  
    const text =
      timer.mode === 'pomodoro' ? 'Get back to work!' : 'Take a break!';
    document.title = `${minutes}:${seconds} — ${text}`;
  
    const progress = document.getElementById('js-progress');
    progress.value = timer[timer.mode] * 60 - timer.remainingTime.total;
  }
  
  function switchMode(mode) {
    timer.mode = mode;
    timer.remainingTime = {
      total: timer[mode] * 60,
      minutes: timer[mode],
      seconds: 0,
    };
  
    document
      .querySelectorAll('button[data-mode]')
      .forEach(e => e.classList.remove('active'));
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
    document.body.style.backgroundColor = `var(--${mode})`;
    document
      .getElementById('js-progress')
      .setAttribute('max', timer.remainingTime.total);
  
    updateClock();
  }
  
  function handleMode(event) {
    const { mode } = event.target.dataset;
  
    if (!mode) return;
  
    switchMode(mode);
    stopTimer();
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    if ('Notification' in window) {
      if (
        Notification.permission !== 'granted' &&
        Notification.permission !== 'denied'
      ) {
        Notification.requestPermission().then(function(permission) {
          if (permission === 'granted') {
            new Notification(
              'Awesome! You will be notified at the start of each session'
            );
          }
        });
      }
    }
    const sessionDuration = parseInt(localStorage.getItem('sessionDuration'));
    const shortBreakDuration = parseInt(localStorage.getItem('shortBreakDuration'));
    const longBreakDuration = parseInt(localStorage.getItem('longBreakDuration'));

    if (!isNaN(sessionDuration) && !isNaN(shortBreakDuration) && !isNaN(longBreakDuration)) {
        updateTimer(sessionDuration, shortBreakDuration, longBreakDuration);
    } else {
        // Set default timer values if preferences are not available
        updateTimer(25, 5, 15);
    }
    switchMode('pomodoro');
  });

  function updateTimer(sessionDuration, shortBreakDuration, longBreakDuration) {
    timer.pomodoro = sessionDuration;
    timer.shortBreak = shortBreakDuration;
    timer.longBreak = longBreakDuration;
}


document.addEventListener('DOMContentLoaded', function() {
  const calendarEl = document.getElementById('calendar-content');
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today', // Display navigation buttons on the left side
      center: 'title', // Display the title of the calendar in the center
      right: 'dayGridMonth,timeGridWeek,timeGridDay', // Display view switch buttons on the right side
    },
    buttonText: {
      today: 'Today', // Text for the "today" button
      month: 'Month', // Text for the "month" view button
      week: 'Week', // Text for the "week" view button
      day: 'Day', // Text for the "day" view button
    },
    // Additional configuration options
    selectable: true, // Allow users to select dates and times
    editable: true, // Allow users to drag and resize events
    eventColor: 'green', // Set the default color for events
    eventBorderColor: 'black', // Set the border color for events
    eventOverlap: false, // Prevent events from overlapping
    slotDuration: '00:15:00', // Set the time slot duration to 15 minutes
    businessHours: { // Define business hours
      startTime: '08:00', // Start of business hours
      endTime: '18:00', // End of business hours
    },
    locale: 'en', // Set the locale to English
    timeZone: 'local', 
    // Add more configuration options as needed
  });

  // Render the calendar
  calendar.render();

  // Get stored Pomodoro session data
  const pomodoroSessions = getPomodoroSessions();

  // Calculate total hours spent today
  const today = new Date();
  const todaySessions = pomodoroSessions.filter(session => isSameDay(session.start, today));
  let totalHoursToday = 0;
  todaySessions.forEach(session => {
    const sessionDuration = timer[session.mode];
    totalHoursToday += sessionDuration / 60; // Convert minutes to hours
  });

  // Display total hours on the calendar
  const todayDateStr = formatDate(today);
  const todayCell = calendarEl.querySelector(`[data-date="${todayDateStr}"]`);
  if (todayCell) {
    const totalHoursElement = document.createElement('div');
    totalHoursElement.classList.add('total-hours');
    totalHoursElement.textContent = `Total Hours: ${totalHoursToday.toFixed(2)}`;
    todayCell.appendChild(totalHoursElement);
  }
});

// Function to check if two dates are on the same day
function isSameDay(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();
}

// Function to format date as "YYYY-MM-DD"
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Function to get stored Pomodoro session data
function getPomodoroSessions() {
  let storedSessions = localStorage.getItem('sessions');
  if (storedSessions) {
    storedSessions = JSON.parse(storedSessions);
  } else {
    storedSessions = [];
  }
  return storedSessions;
}

