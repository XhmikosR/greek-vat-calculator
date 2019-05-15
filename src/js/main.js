(function() {
    'use strict';

    function getElement(id) {
        return document.getElementById(id);
    }

    function addHasErrorClass(el) {
        return el.classList.add('is-invalid');
    }

    function removeHasErrorClass(el) {
        return el.classList.remove('is-invalid');
    }

    function setAttribute(el, attr) {
        return el.setAttribute(attr, '');
    }

    function removeAttribute(el, attr) {
        return el.removeAttribute(attr);
    }

    var totalCost = getElement('totalCost');
    var vatRate = getElement('vatRate');
    var totalVat = getElement('totalVat');
    var totalNetCost = getElement('totalNetCost');
    var calcBtn = getElement('calcBtn');
    var resetBtn = getElement('resetBtn');
    var calcForm = getElement('calcForm');

    function calculateVAT() {
        if (totalCost.hasAttribute('disabled')) {
            /* eslint-disable no-extra-parens */
            totalCost.value = (Number(totalNetCost.value) + (Number(vatRate.value / 100) * totalNetCost.value)).toFixed(2);
            /* eslint-enable no-extra-parens */
            totalVat.value = (Number(totalCost.value) - Number(totalNetCost.value)).toFixed(2);

            removeAttribute(totalVat, 'disabled');
            removeAttribute(totalCost, 'disabled');
            setAttribute(totalCost, 'readonly');
        } else {
            totalNetCost.value = (Number(totalCost.value) / (1 + Number(vatRate.value / 100))).toFixed(2);
            totalVat.value = (Number(totalCost.value) - Number(totalNetCost.value)).toFixed(2);

            removeAttribute(totalVat, 'disabled');
            removeAttribute(totalNetCost, 'disabled');
            setAttribute(totalNetCost, 'readonly');
        }

        setAttribute(calcBtn, 'disabled');
    }

    function resetCalculator() {
        totalCost.value = 0;
        totalNetCost.value = 0;
        totalVat.value = 0;

        calcForm.classList.remove('was-validated');
        removeHasErrorClass(totalCost);
        removeHasErrorClass(totalNetCost);
        removeHasErrorClass(vatRate);

        removeAttribute(totalCost, 'readonly');
        removeAttribute(totalNetCost, 'readonly');
        removeAttribute(totalCost, 'disabled');
        removeAttribute(totalNetCost, 'disabled');

        removeAttribute(calcBtn, 'disabled');
    }

    totalCost.addEventListener('input', function() {
        totalCost.classList.add('was-validated');

        if (totalCost.validity.valid) {
            removeHasErrorClass(totalCost);

            setAttribute(totalNetCost, 'disabled');
            setAttribute(totalNetCost, 'readonly');
            removeAttribute(calcBtn, 'disabled');
        } else {
            addHasErrorClass(totalCost);
            setAttribute(calcBtn, 'disabled');
        }
    });

    totalNetCost.addEventListener('input', function() {
        totalNetCost.classList.add('was-validated');

        if (totalNetCost.validity.valid) {
            removeHasErrorClass(totalNetCost);

            setAttribute(totalCost, 'disabled');
            setAttribute(totalCost, 'readonly');
            removeAttribute(calcBtn, 'disabled');
        } else {
            addHasErrorClass(totalNetCost);
            setAttribute(calcBtn, 'disabled');
        }
    });

    vatRate.addEventListener('input', function() {
        vatRate.classList.add('was-validated');

        if (vatRate.validity.valid) {
            removeHasErrorClass(vatRate);
            removeAttribute(calcBtn, 'disabled');
        } else {
            addHasErrorClass(vatRate);
            setAttribute(calcBtn, 'disabled');
        }
    });

    calcForm.addEventListener('submit', function(event) {
        event.preventDefault();
    });

    calcBtn.addEventListener('click', calculateVAT);
    resetBtn.addEventListener('click', resetCalculator);
})();
