let rates = {};

async function executeFetch() {
  const resp = await fetch('https://api.exchangeratesapi.io/latest');
  const data = await resp.json();
  rates = data.rates;
};

async function getRates() {
  await executeFetch();
  return rates;
}

async function setOptions() {
  const currencies = await getRates();
  const selects = document.getElementsByTagName('select');
  [...selects].forEach((it) => {
    Object.keys(currencies).forEach((curr) => {
      const opt = document.createElement('option');
      opt.value = curr;
      opt.textContent = curr;
      it.appendChild(opt);
    });
  })
}

setOptions();

async function setRates() {
  const currencies = await getRates();
  for (let item in currencies) {
    const el = `<li><span class="curr__name">${item}</span><span class="curr__value">${currencies[item]}</span></li>`;
    document.getElementById('ul').innerHTML += el;
  }
}

setRates();

function setRatesChanged(currencies) {
  document.getElementById('ul').innerHTML='';
  for (let item in currencies) {
    const el = `<li><span class="curr__name">${item}</span><span class="curr__value">${currencies[item]}</span></li>`;
    document.getElementById('ul').innerHTML += el;
  }
}

document.getElementById('select-base-exch').addEventListener('change', async (e) => {
  const currencies = await getRates();
  let c = {};
  for (let item in currencies) {
    currencies[item] = Number(currencies[item]/currencies[e.target.value]).toFixed(3);
  }
  setRatesChanged(currencies);
  localStorage.setItem('base', e.target.value);

}) 

const cards = document.querySelectorAll('.card');

document.querySelectorAll('input[name="mode-switcher__mode"]').forEach((it) => {
  it.addEventListener('change', () => {
    cards.forEach((it) => it.classList.toggle('hidden'));
    if (document.getElementById('curr').checked) window.location.hash = '/currencies';
    else {
      window.location.hash = '/converter';
      inCur.value = localStorage.getItem('base');
    };
  })
});

const convSelects = document.querySelectorAll('#conv-form select');
const inCur = document.getElementById('select-base-conv');
const outCur = document.getElementById('select-comp-conv');

document.getElementById('input-conv').addEventListener('input', async (e) => {
  if (![...convSelects].every((i) => i.value == '')) {
    const currencies = await getRates();
    const am = e.target.value;
    const inRate = currencies[inCur.value];
    const outRate = currencies[outCur.value];
    document.getElementById('output-conv').value = ((am*inRate)/outRate).toFixed(2);
  }
})