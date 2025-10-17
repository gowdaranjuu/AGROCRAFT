let role = null;
let products = [];

// Load products from backend
function loadProducts() {
  fetch('http://localhost:5000/api/products')
    .then(res => res.json())
    .then(data => {
      products = data;
      displayProducts(products);
    })
    .catch(err => console.error('Error fetching products:', err));
}

function setRole(selectedRole) {
  role = selectedRole;
  document.getElementById('addProductSection').style.display = (role === 'farmer') ? 'block' : 'none';
  document.getElementById('chatSection').style.display = (role === 'buyer') ? 'block' : 'none';
  loadProducts();
}

function displayProducts(items) {
  const vegList = document.getElementById('vegetableList');
  const fruitList = document.getElementById('fruitList');
  vegList.innerHTML = '';
  fruitList.innerHTML = '';

  items.forEach(product => {
    const div = document.createElement('div');
    div.className = 'product';
    div.innerHTML = `
      <h3>${product.name}</h3>
      <img src="${product.image}" alt="${product.name}">
      <p>Seller: ${product.seller}</p>
      <p>Location: ${product.location}</p>
      <p>Price: ₹${product.price}/kg</p>
      <button onclick="addToCart('${product.name}')">Add to Cart</button>
    `;
    if (product.type === 'vegetable') vegList.appendChild(div);
    else fruitList.appendChild(div);
  });
}

function filterProducts() {
  const category = document.getElementById('categoryFilter').value;
  const location = document.getElementById('locationFilter').value;

  const filtered = products.filter(p => {
    return (category === '' || p.name === category) &&
           (location === '' || p.location === location);
  });

  displayProducts(filtered);
}

function searchProducts() {
  const query = document.getElementById('searchBox').value.toLowerCase();
  const filtered = products.filter(p => p.name.toLowerCase().includes(query));
  displayProducts(filtered);
}

function addProduct() {
  const name = document.getElementById('prodName').value.trim();
  const price = document.getElementById('prodPrice').value.trim();
  const location = document.getElementById('prodLocation').value.trim();
  const image = document.getElementById('prodImage').value.trim();

  if (name && price && location && image) {
    const type = confirm("Is this a fruit? Click OK for Fruit, Cancel for Vegetable.") ? "fruit" : "vegetable";

    const newProduct = { name, price, seller: 'You', location, image, type };

    fetch('http://localhost:5000/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    })
      .then(res => res.json())
      .then(data => {
        products.push(data);
        displayProducts(products);
        alert(`${data.name} added successfully!`);
      })
      .catch(err => console.error('Error adding product:', err));
  } else {
    alert('Please fill all fields.');
  }
}

function addToCart(productName) {
  alert(`${productName} added to cart!`);
}

function sendMessage() {
  const msg = document.getElementById('chatBox').value.trim();
  if (msg) {
    const log = document.getElementById('chatLog');
    log.innerHTML += `<p><b>You:</b> ${msg}</p>`;
    document.getElementById('chatBox').value = '';
  }
}
