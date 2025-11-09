document.addEventListener('DOMContentLoaded', () => {
  const scheduleContainer = document.getElementById('schedule-container');
  const searchInput = document.getElementById('searchInput');
  let talks = [];

  fetch('/api/talks')
    .then(response => response.json())
    .then(data => {
      talks = data;
      renderSchedule(talks);
    });

  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredTalks = talks.filter(talk =>
      talk.category.some(category => category.toLowerCase().includes(searchTerm))
    );
    renderSchedule(filteredTalks);
  });

  function renderSchedule(talksToRender) {
    scheduleContainer.innerHTML = '';
    let currentTime = new Date();
    currentTime.setHours(10, 0, 0, 0);

    talksToRender.forEach((talk, index) => {
      const startTime = new Date(currentTime);
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

      const talkElement = document.createElement('div');
      talkElement.classList.add('talk');

      const timeString = `${formatTime(startTime)} - ${formatTime(endTime)}`;

      talkElement.innerHTML = `
        <div class="talk-header">
          <div class="talk-title">${talk.title}</div>
          <div class="talk-time">${timeString}</div>
        </div>
        <div class="talk-speakers">${talk.speakers.join(', ')}</div>
        <div class="talk-description">${talk.description}</div>
        <div class="talk-categories">
          ${talk.category.map(cat => `<span class="talk-category">${cat}</span>`).join('')}
        </div>
      `;
      scheduleContainer.appendChild(talkElement);

      currentTime = new Date(endTime.getTime() + 10 * 60 * 1000);

      if (index === 2) {
        const lunchBreak = document.createElement('div');
        lunchBreak.classList.add('break');
        lunchBreak.textContent = 'Lunch Break (1 hour)';
        scheduleContainer.appendChild(lunchBreak);
        currentTime = new Date(currentTime.getTime() + 60 * 60 * 1000);
      }
    });
  }

  function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
});
