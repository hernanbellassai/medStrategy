import React, { useEffect, useState } from 'react';
import './App.css';
import logo from './electro.png';

function App() {
  const [isLoginExpanded, setIsLoginExpanded] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [showWhiteSection, setShowWhiteSection] = useState(false);
  const [whiteSectionPosition, setWhiteSectionPosition] = useState(100); // Posición inicial fuera de la pantalla (en vh)

  useEffect(() => {
    const title = document.querySelector('h1');
    const lines = title.querySelectorAll('.title-line-text');
    let allLetters = [];

    // Convertir cada línea en letras individuales
    lines.forEach(line => {
      const letters = line.textContent.split('').map(letter => `<span class="letter">${letter}</span>`).join('');
      line.innerHTML = letters;
      allLetters = allLetters.concat(Array.from(line.querySelectorAll('.letter')));
    });

    // Animación inicial: iluminar letras una por una con glow (sin contorno)
    let index = 0;
    const animateLetters = () => {
      if (index > 0) {
        allLetters[index - 1].style.textShadow = 'none'; // Solo sombra, sin contorno
      }
      if (index >= allLetters.length) {
        return;
      }
      allLetters[index].style.textShadow = '0 0 10px #ffffff, 0 0 20px #ffffff, 0 0 30px #00b4d8'; // Solo glow
      index++;
      setTimeout(animateLetters, 100);
    };

    animateLetters();

    // Efecto de linterna con el mouse (sin contorno)
    const handleMouseMove = (e) => {
      const rect = title.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      allLetters.forEach(letter => {
        const letterRect = letter.getBoundingClientRect();
        const letterCenterX = letterRect.left + letterRect.width / 2 - rect.left;
        const letterCenterY = letterRect.top + letterRect.height / 2 - rect.top;
        const distance = Math.sqrt(
          Math.pow(mouseX - letterCenterX, 2) + Math.pow(mouseY - letterCenterY, 2)
        );
        const isHovered = letter.matches(':hover');
        if (distance < 50) {
          letter.style.textShadow = '0 0 10px #ffffff, 0 0 20px #ffffff, 0 0 30px #00b4d8'; // Solo glow
          if (!isHovered) {
            letter.style.textShadow = 'none';
          }
        } else {
          letter.style.textShadow = 'none'; // Sin contorno ni sombra fuera del rango
          if (!isHovered) {
            letter.style.textShadow = 'none';
          }
        }
      });
    };

    title.addEventListener('mousemove', handleMouseMove);

    // Efecto de scroll para mover el login, mostrar contenido y aplicar parallax
    const login = document.querySelector('.login');
    const content = document.querySelector('.content');
    const handleScroll = () => {
      if (window.scrollY > 100) {
        if (login) {
          login.classList.add('login-scrolled');
          if (isLoginExpanded) {
            setIsLoginExpanded(false);
          }
        }
      } else {
        if (login) {
          login.classList.remove('login-scrolled');
        }
      }

      // Mostrar contenido antes al hacer scroll
      if (window.scrollY > 200) {
        setShowContent(true);
      } else {
        setShowContent(false);
      }

      // Aplicar parallax a la WhiteSection cuando las secciones hayan pasado completamente
      if (content) {
        const contentRect = content.getBoundingClientRect();
        const contentTop = contentRect.top + window.scrollY;
        const contentHeight = contentRect.height;
        const contentBottom = contentTop + contentHeight;

        // Ajustamos el momento de inicio para que comience antes (200px antes de contentBottom)
        if (window.scrollY >= contentBottom - 300) {
          setShowWhiteSection(true);

          // Calcular el desplazamiento para el efecto parallax
          const scrollDistance = window.scrollY - (contentBottom - 200); // Distancia desde el nuevo punto de inicio
          const maxTranslate = 0; // Posición final (arriba de la pantalla)
          const initialTranslate = 100; // Posición inicial (fuera de la pantalla, abajo)
          const translateRange = window.innerHeight * 0.5; // Distancia de scroll para completar el movimiento
          const translateY = initialTranslate - (scrollDistance / translateRange) * initialTranslate;

          // Limitar el movimiento entre initialTranslate y maxTranslate
          setWhiteSectionPosition(Math.max(maxTranslate, translateY));
        } else {
          setShowWhiteSection(false);
          setWhiteSectionPosition(100); // Reinicia la posición cuando no está activa
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Limpiar event listeners al desmontar
    return () => {
      title.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isLoginExpanded]);

  return (
    <div className="App">
      <header className="header"></header>
      <main className="main">
        <div className="title-container">
          <h1>
            <div className="title-line">
              <span className="title-line-text">MeD</span>
              <img src={logo} alt="Logo" className="title-logo" />
            </div>
            <div className="title-line">
              <span className="title-line-text">Strategy</span>
            </div>
          </h1>
          <div className="login" onClick={() => setIsLoginExpanded(!isLoginExpanded)}>
            {isLoginExpanded ? (
              <>
                <input type="text" placeholder="Usuario" />
                <input type="password" placeholder="Contraseña" />
                <button>Iniciar Sesión</button>
              </>
            ) : (
              <button className="login-button">Iniciar Sesión</button>
            )}
          </div>
        </div>
        <div className={`content ${showContent ? 'fade-in' : 'fade-out'}`}>
          <section className="section">
            <h2>Sección 1</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </section>
          <section className="section">
            <h2>Sección 2</h2>
            <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          </section>
          <section className="section">
            <h2>Sección 3</h2>
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
          </section>
        </div>
        <div
          className={`white-section ${showWhiteSection ? 'visible' : ''}`}
          style={{ transform: `translateY(${whiteSectionPosition}vh)` }}
        >
          <div className="cards-container">
            <div className="card">
              <div className="card-icon">📱</div>
              <h3>Save with Apple Trade In</h3>
              <p>Get $170-$630 in credit toward iPhone 16 or iPhone 16 Pro when you trade in iPhone 12 or higher.*</p>
              <button className="card-button">+</button>
            </div>
            <div className="card">
              <div className="card-icon">💳</div>
              <h3>Pay over time, interest-free</h3>
              <p>When you choose to check out with Apple Card Monthly Installments.*</p>
              <button className="card-button">+</button>
            </div>
            <div className="card">
              <div className="card-icon">📡</div>
              <h3>Apple. Your one-stop shop for incredible carrier deals</h3>
              <p>Get up to $1000 in credit on a new iPhone with AT&T, Boost Mobile, T-Mobile, or Verizon. Trade-in may be required.*</p>
              <button className="card-button">+</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;