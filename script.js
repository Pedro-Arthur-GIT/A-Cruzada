document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('toggleButton');
    button.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });
});





// Script para paginação de texto extenso

// script.js
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('markdownContainer');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  if (!container) return;

  // salva o HTML original (sempre usado como fonte quando recalculamos)
  const originalHTML = container.innerHTML;
  let pages = [];
  let currentPage = 0;

  // PAGINAÇÃO principal
  function paginateContent() {
    // restaura o HTML original para gerar novamente as páginas
    container.innerHTML = originalHTML;

    // pega uma cópia (array) dos childNodes para processar sem afetar o original
    const nodes = Array.from(container.childNodes);

    pages = [];
    // div temporária que conterá o conteúdo da página atual para medição
    let currentDiv = document.createElement('div');

    // limpa container e adiciona a currentDiv para medirmos dentro do mesmo contexto/estilos
    container.innerHTML = '';
    container.appendChild(currentDiv);

    function pushCurrentPageAndReset() {
      // só push se tiver algo
      if (currentDiv.innerHTML.trim() !== '') {
        pages.push(currentDiv.innerHTML);
      }
      currentDiv = document.createElement('div');
      container.innerHTML = '';
      container.appendChild(currentDiv);
    }

    // função que tenta dividir um nó grande por palavras (quando um nó sozinho não cabe)
    function splitNodeByWords(node) {
      const text = node.textContent || '';
      const tagName = (node.nodeType === Node.ELEMENT_NODE) ? node.nodeName.toLowerCase() : 'p';
      const words = text.trim().split(/\s+/);
      if (words.length === 0) return;

      let chunkWords = [];
      // cria um elemento de teste que será atualizado enquanto testamos
      let testEl = document.createElement(tagName);
      currentDiv.appendChild(testEl);

      for (let i = 0; i < words.length; i++) {
        chunkWords.push(words[i]);
        testEl.innerText = chunkWords.join(' ');

        // se estourou, remove a última palavra, fecha a página, e recomeça
        if (container.scrollHeight > container.clientHeight) {
          // retira palavra que fez estourar
          chunkWords.pop();
          testEl.innerText = chunkWords.join(' ');

          // se não há nada (uma única palavra maior que a página), ainda assim
          // forçamos o push dessa palavra sozinha para evitar loop infinito
          if (testEl.innerText.trim() === '') {
            // forçar uma única palavra nesta página (pode produzir overflow)
            testEl.innerText = words[i];
            // aceita essa página mesmo que estoure
            pushCurrentPageAndReset();
            // prepara novo teste
            testEl = document.createElement(tagName);
            currentDiv.appendChild(testEl);
            chunkWords = [];
            continue;
          }

          // fecha a página atual
          pushCurrentPageAndReset();

          // inicia nova página com a palavra que causou o overflow (reprocessa i)
          testEl = document.createElement(tagName);
          currentDiv.appendChild(testEl);
          chunkWords = [words[i]];
          testEl.innerText = chunkWords.join(' ');

          // se mesmo uma única palavra não coube (palavra enorme), empurra e reinicia
          if (container.scrollHeight > container.clientHeight) {
            pushCurrentPageAndReset();
            testEl = document.createElement(tagName);
            currentDiv.appendChild(testEl);
            chunkWords = [];
          }
        }
      }

      // se restarem palavras no testEl, mantemos (não precisa fechar aqui, deixe para final do processo)
      // OBS: testEl já faz parte de currentDiv
    }

    // percorre os nós (parágrafos, títulos, listas...)
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const clone = node.cloneNode(true);
      currentDiv.appendChild(clone);

      // se ultrapassou a altura visível
      if (container.scrollHeight > container.clientHeight) {
        // remove o clone que estourou
        currentDiv.removeChild(clone);

        if (currentDiv.childNodes.length === 0) {
          // caso especial: o próprio nó não cabe numa página vazia -> tenta dividir por palavras
          splitNodeByWords(node);
          // se após dividir ainda estamos com currentDiv cheio (split adicionou elementos),
          // fecha a página atual e continua para o próximo node
          if (currentDiv.innerHTML.trim() !== '') {
            pushCurrentPageAndReset();
          }
        } else {
          // o nó não coube junto com o conteúdo atual:
          // fecha a página atual e reprocessa o mesmo nó na próxima iteração
          pushCurrentPageAndReset();
          i--; // reprocessa o node no próximo loop (agora em página vazia)
        }
      }
    }

    // push da última página se existir conteúdo
    if (currentDiv.innerHTML.trim() !== '') {
      pages.push(currentDiv.innerHTML);
    }

    // garante que ao menos exista uma "página"
    if (pages.length === 0) {
      pages.push(originalHTML);
    }

    showPage(0);
    updateButtons();
  } // fim paginateContent

  function showPage(index) {
    if (index < 0 || index >= pages.length) return;
    currentPage = index;
    container.innerHTML = pages[index];
    updateButtons();
  }

  function updateButtons() {
    if (prevBtn) prevBtn.disabled = (currentPage === 0);
    if (nextBtn) nextBtn.disabled = (currentPage === pages.length - 1);
  }

  // handlers de navegação
  if (prevBtn) prevBtn.addEventListener('click', () => showPage(currentPage - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => showPage(currentPage + 1));

  // debounce para resize (recalcula paginação quando a tela muda)
  let resizeTimeout = null;
  function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      paginateContent();
    }, 200);
  }
  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', handleResize);

  // primeira execução
  paginateContent();
});
