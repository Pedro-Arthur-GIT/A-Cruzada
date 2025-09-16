// document.addEventListener('DOMContentLoaded', () => {
//     const button = document.getElementById('toggleButton');
//     button.addEventListener('click', () => {
//         document.body.classList.toggle('dark-mode');
//     });
// });





// Script para paginação de texto extenso

// script.js
// document.addEventListener('DOMContentLoaded', () => {
//   const container = document.getElementById('markdownContainer');
//   const prevBtn = document.getElementById('prevBtn');
//   const nextBtn = document.getElementById('nextBtn');
//   if (!container) return;

//   // salva o HTML original (sempre usado como fonte quando recalculamos)
//   const originalHTML = container.innerHTML;
//   let pages = [];
//   let currentPage = 0;

//   // PAGINAÇÃO principal
//   function paginateContent() {
//     // restaura o HTML original para gerar novamente as páginas
//     container.innerHTML = originalHTML;

//     // pega uma cópia (array) dos childNodes para processar sem afetar o original
//     const nodes = Array.from(container.childNodes);

//     pages = [];
//     // div temporária que conterá o conteúdo da página atual para medição
//     let currentDiv = document.createElement('div');

//     // limpa container e adiciona a currentDiv para medirmos dentro do mesmo contexto/estilos
//     container.innerHTML = '';
//     container.appendChild(currentDiv);

//     function pushCurrentPageAndReset() {
//       // só push se tiver algo
//       if (currentDiv.innerHTML.trim() !== '') {
//         pages.push(currentDiv.innerHTML);
//       }
//       currentDiv = document.createElement('div');
//       container.innerHTML = '';
//       container.appendChild(currentDiv);
//     }

//     // função que tenta dividir um nó grande por palavras (quando um nó sozinho não cabe)
//     function splitNodeByWords(node) {
//       const text = node.textContent || '';
//       const tagName = (node.nodeType === Node.ELEMENT_NODE) ? node.nodeName.toLowerCase() : 'p';
//       const words = text.trim().split(/\s+/);
//       if (words.length === 0) return;

//       let chunkWords = [];
//       // cria um elemento de teste que será atualizado enquanto testamos
//       let testEl = document.createElement(tagName);
//       currentDiv.appendChild(testEl);

//       for (let i = 0; i < words.length; i++) {
//         chunkWords.push(words[i]);
//         testEl.innerText = chunkWords.join(' ');

//         // se estourou, remove a última palavra, fecha a página, e recomeça
//         if (container.scrollHeight > container.clientHeight) {
//           // retira palavra que fez estourar
//           chunkWords.pop();
//           testEl.innerText = chunkWords.join(' ');

//           // se não há nada (uma única palavra maior que a página), ainda assim
//           // forçamos o push dessa palavra sozinha para evitar loop infinito
//           if (testEl.innerText.trim() === '') {
//             // forçar uma única palavra nesta página (pode produzir overflow)
//             testEl.innerText = words[i];
//             // aceita essa página mesmo que estoure
//             pushCurrentPageAndReset();
//             // prepara novo teste
//             testEl = document.createElement(tagName);
//             currentDiv.appendChild(testEl);
//             chunkWords = [];
//             continue;
//           }

//           // fecha a página atual
//           pushCurrentPageAndReset();

//           // inicia nova página com a palavra que causou o overflow (reprocessa i)
//           testEl = document.createElement(tagName);
//           currentDiv.appendChild(testEl);
//           chunkWords = [words[i]];
//           testEl.innerText = chunkWords.join(' ');

//           // se mesmo uma única palavra não coube (palavra enorme), empurra e reinicia
//           if (container.scrollHeight > container.clientHeight) {
//             pushCurrentPageAndReset();
//             testEl = document.createElement(tagName);
//             currentDiv.appendChild(testEl);
//             chunkWords = [];
//           }
//         }
//       }

//       // se restarem palavras no testEl, mantemos (não precisa fechar aqui, deixe para final do processo)
//       // OBS: testEl já faz parte de currentDiv
//     }

