import './style.css'

const whatsappNumber = '5581987852380'

const homeScreen = document.getElementById('homeScreen')
const ordersScreen = document.getElementById('ordersScreen')

const homeNav = document.getElementById('homeNav')
const ordersNav = document.getElementById('ordersNav')
const backHome = document.getElementById('backHome')

const searchInput = document.getElementById('searchInput')
const products = document.querySelectorAll('.product-card')
const noResult = document.getElementById('noResult')
const categoryTabs = document.querySelectorAll('#categoryTabs button')

const cartCount = document.getElementById('cartCount')
const cartContent = document.getElementById('cartContent')
const summaryItems = document.getElementById('summaryItems')
const summaryTotal = document.getElementById('summaryTotal')

const clientName = document.getElementById('clientName')
const clientPlace = document.getElementById('clientPlace')
const clientCity = document.getElementById('clientCity')
const clientNote = document.getElementById('clientNote')
const sendWhatsapp = document.getElementById('sendWhatsapp')

const openSheet = document.getElementById('openSheet')
const openSheetOrders = document.getElementById('openSheetOrders')
const bottomSheet = document.getElementById('bottomSheet')
const overlay = document.getElementById('overlay')

let cart = []
let activeCategory = 'todos'

function formatMoney(value) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function showScreen(screen) {
  if (screen === 'home') {
    homeScreen.classList.add('active')
    ordersScreen.classList.remove('active')
    homeNav.classList.add('active')
    ordersNav.classList.remove('active')
  }

  if (screen === 'orders') {
    ordersScreen.classList.add('active')
    homeScreen.classList.remove('active')
    ordersNav.classList.add('active')
    homeNav.classList.remove('active')
    renderCart()
  }

  window.scrollTo({ top: 0, behavior: 'smooth' })
}

homeNav.addEventListener('click', () => showScreen('home'))
ordersNav.addEventListener('click', () => showScreen('orders'))
backHome.addEventListener('click', () => showScreen('home'))

function filterProducts() {
  const searchValue = searchInput.value.toLowerCase().trim()
  let visibleProducts = 0

  products.forEach((product) => {
    const productSearch = product.dataset.search.toLowerCase()
    const productName = product.dataset.name.toLowerCase()
    const productCategory = product.dataset.category.toLowerCase()

    const matchesSearch =
      productSearch.includes(searchValue) || productName.includes(searchValue)

    const matchesCategory =
      activeCategory === 'todos' || productCategory.includes(activeCategory)

    if (matchesSearch && matchesCategory) {
      product.classList.remove('hide')
      visibleProducts++
    } else {
      product.classList.add('hide')
    }
  })

  noResult.style.display = visibleProducts === 0 ? 'block' : 'none'
}

searchInput.addEventListener('input', filterProducts)

categoryTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    categoryTabs.forEach((button) => button.classList.remove('active'))

    tab.classList.add('active')
    activeCategory = tab.dataset.category

    filterProducts()
  })
})

products.forEach((product) => {
  const button = product.querySelector('.add-btn')

  button.addEventListener('click', () => {
    const productData = {
      id: product.dataset.id,
      name: product.dataset.name,
      unit: product.dataset.unit,
      price: Number(product.dataset.price),
      img: product.dataset.img,
      quantity: 1,
    }

    addToCart(productData)
  })
})

function addToCart(product) {
  const existingProduct = cart.find((item) => item.id === product.id)

  if (existingProduct) {
    existingProduct.quantity++
  } else {
    cart.push(product)
  }

  updateCartCount()
  renderCart()
}

function updateCartCount() {
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0)

  cartCount.textContent = totalItems

  if (totalItems > 0) {
    cartCount.classList.add('active')
  } else {
    cartCount.classList.remove('active')
  }
}

