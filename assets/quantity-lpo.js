(function () {
 
  const QUANTITY_SELECTOR = 'input[name="quantity"]';
  const FORM_SELECTOR_FALLBACK = 'form.product, form.product-form, form'; 

  const formTimers = new WeakMap();

  function debouncePerForm(form, fn, wait = 150) {
    const existing = formTimers.get(form);
    if (existing) clearTimeout(existing);
    const t = setTimeout(() => {
      formTimers.delete(form);
      try { fn(); } catch (err) { console.error(err); }
    }, wait);
    formTimers.set(form, t);
  }

  
  function findProductForm(el) {
    if (!el) return null;
   
    for (const sel of FORM_SELECTOR_FALLBACK.split(',')) {
      const matched = el.closest(sel.trim());
      if (matched) return matched;
    }
   
    return el.closest('form') || null;
  }

 
  function triggerLpoRerender(productForm) {
    if (!productForm) return;
   
    const ev = new CustomEvent('options:render', { detail: null, cancelable: true, bubbles: true });
    productForm.dispatchEvent(ev);
   
  }

 
  document.addEventListener('input', function (e) {
    const input = e.target;
    if (!input || !input.matches(QUANTITY_SELECTOR)) return;

    const productForm = findProductForm(input);
    if (!productForm) return;

   
    debouncePerForm(productForm, () => {
      triggerLpoRerender(productForm);
    }, 120);
  }, { passive: true });

 
  document.addEventListener('change', function (e) {
    const input = e.target;
    if (!input || !input.matches(QUANTITY_SELECTOR)) return;

    const productForm = findProductForm(input);
    if (!productForm) return;

   
    triggerLpoRerender(productForm);
  });

  
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('[data-quantity], .qty-plus, .qty-minus, .quantity-stepper');
    if (!btn) return;

    
    const qty = btn.closest('label, .quantity-wrapper, .product-block')?.querySelector(QUANTITY_SELECTOR)
               || document.querySelector(QUANTITY_SELECTOR);

    const productForm = findProductForm(qty);
    if (!productForm) return;

  
    setTimeout(() => {
      debouncePerForm(productForm, () => triggerLpoRerender(productForm), 60);
    }, 0);
  });

 
  window.debugTriggerLpoForAllQuantityForms = function () {
    document.querySelectorAll(QUANTITY_SELECTOR).forEach(input => {
      const f = findProductForm(input);
      if (f) triggerLpoRerender(f);
    });
  };


  console.debug('Quantity -> LPO renderer bridge active for selector:', QUANTITY_SELECTOR);
})();