//     // percorre os nós (parágrafos, títulos, listas...)
//     for (let i = 0; i < nodes.length; i++) {
//       const node = nodes[i];
//       const clone = node.cloneNode(true);
//       currentDiv.appendChild(clone);

//       // se ultrapassou a altura visível
//       if (container.scrollHeight > container.clientHeight) {
//         // remove o clone que estourou
//         currentDiv.removeChild(clone);

//         if (currentDiv.childNodes.length === 0) {
//           // caso especial: o próprio nó não cabe numa página vazia -> tenta dividir por palavras
//           splitNodeByWords(node);
//           // se após dividir ainda estamos com currentDiv cheio (split adicionou elementos),
//           // fecha a página atual e continua para o próximo node
//           if (currentDiv.innerHTML.trim() !== '') {
//             pushCurrentPageAndReset();
//           }
//         } else {
//           // o nó não coube junto com o conteúdo atual:
//           // fecha a página atual e reprocessa o mesmo nó na próxima iteração
//           pushCurrentPageAndReset();
//           i--; // reprocessa o node no próximo loop (agora em página vazia)
//         }
//       }
//     }

//     // push da última página se existir conteúdo
//     if (currentDiv.innerHTML.trim() !== '') {
//       pages.push(currentDiv.innerHTML);
//     }

//     // garante que ao menos exista uma "página"
//     if (pages.length === 0) {
//       pages.push(originalHTML);
//     }

//     showPage(0);
//     updateButtons();
//   } // fim paginateContent

//   function showPage(index) {
//     if (index < 0 || index >= pages.length) return;
//     currentPage = index;
//     container.innerHTML = pages[index];
//     updateButtons();
//   }

//   function updateButtons() {
//     if (prevBtn) prevBtn.disabled = (currentPage === 0);
//     if (nextBtn) nextBtn.disabled = (currentPage === pages.length - 1);
//   }

//   // handlers de navegação
//   if (prevBtn) prevBtn.addEventListener('click', () => showPage(currentPage - 1));
//   if (nextBtn) nextBtn.addEventListener('click', () => showPage(currentPage + 1));

//   // debounce para resize (recalcula paginação quando a tela muda)
//   let resizeTimeout = null;
//   function handleResize() {
//     clearTimeout(resizeTimeout);
//     resizeTimeout = setTimeout(() => {
//       paginateContent();
//     }, 200);
//   }
//   window.addEventListener('resize', handleResize);
//   window.addEventListener('orientationchange', handleResize);

//   // primeira execução
//   paginateContent();
// });
// PAGINAÇÃO principal
// PAGINAÇÃO principal
let pages = [];
let currentPage = 0;

// Elementos
const container = document.getElementById('markdownContainer');
const mainContainer = document.querySelector('.main-container');
const originalHTML = container.innerHTML; // salva conteúdo original

// Seleciona as zonas que já existem no HTML
const leftZone = document.querySelector('.left-zone');
const rightZone = document.querySelector('.right-zone');

// Configuração de animação
const ANIM_MS = 450; // duração do fade-top-to-bottom

// Ajusta altura baseada na proporção A4
function setContainerHeight() {
    const width = mainContainer.clientWidth;
    container.style.height = `${width * (297/210)}px`; // h/w A4
}
window.addEventListener('resize', setContainerHeight);
setContainerHeight();

