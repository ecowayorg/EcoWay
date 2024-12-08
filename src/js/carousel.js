// Espera o carregamento completo da página
document.addEventListener('DOMContentLoaded', function () {

    // Obtém todos os inputs de tipo radio e os bullets
    const radios = document.querySelectorAll('#slider input[type="radio"]');
    const bullets = document.querySelectorAll('#bullets label');
  
    // Função para atualizar os bullets
    function updateBullets() {
      radios.forEach((radio, index) => {
        if (radio.checked) {
          // Altera a cor do bullet ativo
          bullets[index].style.backgroundColor = '#536b21';
          // Aumenta o tamanho do bullet ativo
          bullets[index].style.transform = 'scale(1.2)';
        } else {
          // Reseta o estilo dos bullets não ativos
          bullets[index].style.backgroundColor = '#ccc';
          bullets[index].style.transform = 'scale(1)';
        }
      });
    }
  
    // Atualiza os bullets assim que a página for carregada
    updateBullets();
  
    // Adiciona evento de mudança para cada radio button
    radios.forEach(radio => {
      radio.addEventListener('change', updateBullets);
    });
  
  });
  