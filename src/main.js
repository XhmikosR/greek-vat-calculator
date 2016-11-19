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
            totalCost.value = (Number(totalNetCost.value) + (Number(vatRate.value / 100) * totalNetCost.value)).toFixed(2);
            totalVat.value = (Number(totalCost.value) - Number(totalNetCost.value)).toFixed(2);

            totalVat.removeAttribute('disabled', '');
            totalCost.removeAttribute('disabled', '');
            totalCost.setAttribute('readonly', '');
        } else {
            totalNetCost.value = (Number(totalCost.value) / (1 + Number(vatRate.value / 100))).toFixed(2);
            totalVat.value = (Number(totalCost.value) - Number(totalNetCost.value)).toFixed(2);

            totalVat.removeAttribute('disabled', '');
            totalNetCost.removeAttribute('disabled', '');
            totalNetCost.setAttribute('readonly', '');
        }

        calcBtn.setAttribute('disabled', '');
    }

    function resetCalculator () {
        totalCost.value = 0;
        totalNetCost.value = 0;
        totalVat.value = 0;

        totalCost.removeAttribute('readonly');
        totalNetCost.removeAttribute('readonly');
        totalCost.removeAttribute('disabled');
        totalNetCost.removeAttribute('disabled');

        calcBtn.removeAttribute('disabled');
    }

    totalCost.addEventListener('input', function () {
        totalNetCost.setAttribute('disabled', '');
        totalNetCost.setAttribute('readonly', '');
        calcBtn.removeAttribute('disabled');
    });

    totalNetCost.addEventListener('input', function () {
        totalCost.setAttribute('disabled', '');
        totalCost.setAttribute('readonly', '');
        calcBtn.removeAttribute('disabled');
    });

    vatRate.addEventListener('input', function () {
        calcBtn.removeAttribute('disabled');
    });

    calcForm.addEventListener('submit', function (e) {
        e.preventDefault();
    });

    calcBtn.addEventListener('click', calculateVAT);
    resetBtn.addEventListener('click', resetCalculator);
})();
