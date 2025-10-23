// @ts-nocheck

(function() {
  'use strict';

  function getElement(selector) {
    return document.querySelector(selector);
  }

  function addInvalidClass(element) {
    return element.classList.add('is-invalid');
  }

  function removeErrorClass(element) {
    return element.classList.remove('is-invalid');
  }

  function setBooleanAttribute(element, attribute) {
    return element.setAttribute(attribute, '');
  }

  function removeAttribute(element, attribute) {
    return element.removeAttribute(attribute);
  }

  var totalCost = getElement('#totalCost');
  var vatRate = getElement('#vatRate');
  var totalVat = getElement('#totalVat');
  var totalNetCost = getElement('#totalNetCost');
  var calcBtn = getElement('#calcBtn');
  var resetBtn = getElement('#resetBtn');
  var calcForm = getElement('#calcForm');
  var resultCard = getElement('#resultCard');
  var resultCardHeader = getElement('#resultCardHeader');
  var resultLabel = getElement('#resultLabel');
  var resultBox = getElement('#resultBox');
  var resultCurrency = getElement('#resultCurrency');

  function updateResultCardState(isValid) {
    if (!resultCard || !resultCardHeader || !resultLabel || !resultBox || !resultCurrency || !totalVat) {
      return;
    }

    resultCard.classList.toggle('border-secondary', !isValid);
    resultCard.classList.toggle('border-success', isValid);
    resultCardHeader.classList.toggle('bg-secondary', !isValid);
    resultCardHeader.classList.toggle('bg-success', isValid);

    resultLabel.classList.toggle('text-secondary', !isValid);
    resultLabel.classList.toggle('text-success', isValid);

    resultBox.classList.toggle('border-secondary', !isValid);
    resultBox.classList.toggle('border-success', isValid);

    totalVat.classList.toggle('text-secondary', !isValid);
    totalVat.classList.toggle('text-success', isValid);
    resultCurrency.classList.toggle('text-secondary', !isValid);
    resultCurrency.classList.toggle('text-success', isValid);
  }

  function calculateVAT() {
    if (totalCost.hasAttribute('disabled')) {
      var calculated = Number(totalNetCost.value) + (Number(vatRate.value / 100) * totalNetCost.value);

      totalCost.value = calculated.toLocaleString(undefined, { minimumFractionDigits: 0,
        maximumFractionDigits: 2,
        useGrouping: false });
      var vatAmount = Number(totalCost.value) - Number(totalNetCost.value);

      totalVat.textContent = vatAmount.toLocaleString(undefined, { minimumFractionDigits: 0,
        maximumFractionDigits: 2 });

      setBooleanAttribute(totalCost, 'readonly');
    } else {
      var calculated = Number(totalCost.value) / (1 + Number(vatRate.value / 100));

      totalNetCost.value = calculated.toLocaleString(undefined, { minimumFractionDigits: 0,
        maximumFractionDigits: 2,
        useGrouping: false });
      var vatAmount = Number(totalCost.value) - Number(totalNetCost.value);

      totalVat.textContent = vatAmount.toLocaleString(undefined, { minimumFractionDigits: 0,
        maximumFractionDigits: 2 });

      setBooleanAttribute(totalNetCost, 'readonly');
    }

    setBooleanAttribute(calcBtn, 'disabled');
    updateResultCardState(true);
  }

  function resetCalculator() {
    calcForm.reset();

    calcForm.classList.remove('was-validated');
    removeErrorClass(totalCost);
    removeErrorClass(totalNetCost);
    removeErrorClass(vatRate);

    removeAttribute(totalCost, 'readonly');
    removeAttribute(totalNetCost, 'readonly');
    removeAttribute(totalCost, 'disabled');
    removeAttribute(totalNetCost, 'disabled');

    setBooleanAttribute(calcBtn, 'disabled');

    totalVat.textContent = '—';

    updateResultCardState(false);
  }

  totalCost.addEventListener('input', function() {
    totalCost.classList.add('was-validated');

    if (totalCost.validity.valid) {
      removeErrorClass(totalCost);

      setBooleanAttribute(totalNetCost, 'disabled');
      setBooleanAttribute(totalNetCost, 'readonly');
      removeAttribute(calcBtn, 'disabled');
      updateResultCardState(true);
    } else {
      addInvalidClass(totalCost);
      setBooleanAttribute(calcBtn, 'disabled');
      updateResultCardState(false);
    }
  });

  totalNetCost.addEventListener('input', function() {
    totalNetCost.classList.add('was-validated');

    if (totalNetCost.validity.valid) {
      removeErrorClass(totalNetCost);

      setBooleanAttribute(totalCost, 'disabled');
      setBooleanAttribute(totalCost, 'readonly');
      removeAttribute(calcBtn, 'disabled');
      updateResultCardState(true);
    } else {
      addInvalidClass(totalNetCost);
      setBooleanAttribute(calcBtn, 'disabled');
      updateResultCardState(false);
    }
  });

  vatRate.addEventListener('input', function() {
    vatRate.classList.add('was-validated');

    if (vatRate.validity.valid) {
      removeErrorClass(vatRate);
      removeAttribute(calcBtn, 'disabled');
    } else {
      addInvalidClass(vatRate);
      setBooleanAttribute(calcBtn, 'disabled');
    }
  });

  calcForm.addEventListener('submit', function(event) {
    event.preventDefault();
  });

  calcBtn.addEventListener('click', calculateVAT);
  resetBtn.addEventListener('click', resetCalculator);
})();