// Função principal de paginação
function paginateContent() {
    container.innerHTML = originalHTML;
    const nodes = Array.from(container.childNodes);

    pages = [];
    let currentDiv = document.createElement('div');
    container.innerHTML = '';
    container.appendChild(currentDiv);

    function pushCurrentPageAndReset() {
        if (currentDiv.innerHTML.trim() !== '') pages.push(currentDiv.innerHTML);
        currentDiv = document.createElement('div');
        container.innerHTML = '';
        container.appendChild(currentDiv);
    }

    function splitNodeByWords(node) {
        const text = node.textContent || '';
        const tagName = (node.nodeType === Node.ELEMENT_NODE ? node.nodeName.toLowerCase() : 'p');
        const words = text.trim().split(/\s+/);
        if (!words.length) return;

        let chunkWords = [];
        let testEl = document.createElement(tagName);
        currentDiv.appendChild(testEl);

        for (let i = 0; i < words.length; i++) {
            chunkWords.push(words[i]);
            testEl.innerText = chunkWords.join(' ');

            if (container.scrollHeight > container.clientHeight) {
                chunkWords.pop();
                testEl.innerText = chunkWords.join(' ');

                if (testEl.innerText.trim() === '') {
                    testEl.innerText = words[i];
                    pushCurrentPageAndReset();
                    testEl = document.createElement(tagName);
                    currentDiv.appendChild(testEl);
                    chunkWords = [];
                    continue;
                }

                pushCurrentPageAndReset();
                testEl = document.createElement(tagName);
                currentDiv.appendChild(testEl);
                chunkWords = [words[i]];
                testEl.innerText = chunkWords.join(' ');

                if (container.scrollHeight > container.clientHeight) {
                    pushCurrentPageAndReset();
                    testEl = document.createElement(tagName);
                    currentDiv.appendChild(testEl);
                    chunkWords = [];
                }
            }
        }
    }

    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const clone = node.cloneNode(true);
        currentDiv.appendChild(clone);

        if (container.scrollHeight > container.clientHeight) {
            currentDiv.removeChild(clone);

            if (currentDiv.childNodes.length === 0) {
                splitNodeByWords(node);
                if (currentDiv.innerHTML.trim() !== '') pushCurrentPageAndReset();
            } else {
                pushCurrentPageAndReset();
                i--;
            }
        }
    }

    if (currentDiv.innerHTML.trim() !== '') pages.push(currentDiv.innerHTML);
    if (pages.length === 0) pages.push(originalHTML);

    showPage(0);
}

// Exibe página com animação fade-top-to-bottom
function showPage(index) {
    if (index < 0 || index >= pages.length) return;
    currentPage = index;

    container.classList.remove('page-transition');
    void container.offsetWidth; // força reflow
    container.innerHTML = pages[index];
    container.classList.add('page-transition');

    updateZonesCursor();
}

// Atualiza o cursor das zonas
function updateZonesCursor() {
    leftZone.style.cursor = currentPage === 0 ? 'default' : 'pointer';
    rightZone.style.cursor = currentPage === pages.length - 1 ? 'default' : 'pointer';
}

// Event listeners nas zonas
leftZone.addEventListener('click', () => {
    if (currentPage > 0) showPage(currentPage - 1);
});
rightZone.addEventListener('click', () => {
    if (currentPage < pages.length - 1) showPage(currentPage + 1);
});

// Redimensionamento
let resizeTimeout = null;
function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        setContainerHeight();
        paginateContent();
    }, 200);
}
window.addEventListener('resize', handleResize);
window.addEventListener('orientationchange', handleResize);

// Inicializa
document.addEventListener('DOMContentLoaded', () => {
    paginateContent();
});



document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggleButton');
    const body = document.body;

    // Seleciona os ícones locais
    const moonIcon = toggleButton.querySelector('.moon');
    const sunIcon = toggleButton.querySelector('.sun');

    // Função para aplicar tema
    const applyTheme = (theme) => {
        const isDark = theme === 'dark';
        body.classList.toggle('dark-mode', isDark);

        // Alterna visibilidade dos ícones
        moonIcon.classList.toggle('hidden', isDark); // mostra lua no claro
        sunIcon.classList.toggle('hidden', !isDark);   // mostra sol no escuro

        // Salva a preferência
        localStorage.setItem('theme', theme);
    };

    // Aplica tema salvo ou padrão 'light'
    applyTheme(localStorage.getItem('theme') || 'light');

    // Evento de clique no botão
    toggleButton.addEventListener('click', () => {
        const newTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
        applyTheme(newTheme);
    });
});





//impedir voltar à pagina anterior com o botão do navegador
window.onpopstate = function () {
  window.location.href = "index.html";
};
