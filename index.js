// Track current displayed month/year
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

// Modified generateCalendar to accept parameters
function generateCalendar(year, month) {
    const calendarContainer = document.getElementById('calendarContainer');
    calendarContainer.innerHTML = '';
    
    let moodLogs = JSON.parse(localStorage.getItem('moodLogs')) || [];
    
    // Update calendar header
    const calendarHeader = document.querySelector('.calendar-header');
    calendarHeader.textContent = new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' });
    
    // Use parameters instead of current date
    const yearParam = year;
    const monthParam = month;
    
    // Calculate days in month and first day of month
    const firstDayIndex = new Date(yearParam, monthParam, 1).getDay();
    const daysInMonth = new Date(yearParam, monthParam + 1, 0).getDate();
    
    // Create header row
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayNames.forEach(dayName => {
        const headerCell = document.createElement('div');
        headerCell.className = 'day-cell header';
        headerCell.innerText = dayName;
        calendarContainer.appendChild(headerCell);
    });
    
    // Add empty cells before first day of month
    for (let i = 0; i < firstDayIndex; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'day-cell empty';
        calendarContainer.appendChild(emptyCell);
    }
    
    // Create day cells
    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement('div');
        cell.className = 'day-cell';
        
        const dateStr = new Date(yearParam, monthParam, day).toISOString().split('T')[0];
        
        // Add day number and mood display
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.innerText = day;
        cell.appendChild(dayNumber);
        
        const moodDiv = document.createElement('div');
        moodDiv.className = 'mood-display';
        const log = moodLogs.find(entry => entry.date === dateStr);
        moodDiv.innerText = log ? log.mood : '';
        cell.appendChild(moodDiv);
        
        calendarContainer.appendChild(cell);
    }
}

// Event listeners for navigation buttons
document.querySelector('.prev-month').addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    generateCalendar(currentYear, currentMonth);
});

document.querySelector('.next-month').addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    generateCalendar(currentYear, currentMonth);
});

// Log mood for the current day
document.querySelectorAll('.mood-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const mood = btn.dataset.mood;
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        let moodLogs = JSON.parse(localStorage.getItem('moodLogs')) || [];
        const existing = moodLogs.find(entry => entry.date === dateStr);
        if (existing) {
            existing.mood = mood;
        } else {
            moodLogs.push({ date: dateStr, mood });
        }
        localStorage.setItem('moodLogs', JSON.stringify(moodLogs));
        generateCalendar(currentYear, currentMonth);
    });
});

// Initial setup
generateCalendar(currentYear, currentMonth);
