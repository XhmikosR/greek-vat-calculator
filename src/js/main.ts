const totalCost = document.querySelector<HTMLInputElement>('#totalCost')!;
const vatRate = document.querySelector<HTMLInputElement>('#vatRate')!;
const totalVat = document.querySelector<HTMLElement>('#totalVat')!;
const totalNetCost = document.querySelector<HTMLInputElement>('#totalNetCost')!;
const calcBtn = document.querySelector<HTMLButtonElement>('#calcBtn')!;
const resetBtn = document.querySelector<HTMLButtonElement>('#resetBtn')!;
const calcForm = document.querySelector<HTMLFormElement>('#calcForm')!;
const resultCard = document.querySelector<HTMLElement>('#resultCard')!;
const resultCardHeader = document.querySelector<HTMLElement>('#resultCardHeader')!;
const resultLabel = document.querySelector<HTMLElement>('#resultLabel')!;
const resultBox = document.querySelector<HTMLElement>('#resultBox')!;
const resultCurrency = document.querySelector<HTMLElement>('#resultCurrency')!;

function addInvalidClass(element: HTMLElement): void {
  element.classList.add('is-invalid');
}

function removeErrorClass(element: HTMLElement): void {
  element.classList.remove('is-invalid');
}

function setBooleanAttribute(element: HTMLElement, attribute: string): void {
  element.setAttribute(attribute, '');
}

function removeAttribute(element: HTMLElement, attribute: string): void {
  element.removeAttribute(attribute);
}

function updateResultCardState(isValid: boolean): void {
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

function calculateVAT(): void {
  if (totalCost.hasAttribute('disabled')) {
    const calculated = Number(totalNetCost.value) + (Number(vatRate.value) / 100 * Number(totalNetCost.value));

    totalCost.value = calculated.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      useGrouping: false
    });
    const vatAmount = Number(totalCost.value) - Number(totalNetCost.value);

    totalVat.textContent = vatAmount.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });

    setBooleanAttribute(totalCost, 'readonly');
  } else {
    const calculated = Number(totalCost.value) / (1 + (Number(vatRate.value) / 100));

    totalNetCost.value = calculated.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      useGrouping: false
    });
    const vatAmount = Number(totalCost.value) - Number(totalNetCost.value);

    totalVat.textContent = vatAmount.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });

    setBooleanAttribute(totalNetCost, 'readonly');
  }

  setBooleanAttribute(calcBtn, 'disabled');
  updateResultCardState(true);
}

function resetCalculator(): void {
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

totalCost.addEventListener('input', () => {
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

totalNetCost.addEventListener('input', () => {
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