function renderCart() {
  if (cart.length === 0) {
    cartContent.innerHTML = `
      <div class="empty-cart">
        <h3>Seu pedido está vazio</h3>
        <p>Volte para o início e adicione produtos ao pedido.</p>
      </div>
    `

    summaryItems.textContent = '0'
    summaryTotal.textContent = formatMoney(0)
    return
  }

  cartContent.innerHTML = `
    <section class="cart-list">
      ${cart
        .map(
          (item) => `
            <article class="cart-item">
              <img src="${item.img}" alt="${item.name}">

              <div class="cart-info">
                <h3>${item.name}</h3>
                <small>${item.unit}</small>
                <strong>${formatMoney(item.price)}</strong>

                <div class="qty">
                  <button class="minus" data-action="decrease" data-id="${item.id}">−</button>
                  <span>${item.quantity}</span>
                  <button class="plus" data-action="increase" data-id="${item.id}">+</button>
                </div>
              </div>

              <button class="remove" data-action="remove" data-id="${item.id}">🗑</button>
            </article>
          `
        )
        .join('')}
    </section>
  `

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0)
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  summaryItems.textContent = totalItems
  summaryTotal.textContent = formatMoney(totalPrice)
}

cartContent.addEventListener('click', (event) => {
  const button = event.target.closest('button')

  if (!button) return

  const action = button.dataset.action
  const id = button.dataset.id

  if (action === 'increase') {
    increaseQuantity(id)
  }

  if (action === 'decrease') {
    decreaseQuantity(id)
  }

  if (action === 'remove') {
    removeItem(id)
  }
})

function increaseQuantity(id) {
  const product = cart.find((item) => item.id === id)

  if (product) {
    product.quantity++
  }

  updateCartCount()
  renderCart()
}

function decreaseQuantity(id) {
  const product = cart.find((item) => item.id === id)

  if (!product) return

  if (product.quantity > 1) {
    product.quantity--
  } else {
    cart = cart.filter((item) => item.id !== id)
  }

  updateCartCount()
  renderCart()
}

function removeItem(id) {
  cart = cart.filter((item) => item.id !== id)

  updateCartCount()
  renderCart()
}

sendWhatsapp.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Adicione pelo menos um produto ao pedido.')
    return
  }

  if (!clientName.value.trim()) {
    alert('Digite o nome do responsável.')
    return
  }

  if (!clientPlace.value.trim()) {
    alert('Digite o nome da local da entrega')
    return
  }

  if (!clientCity.value) {
    alert('Selecione a cidade ou região.')
    return
  }

  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  const productsText = cart
    .map((item) => {
      return [
        `ID: ${item.id}`,
        `Produto: ${item.name}`,
        `Quantidade: ${item.quantity}x ${item.unit}`,
        `Valor unitário: ${formatMoney(item.price)}`,
        `Subtotal: ${formatMoney(item.price * item.quantity)}`,
      ].join('\n')
    })
    .join('\n\n')

  const message = `
*Novo pedido pelo site*

*Dados do cliente*
Nome: ${clientName.value}
Estabelecimento: ${clientPlace.value}
Cidade/Região: ${clientCity.value}
Observação: ${clientNote.value || 'Nenhuma'}

*Produtos do pedido*
${productsText}

*Total:* ${formatMoney(totalPrice)}
  `

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, '_blank')
})

function openBottomSheet() {
  bottomSheet.classList.add('active')
  overlay.classList.add('active')
}

function closeBottomSheet() {
  bottomSheet.classList.remove('active')
  overlay.classList.remove('active')
}

const heroSlides = document.querySelectorAll('.hero-slide')
const dots = document.querySelectorAll('.dot')

let currentSlide = 0

function showSlide(index) {
  heroSlides.forEach((slide) => {
    slide.classList.remove('active')
  })

  dots.forEach((dot) => {
    dot.classList.remove('active')
  })

  heroSlides[index].classList.add('active')
  dots[index].classList.add('active')
}

setInterval(() => {
  currentSlide++

  if (currentSlide >= heroSlides.length) {
    currentSlide = 0
  }

  showSlide(currentSlide)
}, 3000)

openSheet.addEventListener('click', openBottomSheet)
openSheetOrders.addEventListener('click', openBottomSheet)
overlay.addEventListener('click', closeBottomSheet)