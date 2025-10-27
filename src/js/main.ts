// DOM Elements
const elements = {
  inputs: {
    amount: document.querySelector<HTMLInputElement>('#amount')!,
    vatRate: document.querySelector<HTMLInputElement>('#vatRate')!,
    modeWithVat: document.querySelector<HTMLInputElement>('#modeWithVat')!,
    modeWithoutVat: document.querySelector<HTMLInputElement>('#modeWithoutVat')!
  },
  outputs: {
    totalVat: document.querySelector<HTMLElement>('#totalVat')!,
    netAmount: document.querySelector<HTMLElement>('#netAmount')!,
    totalAmount: document.querySelector<HTMLElement>('#totalAmount')!
  },
  rows: {
    netAmountRow: document.querySelector<HTMLElement>('#netAmountRow')!,
    totalAmountRow: document.querySelector<HTMLElement>('#totalAmountRow')!,
    vatAmountSection: document.querySelector<HTMLElement>('#totalVat')!.closest<HTMLElement>('.mb-3')!
  },
  buttons: {
    calc: document.querySelector<HTMLButtonElement>('#calcBtn')!,
    reset: document.querySelector<HTMLButtonElement>('#resetBtn')!
  },
  form: document.querySelector<HTMLFormElement>('#calcForm')!,
  resultCard: document.querySelector<HTMLElement>('#resultCard')!,
  resultCardHeader: document.querySelector<HTMLElement>('#resultCardHeader')!,
  icons: {
    invalid: document.querySelector<HTMLElement>('#resultIconInvalid')!,
    valid: document.querySelector<HTMLElement>('#resultIconValid')!
  },
  labels: {
    withVat: document.querySelector<HTMLSpanElement>('#amountLabelWithVat')!,
    withoutVat: document.querySelector<HTMLSpanElement>('#amountLabelWithoutVat')!
  }
} as const;

// Constants
const DEFAULTS = {
  VAT_RATE: '24',
  CALCULATION_MODE: 'withVat' as const,
  EMPTY_VALUE: '—'
} as const;

// Number formatters
const displayFormatter = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2
});

const CSS_CLASSES = {
  HIDDEN: 'd-none',
  INVALID: 'is-invalid',
  BORDER_SECONDARY: 'border-secondary',
  BORDER_SUCCESS: 'border-success',
  BG_SECONDARY: 'bg-secondary',
  BG_SUCCESS: 'bg-success',
  TEXT_SECONDARY: 'text-secondary',
  TEXT_SUCCESS: 'text-success'
} as const;

// State
let calculationMode: 'withVat' | 'withoutVat' = DEFAULTS.CALCULATION_MODE;

// Utility functions
function toggleClasses(element: HTMLElement, classMap: Record<string, boolean>): void {
  for (const [className, shouldAdd] of Object.entries(classMap)) {
    element.classList.toggle(className, shouldAdd);
  }
}

function setElementState(element: HTMLElement, disabled: boolean): void {
  if (disabled) {
    element.setAttribute('disabled', '');
  } else {
    element.removeAttribute('disabled');
  }
}

function formatNumber(value: number): string {
  return displayFormatter.format(value);
}

function resetResultValues(): void {
  elements.outputs.netAmount.textContent = DEFAULTS.EMPTY_VALUE;
  elements.outputs.totalVat.textContent = DEFAULTS.EMPTY_VALUE;
  elements.outputs.totalAmount.textContent = DEFAULTS.EMPTY_VALUE;
}

// Row visibility management
function updateRowVisibility(): void {
  const showNet = calculationMode === 'withVat';
  elements.rows.netAmountRow.classList.toggle(CSS_CLASSES.HIDDEN, !showNet);
  elements.rows.totalAmountRow.classList.toggle(CSS_CLASSES.HIDDEN, showNet);
}

// Label management
function updateAmountLabel(): void {
  const showWithVat = calculationMode === 'withVat';
  elements.labels.withVat.classList.toggle(CSS_CLASSES.HIDDEN, !showWithVat);
  elements.labels.withoutVat.classList.toggle(CSS_CLASSES.HIDDEN, showWithVat);
}

// Button state management
function updateResetButtonState(): void {
  const hasInput =
    elements.inputs.amount.value !== '' ||
    elements.inputs.vatRate.value !== DEFAULTS.VAT_RATE ||
    calculationMode !== DEFAULTS.CALCULATION_MODE;

  setElementState(elements.buttons.reset, !hasInput);
}

