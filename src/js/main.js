(function() {
    'use strict';

    function getElement(id) {
        return document.getElementById(id);
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

    var totalCost = getElement('totalCost');
    var vatRate = getElement('vatRate');
    var totalVat = getElement('totalVat');
    var totalNetCost = getElement('totalNetCost');
    var calcBtn = getElement('calcBtn');
    var resetBtn = getElement('resetBtn');
    var calcForm = getElement('calcForm');

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

        removeAttribute(calcBtn, 'disabled');
    }

    totalCost.addEventListener('input', function() {
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

    totalNetCost.addEventListener('input', function() {
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
