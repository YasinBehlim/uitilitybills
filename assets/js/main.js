// ============================
// LOAD PROVIDERS & DATA
// ============================

let providers = {};
let loadData = {};

async function loadJSON() {
    providers = await fetch('data/providers.json').then(r => r.json());
    loadData = await fetch('data/loadshedding.json').then(r => r.json());
}
loadJSON();

// ============================
// HELPER FUNCTIONS
// ============================

function populateProvinces(utility, provinceSelect, providerSelect) {
    provinceSelect.innerHTML = '<option value="">Select Province</option>';
    providerSelect.innerHTML = '<option value="">Select Provider</option>';
    if (!utility || !providers[utility]) return;
    Object.keys(providers[utility]).forEach(prov => {
        let opt = document.createElement('option');
        opt.value = prov;
        opt.textContent = prov;
        provinceSelect.appendChild(opt);
    });
}

function populateProviders(utility, province, providerSelect) {
    providerSelect.innerHTML = '<option value="">Select Provider</option>';
    if (!utility || !province) return;
    providers[utility][province].forEach(prov => {
        let opt = document.createElement('option');
        opt.value = prov;
        opt.textContent = prov;
        providerSelect.appendChild(opt);
    });
}

// ============================
// BILL FETCH PAGE
// ============================

const utilityType = document.getElementById('utilityType');
const province = document.getElementById('province');
const provider = document.getElementById('provider');
const consumerNumber = document.getElementById('consumerNumber');
const fetchBillForm = document.getElementById('fetchBillForm');
const billResult = document.getElementById('billResult');

utilityType?.addEventListener('change', () => populateProvinces(utilityType.value, province, provider));
province?.addEventListener('change', () => populateProviders(utilityType.value, province.value, provider));

fetchBillForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const util = utilityType.value;
    const prov = province.value;
    const provdr = provider.value;
    const consumer = consumerNumber.value.trim();

    if(!util || !prov || !provdr || !consumer) return alert('Please fill all fields.');

    const data = loadData[util]?.find(d => d.provider === provdr && d.consumerNumber === consumer);

    if(!data){
        billResult.innerHTML = `<p>No bill found for Consumer Number: <strong>${consumer}</strong></p>`;
        return;
    }

    billResult.innerHTML = `
        <div class="bill-card">
            <h3>${util.charAt(0).toUpperCase() + util.slice(1)} Bill</h3>
            <p><strong>Consumer Number:</strong> ${consumer}</p>
            <p><strong>Units Consumed:</strong> ${data.units}</p>
            <p><strong>Tariff per Unit:</strong> Rs ${data.tariff}</p>
            <p><strong>Total Amount:</strong> Rs ${data.totalAmount}</p>
            <p><strong>Last Meter Reading:</strong> ${data.lastReading}</p>
            <p><strong>Due Date:</strong> ${data.dueDate}</p>
            <p><strong>Provider:</strong> ${provdr}</p>
        </div>
    `;
});

// ============================
// LOAD SHEDDING PAGE
// ============================

const lsUtility = document.getElementById('lsUtility');
const lsProvince = document.getElementById('lsProvince');
const lsProvider = document.getElementById('lsProvider');
const lsArea = document.getElementById('lsArea');
const checkLS = document.getElementById('checkLS');
const lsResult = document.getElementById('lsResult');

lsUtility?.addEventListener('change', () => populateProvinces(lsUtility.value, lsProvince, lsProvider));
lsProvince?.addEventListener('change', () => populateProviders(lsUtility.value, lsProvince.value, lsProvider));

checkLS?.addEventListener('click', () => {
    const util = lsUtility.value;
    const prov = lsProvince.value;
    const provdr = lsProvider.value;
    const area = lsArea.value.trim();

    if(!util || !prov || !provdr || !area) return alert('Please fill all fields.');

    const data = loadData[util]?.find(d => d.provider === provdr && d.area.toLowerCase() === area.toLowerCase());

    if(!data){
        lsResult.innerHTML = `<p>No load shedding/outage info found for this area.</p>`;
        return;
    }

    lsResult.innerHTML = `
        <div class="bill-card">
            <p><strong>Utility:</strong> ${util}</p>
            <p><strong>Provider:</strong> ${provdr}</p>
            <p><strong>Area:</strong> ${area}</p>
            <p><strong>Last Meter Reading:</strong> ${data.lastReading || 'N/A'}</p>
            <p><strong>Timing:</strong> ${data.timing}</p>
            <p><strong>Reason:</strong> ${data.reason}</p>
        </div>
    `;
});
