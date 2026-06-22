(function () {
  const DRAWER_SELECTOR = '.js-cart-drawer';
  const ITEM_SELECTOR = '.cart-item';
  const INPUT_SELECTOR = '.cart-item__quantity-input';
  const DECREASE_SELECTOR = '.quantity-down';
  const INCREASE_SELECTOR = '.quantity-up';

  function getCartItem(element) {
    return element.closest(`${DRAWER_SELECTOR} ${ITEM_SELECTOR}`);
  }

  function getMinQuantity(cartItem) {
    const minQuantity = parseInt(cartItem?.dataset.minQuantity, 10);

    return Number.isNaN(minQuantity) ? null : minQuantity;
  }

  function updateQuantityState(cartItem) {
    if (!cartItem) return null;

    const minQuantity = getMinQuantity(cartItem);

    if (!minQuantity) return null;

    const quantityInput = cartItem.querySelector(INPUT_SELECTOR);
    const decreaseBtn = cartItem.querySelector(DECREASE_SELECTOR);

    if (!quantityInput) return null;

    let currentValue = parseInt(quantityInput.value, 10);

    if (isNaN(currentValue) || currentValue < minQuantity) {
      quantityInput.value = minQuantity;
      currentValue = minQuantity;
    }

    quantityInput.setAttribute('min', minQuantity);

    if (decreaseBtn) {
      if (currentValue <= minQuantity) {
        decreaseBtn.classList.add('disabled');
        decreaseBtn.setAttribute('aria-disabled', 'true');
      } else {
        decreaseBtn.classList.remove('disabled');
        decreaseBtn.removeAttribute('aria-disabled');
      }
    }

    return quantityInput;
  }

  function updateCartItem(cartItem) {
    setTimeout(function () {
      const quantityInput = updateQuantityState(cartItem);

      if (quantityInput && !quantityInput.disabled) {
        quantityInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, 5);
  }

  function updateAllCartItems() {
    document.querySelectorAll(`${DRAWER_SELECTOR} ${ITEM_SELECTOR}`).forEach(updateQuantityState);
  }

  document.addEventListener(
    'click',
    function (event) {
      const decreaseBtn = event.target.closest(`${DRAWER_SELECTOR} ${DECREASE_SELECTOR}`);
      const increaseBtn = event.target.closest(`${DRAWER_SELECTOR} ${INCREASE_SELECTOR}`);

      if (decreaseBtn) {
        const cartItem = getCartItem(decreaseBtn);
        const minQuantity = getMinQuantity(cartItem);

        if (!minQuantity) return;

        const quantityInput = cartItem?.querySelector(INPUT_SELECTOR);
        const currentValue = parseInt(quantityInput?.value, 10);

        if (isNaN(currentValue) || currentValue <= minQuantity) {
          event.preventDefault();
          event.stopImmediatePropagation();
          updateQuantityState(cartItem);
          return;
        }

        updateCartItem(cartItem);
      }

      if (increaseBtn) {
        const cartItem = getCartItem(increaseBtn);

        if (!getMinQuantity(cartItem)) return;

        updateCartItem(cartItem);
      }
    },
    true
  );

  document.addEventListener(
    'change',
    function (event) {
      if (!event.target.matches(`${DRAWER_SELECTOR} ${INPUT_SELECTOR}`)) return;

      const cartItem = getCartItem(event.target);
      const minQuantity = getMinQuantity(cartItem);

      if (!minQuantity) return;

      const currentValue = parseInt(event.target.value, 10);

      if (isNaN(currentValue) || currentValue < minQuantity) {
        event.preventDefault();
        event.stopImmediatePropagation();
        updateCartItem(cartItem);
      } else {
        updateQuantityState(cartItem);
      }
    },
    true
  );

  document.addEventListener('on:cart:after-merge', updateAllCartItems);
  document.addEventListener('dispatch:cart-drawer:open', updateAllCartItems);
  document.addEventListener('DOMContentLoaded', updateAllCartItems);
})();
