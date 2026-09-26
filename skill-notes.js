(() => {
  const dialog = document.getElementById('skill-dialog');
  const tabs = [...dialog.querySelectorAll('[role="tab"]')];
  const practice = document.getElementById('practice-panel');
  const study = document.getElementById('study-panel');
  let opener;

  function selectTab(index, moveFocus = false) {
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
    });
    practice.hidden = index !== 0;
    study.hidden = index !== 1;
    dialog.querySelector('.notes-scroll').scrollTop = 0;
    if (moveFocus) tabs[index].focus();
  }

  document.querySelectorAll('[data-topic]').forEach(button => {
    button.addEventListener('click', () => {
      const template = document.getElementById(`topic-${button.dataset.topic}`);
      if (!template) return;
      opener = button;
      document.getElementById('skill-title').textContent = button.textContent.replace('↗', '').trim();
      practice.replaceChildren(template.content.querySelector('.practice-content').cloneNode(true));
      document.getElementById('study-body').replaceChildren(template.content.querySelector('.study-content').cloneNode(true));
      selectTab(0);
      dialog.showModal();
      document.body.classList.add('notes-open');
      dialog.querySelector('.notes-close').focus();
    });
  });
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(index));
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      selectTab(event.key === 'Home' ? 0 : event.key === 'End' ? 1 : 1 - index, true);
    });
  });
  dialog.querySelector('.notes-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('notes-open');
    opener?.focus();
  });

  const cards = [...document.querySelectorAll('.recommendation-card')];
  const controls = document.querySelector('.recommendation-controls');
  const list = document.getElementById('recommendation-slides');
  let currentCard = 0;
  function showRecommendation(index) {
    currentCard = (index + cards.length) % cards.length;
    cards.forEach((card, i) => { card.hidden = i !== currentCard; });
    document.getElementById('recommendation-count').textContent = `${currentCard + 1} / ${cards.length} · ${cards[currentCard].querySelector('.recommendation-author strong').textContent}`;
  }
  if (cards.length > 1) {
    controls.hidden = false;
    document.querySelectorAll('.carousel-arrow').forEach(button => { button.hidden = false; });
    list.classList.add('is-carousel');
    document.getElementById('recommendation-prev').addEventListener('click', () => showRecommendation(currentCard - 1));
    document.getElementById('recommendation-next').addEventListener('click', () => showRecommendation(currentCard + 1));
    showRecommendation(0);
  }
})();
