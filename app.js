function criarElemento(tagName, className) {
  const elemento = document.createElement(tagName);
  elemento.classList.add(className);
  return elemento;
}

function Barreira(reverse = false) {
  this.barreira = criarElemento("div", "barreira");
  const borda = criarElemento("div", "borda");
  const corpo = criarElemento("div", "corpo");
  this.barreira.appendChild(reverse ? corpo : borda);
  this.barreira.appendChild(reverse ? borda : corpo);

  this.setAltura = (altura) => {
    corpo.style.height = `${altura}px`;
  };
}

function ParDeBarreiras(altura, abertura, x) {
  this.par = criarElemento("div", "par-de-barreiras");

  this.superior = new Barreira(true);
  this.inferior = new Barreira(false);

  this.par.appendChild(this.superior.barreira);
  this.par.appendChild(this.inferior.barreira);

  this.calcularAltura = () => {
    const alturaSuperior = Math.random() * (altura - abertura);
    const alturaInferior = altura - abertura - alturaSuperior;
    this.superior.setAltura(alturaSuperior);
    this.inferior.setAltura(alturaInferior);
  };

  this.getX = () => parseInt(this.par.style.left.split("px")[0]);
  this.setX = (x) => (this.par.style.left = `${x}px`);
  this.getLargura = () => this.par.clientWidth;

  this.calcularAltura();
  this.setX(x);
}

function ConjuntoDeBarreiras(
  altura,
  largura,
  abertura,
  espaco,
  notificarPonto
) {
  this.conjunto = [
    new ParDeBarreiras(altura, abertura, largura),
    new ParDeBarreiras(altura, abertura, largura + espaco),
    new ParDeBarreiras(altura, abertura, largura + espaco * 2),
    new ParDeBarreiras(altura, abertura, largura + espaco * 3),
  ];

  const deslocamento = 3;

  this.animar = () => {
    this.conjunto.forEach((par) => {
      par.setX(par.getX() - deslocamento);
      if (par.getX() < -par.getLargura()) {
        par.setX(par.getX() + this.conjunto.length * espaco);
        par.calcularAltura();
      }
      const meio = largura / 2;

      if (par.getX() + deslocamento >= meio && par.getX() < meio) {
        notificarPonto();
      }
    });
  };
}

function Passaro(alturaDoJogo) {
  let voando = false;

  this.elemento = criarElemento("img", "passaro");
  this.elemento.src = "passaro.png";

  this.getY = () => parseInt(this.elemento.style.bottom.split("px")[0]);
  this.setY = (y) => (this.elemento.style.bottom = `${y}px`);

  window.onkeydown = (e) => {
    voando = true;
  };
  window.onkeyup = (e) => {
    voando = false;
  };

  this.animar = () => {
    const novoY = this.getY() + (voando ? 8 : -5);
    const alturaMaxima = alturaDoJogo - this.elemento.clientHeight;
    if (novoY >= alturaMaxima) {
      this.setY(alturaMaxima);
    } else if (novoY <= 0) {
      this.setY(0);
    } else this.setY(novoY);
  };

  this.setY(alturaDoJogo / 2);
}

function Progresso() {
  this.elemento = criarElemento("span", "progresso");
  this.atualizarPontos = (pontos) => {
    this.elemento.innerHTML = pontos;
  };
  this.atualizarPontos(0);
}

function testColision(elementoA, elementoB) {
  const a = elementoA.getBoundingClientRect();
  const b = elementoB.getBoundingClientRect();

  const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left;
  const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top;

  return horizontal && vertical;
}

function game() {
  let pontos = 0;

  const passaro = new Passaro(600);
  const progresso = new Progresso();
  const barreiras = new ConjuntoDeBarreiras(600, 1000, 300, 400, () =>
    progresso.atualizarPontos(++pontos)
  );

  const cenarioDOM = document.querySelector(".cenario");

  barreiras.conjunto.forEach((par) => cenarioDOM.appendChild(par.par));
  cenarioDOM.appendChild(passaro.elemento);
  cenarioDOM.appendChild(progresso.elemento);

  this.start = () => {
    const temporizador = setInterval(() => {
      barreiras.animar();
      passaro.animar();
    }, 30);
  };
}

new game().start();
