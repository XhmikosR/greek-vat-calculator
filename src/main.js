(function() {
    'use strict';

    var totalCost = document.getElementById('totalCost');
    var vatRate = document.getElementById('vatRate');
    var totalVat = document.getElementById('totalVat');
    var totalNetCost = document.getElementById('totalNetCost');
    var calcBtn = document.getElementById('calcBtn');
    var resetBtn = document.getElementById('resetBtn');
    var calcForm = document.getElementById('calcForm');

    function calculateVAT () {
        if (totalCost.hasAttribute('disabled')) {
            /* eslint-disable no-extra-parens */
            totalCost.value = (Number(totalNetCost.value) + (Number(vatRate.value / 100) * totalNetCost.value)).toFixed(2);
            /* eslint-enable no-extra-parens */
            totalVat.value = (Number(totalCost.value) - Number(totalNetCost.value)).toFixed(2);

            totalVat.removeAttribute('disabled');
            totalCost.removeAttribute('disabled');
            totalCost.setAttribute('readonly', '');
        } else {
            totalNetCost.value = (Number(totalCost.value) / (1 + Number(vatRate.value / 100))).toFixed(2);
            totalVat.value = (Number(totalCost.value) - Number(totalNetCost.value)).toFixed(2);

            totalVat.removeAttribute('disabled');
            totalNetCost.removeAttribute('disabled');
            totalNetCost.setAttribute('readonly', '');
        }

        calcBtn.setAttribute('disabled', '');
    }

    function resetCalculator () {
        totalCost.value = 0;
        totalNetCost.value = 0;
        totalVat.value = 0;

        totalCost.parentNode.parentNode.classList.remove('has-error');
        totalNetCost.parentNode.parentNode.classList.remove('has-error');
        vatRate.parentNode.parentNode.classList.remove('has-error');

        totalCost.removeAttribute('readonly');
        totalNetCost.removeAttribute('readonly');
        totalCost.removeAttribute('disabled');
        totalNetCost.removeAttribute('disabled');

        calcBtn.removeAttribute('disabled');
    }

    totalCost.addEventListener('input', function () {
        if (totalCost.validity.valid) {
            totalCost.parentNode.parentNode.classList.remove('has-error');

            totalNetCost.setAttribute('disabled', '');
            totalNetCost.setAttribute('readonly', '');
            calcBtn.removeAttribute('disabled');
        } else {
            totalCost.parentNode.parentNode.classList.add('has-error');
            calcBtn.setAttribute('disabled', '');
        }
    });

    totalNetCost.addEventListener('input', function () {
        if (totalNetCost.validity.valid) {
            totalNetCost.parentNode.parentNode.classList.remove('has-error');

            totalCost.setAttribute('disabled', '');
            totalCost.setAttribute('readonly', '');
            calcBtn.removeAttribute('disabled');
        } else {
            totalNetCost.parentNode.parentNode.classList.add('has-error');
            calcBtn.setAttribute('disabled', '');
        }
    });

    vatRate.addEventListener('input', function () {
        if (vatRate.validity.valid) {
            vatRate.parentNode.parentNode.classList.remove('has-error');
            calcBtn.removeAttribute('disabled');
        } else {
            vatRate.parentNode.parentNode.classList.add('has-error');
            calcBtn.setAttribute('disabled', '');
        }
    });

    calcForm.addEventListener('submit', function (e) {
        e.preventDefault();
    });

    calcBtn.addEventListener('click', calculateVAT);
    resetBtn.addEventListener('click', resetCalculator);
})();
