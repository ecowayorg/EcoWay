// Seleciona os elementos do DOM
const menuButton = document.getElementById('menuButton');
const closeButton = document.getElementById('closeMenu');
const sideMenu = document.getElementById('sideMenu');
const menuOverlay = document.getElementById('menuOverlay');

// Função para abrir o menu
menuButton.addEventListener('click', function () {
  sideMenu.classList.add('active');
  menuOverlay.classList.add('active');
});

// Função para fechar o menu
closeButton.addEventListener('click', function () {
  sideMenu.classList.remove('active');
  menuOverlay.classList.remove('active');
});

// Fecha o menu ao clicar no overlay
menuOverlay.addEventListener('click', function () {
  sideMenu.classList.remove('active');
  menuOverlay.classList.remove('active');
});