// Result card styling
function updateResultCardState(isValid: boolean): void {
  const cardClasses = {
    [CSS_CLASSES.BORDER_SECONDARY]: !isValid,
    [CSS_CLASSES.BORDER_SUCCESS]: isValid
  };

  const headerClasses = {
    [CSS_CLASSES.BG_SECONDARY]: !isValid,
    [CSS_CLASSES.BG_SUCCESS]: isValid
  };

  const textClasses = {
    [CSS_CLASSES.TEXT_SECONDARY]: !isValid,
    [CSS_CLASSES.TEXT_SUCCESS]: isValid
  };

  const iconClasses = {
    [CSS_CLASSES.HIDDEN]: isValid
  };

  const validIconClasses = {
    [CSS_CLASSES.HIDDEN]: !isValid
  };

  toggleClasses(elements.resultCard, cardClasses);
  toggleClasses(elements.resultCardHeader, headerClasses);
  toggleClasses(elements.icons.invalid, iconClasses);
  toggleClasses(elements.icons.valid, validIconClasses);

  // Update all result sections
  const sections = [
    elements.rows.vatAmountSection,
    elements.rows.netAmountRow,
    elements.rows.totalAmountRow
  ];

  for (const section of sections) {
    toggleClasses(section, textClasses);

    const valueContainer = section.querySelector<HTMLElement>('.border');
    if (valueContainer) {
      toggleClasses(valueContainer, cardClasses);
    }
  }
}

// Validation
function validateInput(input: HTMLInputElement): boolean {
  const isValid = input.validity.valid && (input === elements.inputs.vatRate || input.value !== '');
  input.classList.toggle(CSS_CLASSES.INVALID, !isValid);
  return isValid;
}

function updateCalcButtonState(): void {
  const amountValid = validateInput(elements.inputs.amount);
  const vatValid = validateInput(elements.inputs.vatRate);
  const canCalculate = amountValid && vatValid;

  setElementState(elements.buttons.calc, !canCalculate);

  if (amountValid) {
    updateResultCardState(true);
  } else {
    updateResultCardState(false);
  }
}

// Main calculation logic
function calculateVAT(): void {
  const vatRateValue = Number(elements.inputs.vatRate.value);
  const inputValue = Number(elements.inputs.amount.value);

  const vatMultiplier = 1 + (vatRateValue / 100);

  let totalCostValue: number;
  let totalNetCostValue: number;

  if (calculationMode === 'withVat') {
    totalCostValue = inputValue;
    totalNetCostValue = totalCostValue / vatMultiplier;
  } else {
    totalNetCostValue = inputValue;
    totalCostValue = totalNetCostValue * vatMultiplier;
  }

  const vatAmount = totalCostValue - totalNetCostValue;

  // Update all result fields
  elements.outputs.netAmount.textContent = formatNumber(totalNetCostValue);
  elements.outputs.totalVat.textContent = formatNumber(vatAmount);
  elements.outputs.totalAmount.textContent = formatNumber(totalCostValue);

  updateRowVisibility();
  setElementState(elements.buttons.calc, true);
  updateResultCardState(true);
}

function resetCalculator(): void {
  elements.form.reset();
  elements.form.classList.remove('was-validated');

  // Reset input states
  for (const input of [elements.inputs.amount, elements.inputs.vatRate]) {
    input.removeAttribute('readonly');
    input.removeAttribute('disabled');
    input.classList.toggle(CSS_CLASSES.INVALID, false);
  }

  // Reset mode
  calculationMode = DEFAULTS.CALCULATION_MODE;
  elements.inputs.modeWithVat.checked = true;

  // Update UI
  updateAmountLabel();
  resetResultValues();
  updateRowVisibility();

  // Reset button states
  setElementState(elements.buttons.calc, true);
  setElementState(elements.buttons.reset, true);

  updateResultCardState(false);
}

function handleModeChange(): void {
  calculationMode = elements.inputs.modeWithVat.checked ? 'withVat' : 'withoutVat';

  updateAmountLabel();
  updateRowVisibility();

  elements.inputs.amount.value = '';
  // elements.inputs.amount.focus();

  resetResultValues();
  updateResultCardState(false);

  setElementState(elements.buttons.calc, true);
  updateResetButtonState();
}

function handleAmountInput(): void {
  updateCalcButtonState();
  updateResetButtonState();
}

function handleVatRateInput(): void {
  const isValid = validateInput(elements.inputs.vatRate);
  const canCalculate = isValid && elements.inputs.amount.value !== '';

  setElementState(elements.buttons.calc, !canCalculate);
  updateResetButtonState();
}

// Event listeners
function initializeEventListeners(): void {
  elements.form.addEventListener('submit', event => {
    event.preventDefault();
  });

  elements.inputs.modeWithVat.addEventListener('change', handleModeChange);
  elements.inputs.modeWithoutVat.addEventListener('change', handleModeChange);
  elements.inputs.amount.addEventListener('input', handleAmountInput);
  elements.inputs.vatRate.addEventListener('input', handleVatRateInput);
  elements.buttons.calc.addEventListener('click', calculateVAT);
  elements.buttons.reset.addEventListener('click', resetCalculator);
}

// Initialize application
function initialize(): void {
  updateAmountLabel();
  updateResetButtonState();
  initializeEventListeners();
}

initialize();
