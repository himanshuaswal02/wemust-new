class CustomReviewsMarquee extends HTMLElement {
  constructor() {
    super();
    this.handleSectionLoad = this.handleSectionLoad.bind(this);
  }

  connectedCallback() {
    this.refresh();
    document.addEventListener('shopify:section:load', this.handleSectionLoad);
  }

  disconnectedCallback() {
    document.removeEventListener('shopify:section:load', this.handleSectionLoad);
  }

  handleSectionLoad(event) {
    if (event.target.contains(this)) {
      this.refresh();
    }
  }

  refresh() {
    this.querySelectorAll('[data-review-track]').forEach((track) => {
      const originalCards = [...track.children].filter((card) => !card.dataset.clone);

      track.querySelectorAll('[data-clone="true"]').forEach((clone) => clone.remove());

      if (originalCards.length < 2) return;

      originalCards.forEach((card) => {
        const clone = card.cloneNode(true);
        clone.dataset.clone = 'true';
        clone.setAttribute('aria-hidden', 'true');
        clone.removeAttribute('id');
        track.appendChild(clone);
      });
    });
  }
}

if (!customElements.get('custom-reviews-marquee')) {
  customElements.define('custom-reviews-marquee', CustomReviewsMarquee);
}
