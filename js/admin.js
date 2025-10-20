const addForm = document.getElementById('addPropertyForm');
const adminNotice = document.getElementById('adminNotice');
addForm && addForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const title = document.getElementById('pTitle').value.trim();
  const city = document.getElementById('pCity').value.trim();
  const type = document.getElementById('pType').value;
  const operation = document.getElementById('pOperation').value;
  const price = Number(document.getElementById('pPrice').value);
  const image = document.getElementById('pImage').value || 'assets/imgs/house1.jpg';
  const desc = document.getElementById('pDesc').value;
  if(!title || !city || !price) { adminNotice.textContent = 'Completá los campos obligatorios.'; return }
  // simulamos agregar a la lista: si la página principal está abierta, no se actualiza automáticamente a menos que recargues.
  adminNotice.textContent = 'Propiedad agregada (demo). Abrí index.html y recargá para ver cambios si usás un archivo JSON local.';
  addForm.reset();
});
