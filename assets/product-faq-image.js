class ProductFaqAccordion {
  constructor(section) {
    this.section = section;
    this.items = section.querySelectorAll('.faq-item');

    if (!this.items.length) return;

    this.init();
  }

  init() {
    this.items.forEach((item) => {
      const question = item.querySelector('.faq-question');

      if (question) {
        question.addEventListener('click', () => {
          this.toggle(item);
        });
      }
    });
  }

  toggle(currentItem) {
    const isActive = currentItem.classList.contains('active');

    this.items.forEach((item) => {
      if (item !== currentItem) {
        this.close(item);
      }
    });

    if (isActive) {
      this.close(currentItem);
    } else {
      this.open(currentItem);
    }
  }

  open(item) {
    const answer = item.querySelector('.faq-answer');

    item.classList.add('active');

    answer.style.display = 'block';

    const height = answer.scrollHeight;

    answer.style.height = '0px';
    answer.style.opacity = '0';
    answer.style.overflow = 'hidden';

    requestAnimationFrame(() => {
      answer.style.transition = 'height .35s ease, opacity .35s ease';
      answer.style.height = height + 'px';
      answer.style.opacity = '1';
    });

    answer.addEventListener(
      'transitionend',
      function handler() {
        answer.style.height = 'auto';
        answer.style.overflow = 'visible';
        answer.removeEventListener('transitionend', handler);
      }
    );
  }

  close(item) {
    const answer = item.querySelector('.faq-answer');

    if (!item.classList.contains('active')) return;

    answer.style.height = answer.scrollHeight + 'px';
    answer.style.overflow = 'hidden';

    requestAnimationFrame(() => {
      answer.style.transition = 'height .35s ease, opacity .35s ease';
      answer.style.height = '0px';
      answer.style.opacity = '0';
    });

    answer.addEventListener(
      'transitionend',
      function handler() {
        answer.style.display = 'none';
        answer.style.height = '';
        answer.style.opacity = '';
        answer.style.transition = '';
        answer.style.overflow = '';
        answer.removeEventListener('transitionend', handler);
      }
    );

    item.classList.remove('active');
  }
}

function initProductFaqAccordion() {
  document.querySelectorAll('.product-faq-image-section').forEach((section) => {
    if (!section.classList.contains('faq-initialized')) {
      section.classList.add('faq-initialized');
      new ProductFaqAccordion(section);
    }
  });
}

document.addEventListener('DOMContentLoaded', initProductFaqAccordion);

document.addEventListener('shopify:section:load', initProductFaqAccordion);