document.querySelectorAll('.agregar').forEach(button => {
    button.addEventListener('click', function() {
        const producto = this.parentElement;
        const nombre = producto.querySelector('h3').innerText;
        const imagen = producto.querySelector('img').src;
        const precio = parseFloat(producto.querySelector('.precio').getAttribute('data-precio')); // Capturar el precio

        // Obtener carrito desde localStorage
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

        // Verificar si el producto ya está en el carrito
        const index = carrito.findIndex(item => item.nombre === nombre && item.imagen === imagen);
        
        if (index !== -1) {
            // Si ya existe, aumentar la cantidad
            carrito[index].cantidad += 1;
        } else {
            // Si no existe, agregar el producto con cantidad 1
            carrito.push({ nombre, imagen, precio, cantidad: 1 });
        }

        // Guardar el carrito actualizado en localStorage
        localStorage.setItem('carrito', JSON.stringify(carrito));

        // Actualizar el contador y el total
        updateCounter();
        updateTotal(); // Llamar para actualizar el total
    });
});

// Mostrar productos en el carrito
function mostrarCarrito() {
    const listaCarrito = document.getElementById('lista-carrito');
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    listaCarrito.innerHTML = '';

    carrito.forEach(producto => {
        const item = document.createElement('li');
        item.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" width="50" height="50">
            <span>${producto.nombre}</span>
            <span> - Bs${producto.precio.toFixed(2)}</span>
            <span> - </span>
            <button class="decrementar">-</button>
            <input type="number" value="${producto.cantidad}" min="0" class="cantidad-input">  <!-- Cambio: min="0" -->
            <button class="incrementar">+</button>
        `; // Mostrar cantidad con campo de entrada

        // Botón para incrementar la cantidad
        const btnIncrementar = item.querySelector('.incrementar');
        btnIncrementar.addEventListener('click', () => {
            producto.cantidad += 1;
            localStorage.setItem('carrito', JSON.stringify(carrito));
            mostrarCarrito();
            updateCounter();
            updateTotal(); // Actualizar el total después de incrementar
        });

        // Botón para decrementar la cantidad
        const btnDecrementar = item.querySelector('.decrementar');
        btnDecrementar.addEventListener('click', () => {
            if (producto.cantidad > 0) {  // Permitir llegar a 0
                producto.cantidad -= 1;
                localStorage.setItem('carrito', JSON.stringify(carrito));
                mostrarCarrito();
                updateCounter();
                updateTotal(); // Actualizar el total después de decrementar
            }
        });

        // Campo de entrada para cambiar la cantidad manualmente
        const cantidadInput = item.querySelector('.cantidad-input');
        cantidadInput.addEventListener('input', () => {
            const nuevaCantidad = parseInt(cantidadInput.value);
            if (!isNaN(nuevaCantidad) && nuevaCantidad >= 0) {  // Permitir valores 0 o mayores
                producto.cantidad = nuevaCantidad;
                localStorage.setItem('carrito', JSON.stringify(carrito));
                mostrarCarrito();
                updateCounter();
                updateTotal(); // Actualizar el total después de cambiar la cantidad
            } else {
                cantidadInput.value = producto.cantidad;
            }
        });

        const eliminarBtn = document.createElement('button');
        eliminarBtn.innerText = 'Quitar del carrito';
        eliminarBtn.classList.add('btn-eliminar');
        eliminarBtn.addEventListener('click', () => {
            // Eliminar el producto del carrito
            const index = carrito.indexOf(producto);
            carrito.splice(index, 1);
            localStorage.setItem('carrito', JSON.stringify(carrito));
            mostrarCarrito();
            updateCounter();
            updateTotal(); // Actualizar el total después de eliminar
        });

        item.appendChild(eliminarBtn);
        listaCarrito.appendChild(item);
    });

    updateCounter();
    updateTotal(); // Actualizar total cada vez que mostramos el carrito
}

// Contador de productos en el carrito
function updateCounter() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const contador = document.getElementById('contador');
    contador.innerText = `Total de productos: ${carrito.reduce((acc, producto) => acc + producto.cantidad, 0)}`;
}

// Función para actualizar el total de los productos
function updateTotal() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const total = carrito.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0); // Sumar los precios con la cantidad
    const totalElement = document.getElementById('total');

    if (totalElement) {
        totalElement.innerText = `Total: Bs${total.toFixed(2)}`;
    }
}

// Vaciar el carrito
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
if (vaciarCarritoBtn) {
    vaciarCarritoBtn.addEventListener('click', function() {
        localStorage.setItem('carrito', JSON.stringify([]));
        mostrarCarrito();
        updateTotal(); // Actualizar el total al vaciar el carrito
    });
}

// Inicializar el carrito cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('lista-carrito')) {
        mostrarCarrito();
    }
    updateCounter();
    updateTotal(); // Llamar para mostrar el total cuando se carga la página
});
