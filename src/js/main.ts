const calcForm = document.querySelector<HTMLFormElement>('#calcForm')!;
const amount = document.querySelector<HTMLInputElement>('#amount')!;
const amountLabel = document.querySelector<HTMLLabelElement>('#amountLabel')!;
const amountError = document.querySelector<HTMLElement>('#amountError')!;
const modeWithVat = document.querySelector<HTMLInputElement>('#modeWithVat')!;
const vatRate = document.querySelector<HTMLInputElement>('#vatRate')!;
const vatRateError = document.querySelector<HTMLElement>('#vatRateError')!;
const vatPresets = document.querySelectorAll<HTMLInputElement>('[name="vatPreset"]');
const vatLabel = document.querySelector<HTMLElement>('#label-totalVat')!;
const netAmount = document.querySelector<HTMLOutputElement>('#netAmount')!;
const totalVat = document.querySelector<HTMLOutputElement>('#totalVat')!;
const totalAmount = document.querySelector<HTMLOutputElement>('#totalAmount')!;
const copyButtons = document.querySelectorAll<HTMLButtonElement>('dd button');
const statusText = document.querySelector<HTMLElement>('#status')!;
const resetBtn = document.querySelector<HTMLButtonElement>('#resetBtn')!;

const moneyFormat = new Intl.NumberFormat('el-GR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

// Copied without thousands dots, so it can be pasted back into the amount
const plainFormat = new Intl.NumberFormat('el-GR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  useGrouping: false
});

const rateFormat = new Intl.NumberFormat('el-GR', {
  maximumFractionDigits: 2
});

const amountHint = 'Εισάγετε ποσό από 0,01 έως 999.999.999,99 €.';
const rateHint = 'Εισάγετε συντελεστή από 0,1 έως 99,9%.';

// Returns hundredths (cents, or hundredths of a percent), or NaN.
// Dots group thousands in 1.500 and 1.234,50; in 12.50 the dot is the decimal mark.
function parse(text: string): number {
  let value = text.replace(/[\s€]/g, '');

  if (/^[1-9]\d{0,2}(?:\.\d{3})+(?:,\d*)?$/.test(value)) {
    value = value.replace(/\./g, '');
  }

  value = value.replace(',', '.');

  const isNumber = /\d/.test(value) && /^\d{0,9}(?:\.\d{0,2})?$/.test(value);
  return isNumber ? Math.round(Number(value) * 100) : NaN;
}

function isValidAmount(cents: number): boolean {
  return cents >= 1;
}

function isValidRate(rate: number): boolean {
  return rate >= 10 && rate <= 9990;
}

function amountMessage(allowEmpty: boolean): string {
  if (allowEmpty && amount.value.trim() === '') {
    return '';
  }

  return isValidAmount(parse(amount.value)) ? '' : amountHint;
}

function rateMessage(): string {
  return isValidRate(parse(vatRate.value)) ? '' : rateHint;
}

function setError(input: HTMLInputElement, feedback: HTMLElement, message: string): void {
  feedback.textContent = message;
  input.classList.toggle('is-invalid', message !== '');

  // A hidden message referenced by aria-describedby is still read, so only point to it when shown
  if (message === '') {
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
  } else {
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', feedback.id);
  }
}

function showValue(output: HTMLOutputElement, cents: number, isComputed: boolean): void {
  const row = output.closest('div');
  if (!row) return;

  output.value = `${moneyFormat.format(cents / 100)} €`;
  const button = row.querySelector('button');
  if (button) button.value = plainFormat.format(cents / 100);
  row.classList.toggle('fw-semibold', isComputed);
  row.classList.toggle('text-body-secondary', !isComputed);
}

