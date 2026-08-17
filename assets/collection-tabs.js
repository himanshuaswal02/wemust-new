document.addEventListener('DOMContentLoaded', function () {
  const sections = document.querySelectorAll('[data-collection-tabs]');

  sections.forEach(function (section) {
    const buttons = section.querySelectorAll('[data-tab-button]');
    const panels = section.querySelectorAll('[data-tab-panel]');

    if (buttons.length <= 1) {
      return;
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        const target = button.dataset.tabButton;

        buttons.forEach(function (item) {
          const active = item.dataset.tabButton === target;

          item.classList.toggle('is-active', active);
          item.setAttribute(
            'aria-selected',
            active ? 'true' : 'false'
          );
        });

        panels.forEach(function (panel) {
          const active = panel.dataset.tabPanel === target;

          panel.hidden = !active;
          panel.classList.toggle('is-active', active);
        });
      });
    });
  });
});