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

let activeInputField: 'totalCost' | 'totalNetCost' | undefined;

function updateResetButtonState(): void {
  const hasInput = totalCost.value || totalNetCost.value || vatRate.value !== '24';
  if (hasInput) {
    removeAttribute(resetBtn, 'disabled');
  } else {
    setAttribute(resetBtn, 'disabled');
  }
}

function toggleClass(element: HTMLElement, className: string, add: boolean): void {
  element.classList.toggle(className, add);
}

function setAttribute(element: HTMLElement, attribute: string, value = ''): void {
  element.setAttribute(attribute, value);
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

const numberFormatOptions: Intl.NumberFormatOptions = {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2
};

const inputFormatOptions: Intl.NumberFormatOptions = {
  ...numberFormatOptions,
  useGrouping: false
};

function formatNumber(value: number, options: Intl.NumberFormatOptions): string {
  return value.toLocaleString(undefined, options);
}

function calculateVAT(): void {
  const vatRateValue = Number(vatRate.value);
  let totalCostValue: number;
  let totalNetCostValue: number;

  if (activeInputField === 'totalNetCost') {
    totalNetCostValue = Number(totalNetCost.value);
    totalCostValue = totalNetCostValue * (1 + (vatRateValue / 100));
    totalCost.value = formatNumber(totalCostValue, inputFormatOptions);
    setAttribute(totalCost, 'readonly');
  } else {
    totalCostValue = Number(totalCost.value);
    totalNetCostValue = totalCostValue / (1 + (vatRateValue / 100));
    totalNetCost.value = formatNumber(totalNetCostValue, inputFormatOptions);
    setAttribute(totalNetCost, 'readonly');
  }

  const vatAmount = totalCostValue - totalNetCostValue;
  totalVat.textContent = formatNumber(vatAmount, numberFormatOptions);

  setAttribute(calcBtn, 'disabled');
  updateResultCardState(true);
}

function resetCalculator(): void {
  calcForm.reset();
  calcForm.classList.remove('was-validated');

  const inputs = [totalCost, totalNetCost, vatRate];
  for (const input of inputs) {
    toggleClass(input, 'is-invalid', false);
    removeAttribute(input, 'readonly');
    removeAttribute(input, 'disabled');
  }

  activeInputField = undefined;
  setAttribute(calcBtn, 'disabled');
  setAttribute(resetBtn, 'disabled');
  totalVat.textContent = '—';
  updateResultCardState(false);
}

function handleCostInputChange(
  activeInput: HTMLInputElement,
  inactiveInput: HTMLInputElement,
  inputFieldName: 'totalCost' | 'totalNetCost'
): void {
  const isValid = activeInput.validity.valid;

  toggleClass(activeInput, 'is-invalid', !isValid);

  if (isValid) {
    activeInputField = inputFieldName;
    setAttribute(inactiveInput, 'disabled');
    setAttribute(inactiveInput, 'readonly');
    removeAttribute(calcBtn, 'disabled');
    updateResultCardState(true);
  } else {
    setAttribute(calcBtn, 'disabled');
    updateResultCardState(false);
  }

  updateResetButtonState();
}

totalCost.addEventListener('input', () => {
  handleCostInputChange(totalCost, totalNetCost, 'totalCost');
});

totalNetCost.addEventListener('input', () => {
  handleCostInputChange(totalNetCost, totalCost, 'totalNetCost');
});

vatRate.addEventListener('input', () => {
  const isValid = vatRate.validity.valid;

  toggleClass(vatRate, 'is-invalid', !isValid);

  if (isValid) {
    removeAttribute(calcBtn, 'disabled');
  } else {
    setAttribute(calcBtn, 'disabled');
  }

  updateResetButtonState();
});

calcForm.addEventListener('submit', event => {
  event.preventDefault();
});

calcBtn.addEventListener('click', calculateVAT);
resetBtn.addEventListener('click', resetCalculator);

// Initialize reset button state on page load
updateResetButtonState();
