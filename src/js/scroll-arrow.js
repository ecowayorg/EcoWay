document.querySelector('.scroll-arrow a').addEventListener('click', function (e) {
  e.preventDefault();
  
  const target = document.querySelector(this.getAttribute('href'));
  
  const offset = 20; 
  const headerHeight = document.querySelector('header').offsetHeight;
  const targetPosition = target.offsetTop - headerHeight - offset;

  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth'
  });
});