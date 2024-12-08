let pontuacao = 0;

const instrucoesBtn = document.getElementById('instrucoes-btn');
const modal = document.getElementById('instrucoes-modal');
const closeModalBtn = document.querySelector('.close');
const voltarBtn = document.getElementById('voltar-btn');

const resultadoModal = document.getElementById('resultado-modal');
const resultadoTitulo = document.getElementById('resultado-titulo');
const resultadoMensagem = document.getElementById('resultado-mensagem');
const closeResultadoModalBtn = document.getElementById('close-resultado');

// Carregar os áudios
const audioAcerto = new Audio('audio/lixo_caindo.mp3');
const audioErro = new Audio('audio/errado.mp3');

// Abrir o modal de instruções
instrucoesBtn.addEventListener('click', () => {
    modal.style.display = 'block';
});

// Fechar o modal de instruções
closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Fechar o modal de instruções ao clicar fora dele
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Função para exibir o modal de resultado com a pontuação atualizada
function mostrarResultado(titulo, mensagem) {
    resultadoTitulo.textContent = titulo;
    resultadoMensagem.textContent = mensagem;
    resultadoModal.style.display = 'block';
    
    setTimeout(() => {
        resultadoModal.style.display = 'none';
    }, 1500);
}

// Fechar o modal de resultado
closeResultadoModalBtn.addEventListener('click', () => {
    resultadoModal.style.display = 'none';
});

// Fechar o modal de resultado ao clicar fora dele
window.addEventListener('click', (event) => {
    if (event.target === resultadoModal) {
        resultadoModal.style.display = 'none';
    }
});

const lixos = document.querySelectorAll('.lixo');
const lixeiras = document.querySelectorAll('.lixeira');



// Lógica de arrastar e soltar
lixos.forEach(lixo => {
    lixo.addEventListener('dragstart', dragStart);
    lixo.addEventListener('dragend', dragEnd);
});

// Adicionar os eventos de drag & drop para as lixeiras
lixeiras.forEach(lixeira => {
    lixeira.addEventListener('dragover', dragOver);
    lixeira.addEventListener('dragenter', dragEnter);
    lixeira.addEventListener('dragleave', dragLeave);
    lixeira.addEventListener('drop', drop);
});

let lixoAtual;

function dragStart() {
    lixoAtual = this;
    setTimeout(() => this.classList.add('dragging'), 0);
}

function dragEnd() {
    this.classList.remove('dragging');
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
    this.classList.add('over');
}

function dragLeave() {
    this.classList.remove('over');
}

function drop() {
    this.classList.remove('over');

    // Verificar se o tipo do lixo corresponde à lixeira
    if (this.dataset.tipo === lixoAtual.dataset.tipo) {
        pontuacao += 2; // Incrementar 2 pontos para acertos
        audioAcerto.play(); // Tocar o áudio de acerto
        lixoAtual.remove(); // Remover o lixo quando descartado corretamente

        // Verificar se todos os lixos foram removidos
        if (document.querySelectorAll('.lixo').length === 0) {
            setTimeout(() => {
                window.location.href = "jogos.html"; // Redirecionar para index.html ao terminar o jogo
            }, 2000); // Aguardar 2 segundos antes de redirecionar
        }

    } else {
        pontuacao -= 1; // Subtrair 1 ponto para erros
        audioErro.play(); // Tocar o áudio de erro
    }

    // Atualizar a exibição da pontuação
}


