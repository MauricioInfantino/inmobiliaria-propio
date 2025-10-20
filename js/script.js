const propertiesGrid = document.getElementById('propertiesGrid');
const modal = document.getElementById('propertyModal');
const modalBody = document.getElementById('modalBody');
const closeModalBtn = document.getElementById('closeModal');
const yearEl = document.getElementById('year');

if(yearEl) yearEl.textContent = new Date().getFullYear();

let properties = [];

async function loadProperties(){
  try{
    const res = await fetch('data/properties.json');
    properties = await res.json();
    renderProperties(properties);
  }catch(e){
    // fallback: si no puede fetch (p. ej. abierto con file://), insertamos datos embebidos
    properties = [
      {id:1,title:'Demo Casa',city:'Buenos Aires',type:'Casa',operation:'Venta',price:100000,image:'assets/imgs/house1.jpg',description:'Descripción demo.'}
    ];
    renderProperties(properties);
  }
}

function renderProperties(list){
  propertiesGrid.innerHTML = '';
  if(list.length === 0) { propertiesGrid.innerHTML = '<p>No se encontraron propiedades.</p>'; return }
  list.forEach(p => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.image}" alt="${escapeHtml(p.title)}" />
      <div class="card-body">
        <h4>${escapeHtml(p.title)}</h4>
        <p>${escapeHtml(p.city)} • ${escapeHtml(p.type)} • ${escapeHtml(p.operation)}</p>
        <p class="price">$ ${p.price.toLocaleString()}</p>
        <button data-id="${p.id}" class="viewBtn">Ver detalle</button>
      </div>
    `;
    propertiesGrid.appendChild(card);
  });
  // listeners
  
  document.querySelectorAll('.viewBtn').forEach(btn => btn.addEventListener('click', (e)=>{
    const id = Number(e.currentTarget.dataset.id);
    const prop = properties.find(x=>x.id===id);
    openModal(prop);
  }));
}

function openModal(prop){
  modalBody.innerHTML = `
    <h3>${escapeHtml(prop.title)}</h3>
    <div style="display:flex; gap:12px; flex-wrap:wrap">
      <img src="${prop.image}" style="width:300px; height:200px; object-fit:cover" />
      <div>
        <p><strong>Ciudad:</strong> ${escapeHtml(prop.city)}</p>
        <p><strong>Tipo:</strong> ${escapeHtml(prop.type)}</p>
        <p><strong>Operación:</strong> ${escapeHtml(prop.operation)}</p>
        <p class="price">$ ${prop.price.toLocaleString()}</p>
        <p>${escapeHtml(prop.description)}</p>
        <a href="contact.html" class="btn">Contactar</a>
      </div>
    </div>
  `;
  modal.classList.remove('hidden');
}
closeModalBtn && closeModalBtn.addEventListener('click', ()=> modal.classList.add('hidden'));
modal && modal.addEventListener('click', (e)=>{ if(e.target===modal) modal.classList.add('hidden') });

// filtros
const filterForm = document.getElementById('filterForm');
filterForm && filterForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  applyFilters();
});

function applyFilters(){
  const q = document.getElementById('search').value.toLowerCase();
  const type = document.getElementById('typeFilter').value;
  const operation = document.getElementById('operationFilter').value;
  const min = Number(document.getElementById('minPrice').value) || 0;
  const max = Number(document.getElementById('maxPrice').value) || Infinity;

  const filtered = properties.filter(p=>{
    if(q && !(p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))) return false;
    if(type && p.type !== type) return false;
    if(operation && p.operation !== operation) return false;
    if(p.price < min || p.price > max) return false;
    return true;
  });
  renderProperties(filtered);
}

const resetBtn = document.getElementById('resetFilters');
resetBtn && resetBtn.addEventListener('click', ()=>{
  document.getElementById('filterForm').reset();
  renderProperties(properties);
});

function escapeHtml(str){
  if(!str) return '';
  return String(str).replace(/[&<>"]+/g, function(s){
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[s];
  });
}

// carga inicial
loadProperties();
