let favCurs;

updateFavs();
async function updateFavs() {
  if (!localStorage.getItem('fav')) {
    localStorage.setItem('fav', JSON.stringify([]));
    favCurs = [];
  } else favCurs = await JSON.parse(localStorage.getItem('fav'));
}

let rates;
executeFetch();
async function executeFetch() {
  const resp = await fetch('https://api.exchangeratesapi.io/latest');
  const data = await resp.json();
  rates = data.rates;
};

let currencies = {};

async function getRates() {
  await executeFetch();
  return rates;
}

async function setOptions() {
  if (!rates) {
    currencies = await getRates();
  } else {
    currencies = rates;
  }
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

const ul = document.getElementById('ul');

function renderList (currencies) {
  for (let item in currencies) {
    if (favCurs.includes(item)) {
      const el = `<li><span class="fav clicked">★</span><span class="curr__name">${item}</span><span class="curr__value">${currencies[item]}</span></li>`;
      ul.insertAdjacentHTML('afterbegin', el);
    } else {
      const el = `<li><span class="fav">★</span><span class="curr__name">${item}</span><span class="curr__value">${currencies[item]}</span></li>`;
      ul.innerHTML += el;
    }
  }
}

async function setRates() {
  if (!rates) {
    currencies = await getRates();
  } else {
    currencies = rates;
  }
  renderList(currencies);
}

setRates();

async function setRatesChanged(currencies) {
  ul.innerHTML='';
  renderList(currencies);
}

document.getElementById('select-base-exch').addEventListener('change', async (e) => {
  if (!rates) {
    currencies = await getRates();
  } else {
    currencies = rates;
  }
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
    if (!rates) {
    currencies = await getRates();
  } else {
    currencies = rates;
  }
    const am = Number(e.target.value);
    const inRate = Number(currencies[inCur.value]);
    const outRate = Number(currencies[outCur.value]);
    document.getElementById('output-conv').value = ((am*inRate)/outRate).toFixed(2);
  }
});

ul.addEventListener('click', (e) => {
  if (e.target.classList.contains('fav')) {
    e.target.classList.toggle('clicked');
    if (e.target.classList.contains('clicked')) {
      favCurs.push(e.target.nextSibling.innerHTML);
    } else favCurs.pop(e.target.nextSibling.innerHTML);
    localStorage.setItem('fav', JSON.stringify(favCurs));
  }
})