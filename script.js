const taxRate = 0.10;
const serviceRate = 0.05;
let items = [];
let logos = [
  "https://cdn.idntimes.com/content-images/post/20230903/370492988-18307156384105239-8602637916822519873-n-96a1ed2d7126f62352f4341cd0c6f342_600x400.jpg"
];

const itemNameInput = document.getElementById("itemName");
const itemPriceInput = document.getElementById("itemPrice");
const itemsList = document.getElementById("items-list");
const subtotalDiv = document.getElementById("subtotal");
const taxDiv = document.getElementById("tax");
const serviceDiv = document.getElementById("service");
const tipCustomDiv = document.getElementById("tipCustom");
const tipPercentageDiv = document.getElementById("tipPercentage");
const totalDiv = document.getElementById("total");
const qrContainer = document.getElementById("qrcode");
const customTipInput = document.getElementById("customTip");
const percentageTipSelect = document.getElementById("percentageTip");
const languageSelect = document.getElementById("languageSelect");
const titleDiv = document.getElementById("title");
const receiptInfoDiv = document.getElementById("receiptInfo");
const logosContainer = document.getElementById("logosContainer");

const labels = {
  en: { title:"RESTAURANT RECEIPT", subtotal:"Subtotal", tax:"Tax", service:"Service", tip:"Tip", total:"Total", customTip:"Custom Tip", percentageTip:"Percentage Tip", receipt:"Receipt", date:"Date & Time" },
  id: { title:"STRUK RESTORAN", subtotal:"Subtotal", tax:"Pajak", service:"Layanan", tip:"Tips", total:"Total", customTip:"Tips Manual", percentageTip:"Tips %", receipt:"No Struk", date:"Tanggal & Waktu" }
};

function formatCurrency(amount,currency="IDR"){
  return currency==="IDR"
    ? "Rp "+amount.toLocaleString("id-ID",{minimumFractionDigits:2, maximumFractionDigits:2})
    : amount.toFixed(2);
}

function generateReceiptNumber(){
  return 'R'+(new Date().getTime().toString().slice(-5));
}

function getCurrentDateTime(){
  return new Date().toLocaleString();
}

function renderLogos(){
  logosContainer.innerHTML = "";
  logos.forEach(logo => {
    const img = document.createElement("img");
    img.src = logo;
    logosContainer.appendChild(img);
  });
}

renderLogos();

function addItem(){
  const name = itemNameInput.value.trim();
  const price = parseFloat(itemPriceInput.value) || 0;
  if(name === "" || price <= 0) return;
  items.push({ name, price });
  itemNameInput.value = "";
  itemPriceInput.value = "";
  renderReceipt();
}

function clearItems(){
  items = [];
  renderReceipt();
}

[itemPriceInput, customTipInput, percentageTipSelect, languageSelect, itemNameInput].forEach(el=>{
  el.addEventListener("input", renderReceipt);
  el.addEventListener("change", renderReceipt);
});

function renderReceipt(){
  const lang = languageSelect.value;
  const label = labels[lang];

  titleDiv.textContent = label.title;
  itemsList.innerHTML = "";

  items.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${item.name}</td><td>${formatCurrency(item.price,'IDR')}</td>`;
    itemsList.appendChild(tr);
  });

  let subtotal = items.reduce((sum,item)=>sum+item.price,0);
  let tax = subtotal * taxRate;
  let service = subtotal * serviceRate;
  let customTip = parseFloat(customTipInput.value) || 0;
  let percentageTip = subtotal * (parseFloat(percentageTipSelect.value)/100);
  let appliedTip = Math.max(customTip, percentageTip);
  let total = subtotal + tax + service + appliedTip;

  subtotalDiv.textContent = `${label.subtotal}: ${formatCurrency(subtotal)}`;
  taxDiv.textContent = `${label.tax} (10%): ${formatCurrency(tax)}`;
  serviceDiv.textContent = `${label.service} (5%): ${formatCurrency(service)}`;
  tipCustomDiv.textContent = `${label.customTip}: ${formatCurrency(customTip)}`;
  tipPercentageDiv.textContent = `${label.percentageTip}: ${formatCurrency(percentageTip)}`;
  totalDiv.textContent = `${label.total}: ${formatCurrency(total)}`;

  const receiptNumber = generateReceiptNumber();
  const dateTime = getCurrentDateTime();
  receiptInfoDiv.textContent = `${label.receipt}: ${receiptNumber} | ${label.date}: ${dateTime}`;

  const paymentLink = `https://your-payment-link.com/pay?amount=${total.toFixed(2)}&currency=IDR`;

  qrContainer.innerHTML = "";
  new QRCode(qrContainer,{ text: paymentLink, width: 100, height: 100 });
}

renderReceipt();
