// script.js

// Goal Setting Form
const goalForm = document.getElementById('goal-form');
const goalMessage = document.getElementById('goal-message');

goalForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const studyHours = parseInt(document.getElementById('goalDuration').value);
    if (!isNaN(studyHours)) {
        goalMessage.textContent = `Study goal set to ${studyHours} hours per day.`;
    } else {
        goalMessage.textContent = 'Please enter a valid number.';
    }
});

// Preferences
function savePreferences() {
    const sessionDuration = parseInt(document.getElementById('session-duration').value);
    const shortBreakDuration = parseInt(document.getElementById('short-break-duration').value);
    const longBreakDuration = parseInt(document.getElementById('long-break-duration').value);

    if (!isNaN(sessionDuration) && !isNaN(shortBreakDuration) && !isNaN(longBreakDuration)) {
        localStorage.setItem('sessionDuration', sessionDuration);
        localStorage.setItem('shortBreakDuration', shortBreakDuration);
        localStorage.setItem('longBreakDuration', longBreakDuration);
        document.getElementById('preferences-message').textContent = 'Preferences saved successfully.';
        window.location.href = "pomodoro.html";
    } else {
        document.getElementById('preferences-message').textContent = 'Please enter valid numbers.';
    }
}





document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar-content');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth' // Display the calendar in month view by default
        // Add more configuration options as needed
    });

    calendar.render(); // Render the calendar
});


