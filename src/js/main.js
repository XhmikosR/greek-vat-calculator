const getElement = selector => document.querySelector(selector);

const addInvalidClass = element => element.classList.add('is-invalid');

const removeErrorClass = element => element.classList.remove('is-invalid');

const setBooleanAttribute = (element, attribute) => element.setAttribute(attribute, '');

const removeAttribute = (element, attribute) => element.removeAttribute(attribute);

const totalCost = getElement('#totalCost');
const vatRate = getElement('#vatRate');
const totalVat = getElement('#totalVat');
const totalNetCost = getElement('#totalNetCost');
const calcBtn = getElement('#calcBtn');
const resetBtn = getElement('#resetBtn');
const calcForm = getElement('#calcForm');

function calculateVAT() {
  if (totalCost.hasAttribute('disabled')) {
    totalCost.value = (Number(totalNetCost.value) + (Number(vatRate.value / 100) * totalNetCost.value)).toFixed(2);
    totalVat.value = (Number(totalCost.value) - Number(totalNetCost.value)).toFixed(2);

    removeAttribute(totalVat, 'disabled');
    removeAttribute(totalCost, 'disabled');
    setBooleanAttribute(totalCost, 'readonly');
  } else {
    totalNetCost.value = (Number(totalCost.value) / (1 + Number(vatRate.value / 100))).toFixed(2);
    totalVat.value = (Number(totalCost.value) - Number(totalNetCost.value)).toFixed(2);

    removeAttribute(totalVat, 'disabled');
    removeAttribute(totalNetCost, 'disabled');
    setBooleanAttribute(totalNetCost, 'readonly');
  }

  setBooleanAttribute(calcBtn, 'disabled');
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
}

totalCost.addEventListener('input', () => {
  totalCost.classList.add('was-validated');

  if (totalCost.validity.valid) {
    removeErrorClass(totalCost);

    setBooleanAttribute(totalNetCost, 'disabled');
    setBooleanAttribute(totalNetCost, 'readonly');
    removeAttribute(calcBtn, 'disabled');
  } else {
    addInvalidClass(totalCost);
    setBooleanAttribute(calcBtn, 'disabled');
  }
});

totalNetCost.addEventListener('input', () => {
  totalNetCost.classList.add('was-validated');

  if (totalNetCost.validity.valid) {
    removeErrorClass(totalNetCost);

    setBooleanAttribute(totalCost, 'disabled');
    setBooleanAttribute(totalCost, 'readonly');
    removeAttribute(calcBtn, 'disabled');
  } else {
    addInvalidClass(totalNetCost);
    setBooleanAttribute(calcBtn, 'disabled');
  }
});

vatRate.addEventListener('input', () => {
  vatRate.classList.add('was-validated');

  if (vatRate.validity.valid) {
    removeErrorClass(vatRate);
    removeAttribute(calcBtn, 'disabled');
  } else {
    addInvalidClass(vatRate);
    setBooleanAttribute(calcBtn, 'disabled');
  }
});

calcForm.addEventListener('submit', event => {
  event.preventDefault();
});

calcBtn.addEventListener('click', calculateVAT);
resetBtn.addEventListener('click', resetCalculator);
