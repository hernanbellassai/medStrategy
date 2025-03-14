import React, { useEffect, useState } from 'react';
import './App.css';
import logo from './electro.png';

function App() {
  const [isLoginExpanded, setIsLoginExpanded] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [showWhiteSection, setShowWhiteSection] = useState(false);

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

    // Animación inicial: iluminar letras una por una con glow
    let index = 0;
    const animateLetters = () => {
      if (index > 0) {
        allLetters[index - 1].style.webkitTextStroke = '2px #b0b0b0';
        allLetters[index - 1].style.textStroke = '2px #b0b0b0';
        allLetters[index - 1].style.textShadow = 'none';
      }
      if (index >= allLetters.length) {
        return;
      }
      allLetters[index].style.webkitTextStroke = '2px #ffffff';
      allLetters[index].style.textStroke = '2px #ffffff';
      allLetters[index].style.textShadow = '0 0 10px #ffffff, 0 0 20px #ffffff, 0 0 30px #00b4d8';
      index++;
      setTimeout(animateLetters, 100);
    };

    animateLetters();

    // Efecto de linterna con el mouse
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
          letter.style.webkitTextStroke = '2px #ffffff';
          letter.style.textStroke = '2px #ffffff';
          if (!isHovered) {
            letter.style.textShadow = 'none';
          }
        } else {
          letter.style.webkitTextStroke = '2px #b0b0b0';
          letter.style.textStroke = '2px #b0b0b0';
          if (!isHovered) {
            letter.style.textShadow = 'none';
          }
        }
      });
    };

    title.addEventListener('mousemove', handleMouseMove);

    // Efecto de scroll para mover el login, mostrar contenido y cambiar fondo
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

      // Cambiar fondo y mostrar WhiteSection cuando las secciones hayan pasado completamente
      if (content) {
        const contentRect = content.getBoundingClientRect();
        const contentBottom = contentRect.bottom;

        // Activamos la sección blanca y cambiamos el fondo cuando la parte inferior de las secciones haya pasado el viewport
        if (contentBottom <= 0) { // Cuando las secciones ya no están visibles en la pantalla
          setShowWhiteSection(true);
          document.body.classList.add('white-background');
        } else {
          setShowWhiteSection(false);
          document.body.classList.remove('white-background');
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
        <div className={`white-section ${showWhiteSection ? 'visible' : ''}`}>
          <h2>Nueva Sección Blanca</h2>
          <p>Esta es una nueva sección con un fondo blanco para cambiar la temática.</p>
        </div>
      </main>
    </div>
  );
}

export default App;