function render(): void {
  const includesVat = modeWithVat.checked;
  const cents = parse(amount.value);
  const rate = parse(vatRate.value);
  const hasRate = isValidRate(rate);
  const hasResult = hasRate && isValidAmount(cents);
  let vat = 0;
  let net = 0;

  // Round the VAT once and derive the net from it, so the parts always add up to the total
  if (hasResult) {
    vat = Math.round(cents * rate / (includesVat ? 10_000 + rate : 10_000));
    net = includesVat ? cents - vat : cents;
  }

  amountLabel.textContent = includesVat ? 'Ποσό με ΦΠΑ' : 'Ποσό χωρίς ΦΠΑ';
  vatLabel.textContent = hasRate ? `ΦΠΑ ${rateFormat.format(rate / 100)}%` : 'ΦΠΑ';

  showValue(netAmount, net, hasResult && includesVat);
  showValue(totalVat, vat, hasResult);
  showValue(totalAmount, net + vat, hasResult && !includesVat);

  for (const button of copyButtons) {
    button.classList.toggle('invisible', !hasResult);
  }

  for (const preset of vatPresets) {
    preset.checked = Number(preset.value) * 100 === rate;
  }
}

function announce(): void {
  const hasResult = isValidAmount(parse(amount.value)) && isValidRate(parse(vatRate.value));
  const message = hasResult ?
    `Ποσό χωρίς ΦΠΑ ${netAmount.value}, ${vatLabel.textContent} ${totalVat.value}, ποσό με ΦΠΑ ${totalAmount.value}.` :
    `${amountError.textContent} ${vatRateError.textContent}`.trim();

  // Enter and the change on the next blur bring the same text
  if (statusText.textContent !== message) {
    statusText.textContent = message;
  }
}

function showCopied(button: HTMLButtonElement): void {
  const icon = button.querySelector('use');
  if (!icon) return;

  icon.setAttribute('href', '#icon-check');
  clearTimeout(Number(button.dataset.timer));
  button.dataset.timer = String(setTimeout(() => {
    icon.setAttribute('href', '#icon-copy');
  }, 1500));
}

function copyValue(button: HTMLButtonElement): void {
  navigator.clipboard.writeText(button.value)
    .then(() => {
      showCopied(button);
      statusText.textContent = `Αντιγράφηκε: ${button.value}`;
    })
    .catch(() => {
      // Select the figure so it can still be copied by hand
      document.getSelection()!.selectAllChildren(button.previousElementSibling!);
      statusText.textContent = 'Η αντιγραφή απέτυχε';
    });
}

calcForm.addEventListener('input', event => {
  const {target} = event;

  if (target instanceof HTMLInputElement && target.name === 'vatPreset') {
    vatRate.value = target.value;
  }

  if (amountMessage(true) === '') {
    setError(amount, amountError, '');
  }

  if (rateMessage() === '') {
    setError(vatRate, vatRateError, '');
  }

  statusText.textContent = '';
  render();
});

calcForm.addEventListener('change', event => {
  if (event.target === amount) {
    setError(amount, amountError, amountMessage(true));
  } else if (event.target === vatRate) {
    setError(vatRate, vatRateError, rateMessage());
  }

  announce();
});

calcForm.addEventListener('keydown', event => {
  const {target} = event;

  if (event.key !== 'Enter' || !(target instanceof HTMLInputElement) || target.type !== 'text') {
    return;
  }

  // Enter also fires change; skip that second pass
  event.preventDefault();
  setError(amount, amountError, amountMessage(false));
  setError(vatRate, vatRateError, rateMessage());
  announce();

  // Closes the on-screen keyboard
  if (globalThis.matchMedia('(pointer: coarse)').matches) {
    target.blur();
  }
});

resetBtn.addEventListener('click', () => {
  calcForm.reset();
  setError(amount, amountError, '');
  setError(vatRate, vatRateError, '');
  statusText.textContent = '';
  render();

  // On touch screens this would bring up the keyboard
  if (!globalThis.matchMedia('(pointer: coarse)').matches) {
    amount.focus();
  }
});

if ('clipboard' in navigator && 'writeText' in navigator.clipboard) {
  for (const button of copyButtons) {
    button.hidden = false;
    button.addEventListener('click', () => {
      copyValue(button);
    });
  }
}

render();

if (__PROD__ && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => {/* non-fatal */});
}
