import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import type { Chart as ChartJS, ChartOptions, ChartData } from 'chart.js';

const App = () => {
  const [menuMobileAberto, setMenuMobileAberto] = useState<boolean>(false);

  const producaoChartRef = useRef<HTMLCanvasElement>(null);
  const beneficiosChartRef = useRef<HTMLCanvasElement>(null);

  interface ChartRef extends HTMLCanvasElement {
    chartInstance?: ChartJS;
  }

  const iniciarContador = (elemento: HTMLElement): void => {
    const alvo: number = +(elemento.getAttribute('data-counter') || '0');
    let contagem: number = 0;
    const duracao: number = 2000;
    const tempoPasso: number = Math.abs(Math.floor(duracao / alvo));

    const timer = setInterval(() => {
      contagem++;
      elemento.innerText = contagem.toString();
      if (contagem === alvo) {
        clearInterval(timer);
      }
    }, tempoPasso);
  };

  const criarGraficoProducao = (): void => {
    const currentRef = producaoChartRef.current as ChartRef | null;
    if (currentRef) {
      if (currentRef.chartInstance) {
        currentRef.chartInstance.destroy();
      }

      const ctx = currentRef.getContext('2d');
      if (ctx) {
        const chartData: ChartData<'doughnut'> = {
          labels: ['Geração de Renda', 'Doação para Entidades', 'Consumo Próprio'],
          datasets: [{
            label: 'Distribuição da Produção',
            data: [33.3, 33.3, 33.3],
            backgroundColor: [
              'rgba(74, 124, 89, 0.8)',
              'rgba(127, 179, 107, 0.8)',
              'rgba(191, 217, 148, 0.8)'
            ],
            borderColor: [
              'rgba(74, 124, 89, 1)',
              'rgba(127, 179, 107, 1)',
              'rgba(191, 217, 148, 1)'
            ],
            borderWidth: 1
          }]
        };

        const chartOptions: ChartOptions<'doughnut'> = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                font: { family: "'Poppins', sans-serif" }
              }
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  let label = context.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (context.parsed !== null && typeof context.parsed === 'number') {
                    label += context.parsed.toFixed(1) + '%';
                  }
                  return label;
                }
              }
            }
          }
        };

        currentRef.chartInstance = new Chart(ctx, {
          type: 'doughnut',
          data: chartData,
          options: chartOptions
        });
      }
    }
  };

  const criarGraficoBeneficios = (): void => {
    const currentRef = beneficiosChartRef.current as ChartRef | null;
    if (currentRef) {
      if (currentRef.chartInstance) {
        currentRef.chartInstance.destroy();
      }

      const ctx = currentRef.getContext('2d');
      if (ctx) {
        const chartData: ChartData<'bar'> = {
          labels: ['Uso de Água', 'Produtividade'],
          datasets: [{
            label: 'Mudança Percentual',
            data: [-30,50],
            backgroundColor: (context) => {
              const valor = context.raw as number;
              return valor < 0 ? 'rgba(74, 124, 89, 0.8)' : 'rgba(127, 179, 107, 0.8)';
            },
            borderColor: (context) => {
              const valor = context.raw as number;
              return valor < 0 ? 'rgba(74, 124, 89, 1)' : 'rgba(127, 179, 107, 1)';
            },
            borderWidth: 1
          }]
        };

        const chartOptions: ChartOptions<'bar'> = {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y',
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: 'Benefícios Potenciais com IA',
              font: { size: 16, family: "'Poppins', sans-serif" }
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  return ` ${context.raw}%`;
                }
              }
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Variação (%)'
              },
              ticks: {
                callback: function (value: string | number) {
                  return value + '%';
                }
              }
            }
          }
        };

        currentRef.chartInstance = new Chart(ctx, {
          type: 'bar',
          data: chartData,
          options: chartOptions
        });
      }
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.hasAttribute('data-counter')) {
            iniciarContador(entry.target as HTMLElement);
          }
          else if (entry.target.id === 'producaoChart') {
            criarGraficoProducao();
          }
          else if (entry.target.id === 'beneficiosChart') {
            criarGraficoBeneficios();
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-counter]').forEach(contador => observer.observe(contador));
    if (producaoChartRef.current) observer.observe(producaoChartRef.current);
    if (beneficiosChartRef.current) observer.observe(beneficiosChartRef.current);

    return () => {
      observer.disconnect();
      const producaoChart = producaoChartRef.current as ChartRef | null;
      if (producaoChart && producaoChart.chartInstance) {
        producaoChart.chartInstance.destroy();
      }
      const beneficiosChart = beneficiosChartRef.current as ChartRef | null;
      if (beneficiosChart && beneficiosChart.chartInstance) {
        beneficiosChart.chartInstance.destroy();
      }
    };
  }, []);

  return (
    <div className="antialiased">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
          <a href="#" className="text-2xl font-bold text-[#4a7c59]">Hortas Inteligentes</a>
          <div className="hidden md:flex space-x-8">
            <a href="#legado" className="nav-link">O Legado</a>
            <a href="#desafio" className="nav-link">O Desafio</a>
            <a href="#solucao" className="nav-link">A Solução</a>
            <a href="#evapotranspiracao" className="nav-link">Evapotranspiração</a>
            <a href="#futuro" className="nav-link">O Futuro (IA)</a>
            <a href="#ifsp" className="nav-link">O Protótipo</a>
          </div>
          <button id="mobile-menu-button" className="md:hidden p-2" onClick={() => setMenuMobileAberto(!menuMobileAberto)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-4 6h4" />
            </svg>
          </button>
        </nav>
        <div id="mobile-menu" className={`${menuMobileAberto ? 'block' : 'hidden'} md:hidden`}>
          <a href="#legado" className="block py-2 px-4 text-sm hover:bg-[#eaf2eb]" onClick={() => setMenuMobileAberto(false)}>O Legado</a>
          <a href="#desafio" className="block py-2 px-4 text-sm hover:bg-[#eaf2eb]" onClick={() => setMenuMobileAberto(false)}>O Desafio</a>
          <a href="#solucao" className="block py-2 px-4 text-sm hover:bg-[#eaf2eb]" onClick={() => setMenuMobileAberto(false)}>A Solução</a>
          <a href="#evapotranspiracao" className="block py-2 px-4 text-sm hover:bg-[#eaf2eb]" onClick={() => setMenuMobileAberto(false)}>Evapotranspiração</a>
          <a href="#futuro" className="block py-2 px-4 text-sm hover:bg-[#eaf2eb]" onClick={() => setMenuMobileAberto(false)}>O Futuro (IA)</a>
          <a href="#ifsp" className="block py-2 px-4 text-sm hover:bg-[#eaf2eb]" onClick={() => setMenuMobileAberto(false)}>O Protótipo</a>
        </div>
      </header>

      <main>
        <section id="hero" className="min-h-[60vh] flex items-center bg-cover bg-center" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1515150144380-bca9f1650ed9?q=80&w=2880&auto=format&fit=crop')" }}>
          <div className="container mx-auto px-6 text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4 text-shadow">Irrigação Inteligente para as Hortas de Birigui</h1>
            <p className="text-lg md:text-2xl mb-8 text-shadow">Transformando a agricultura comunitária com tecnologia, sustentabilidade e inovação.</p>
            <a href="#legado" className="bg-[#4a7c59] hover:bg-[#3b6347] text-white font-bold py-3 px-8 rounded-full transition duration-300">Explore o Projeto</a>
          </div>
        </section>

        <section id="legado" className="py-16 md:py-24 bg-[#f0ebe5]">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#4a7c59]">Um Legado de 40 Anos</h2>
              <p className="mt-4 text-lg max-w-3xl mx-auto">Desde a década de 1980, as hortas comunitárias transformam Birigui, convertendo terrenos ociosos em fontes de alimento, renda e coesão social. Hoje, o projeto é um modelo para o Brasil, combinando segurança alimentar com sustentabilidade.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16 text-center">
              <div className="card p-8">
                <span className="text-5xl font-bold text-[#4a7c59]" data-counter="63">0</span>
                <p className="mt-2 text-xl">Hortas Comunitárias</p>
              </div>
              <div className="card p-8">
                <span className="text-5xl font-bold text-[#4a7c59]" data-counter="2000">500</span>
                <p className="mt-2 text-xl">Famílias Beneficiadas</p>
              </div>
              <div className="card p-8">
                <span className="text-5xl font-bold text-[#4a7c59]" data-counter="100">0</span>
                <p className="mt-2 text-xl">% Orgânico</p>
              </div>
            </div>

            <div className="grid md:grid-cols-5 gap-8 items-center">
              <div className="md:col-span-3">
                <h3 className="text-2xl font-bold mb-4">Modelo de Economia Solidária</h3>
                <p className="mb-4">A produção das hortas é dividida de forma a beneficiar toda a comunidade. Uma lei municipal regulamentou um modelo de economia solidária que garante o sustento dos produtores, apoia entidades assistenciais e assegura o consumo próprio das famílias.</p>
                <ul className="space-y-2">
                  <li className="flex items-center"><span className="text-green-600 mr-2">✔</span> 1/3 para geração de renda</li>
                  <li className="flex items-center"><span className="text-green-600 mr-2">✔</span> 1/3 para doação a entidades</li>
                  <li className="flex items-center"><span className="text-green-600 mr-2">✔</span> 1/3 para consumo próprio</li>
                </ul>
              </div>
              <div className="md:col-span-2">
                <div className="chart-container">
                  <canvas id="producaoChart" ref={producaoChartRef}></canvas>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="desafio" className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#4a7c59]">O Desafio da Irrigação Manual</h2>
              <p className="mt-4 text-lg max-w-3xl mx-auto">Apesar do sucesso, o cuidado com as 63 hortas ainda depende de um processo manual e diário. Isso representa uma barreira para a eficiência, a escalabilidade e a inclusão de mais membros da comunidade.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="card p-6 text-center">
                <div className="text-4xl mb-4">🚶‍♂️</div>
                <h3 className="text-xl font-bold mb-2">Deslocamento Diário</h3>
                <p>Produtores precisam ir até a horta todos os dias apenas para irrigar, consumindo tempo e recursos.</p>
              </div>
              <div className="card p-6 text-center">
                <div className="text-4xl mb-4">💧</div>
                <h3 className="text-xl font-bold mb-2">Uso Ineficiente da Água</h3>
                <p>A irrigação manual pode levar ao desperdício de água, sem um controle preciso da umidade do solo.</p>
              </div>
              <div className="card p-6 text-center">
                <div className="text-4xl mb-4">🏋️</div>
                <h3 className="text-xl font-bold mb-2">Esforço Físico</h3>
                <p>O trabalho manual contínuo pode ser uma barreira para idosos e pessoas com mobilidade reduzida.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="solucao" className="py-16 md:py-24 bg-[#f0ebe5]">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#4a7c59]">A Solução: Um Ecossistema Inteligente</h2>
              <p className="mt-4 text-lg max-w-3xl mx-auto">Propomos um sistema de irrigação automatizado, sustentável e acessível, que integra componentes de hardware e software para otimizar o trabalho, economizar recursos e empoderar os produtores.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="group card p-6 text-center">
                <div className="tech-component p-6 rounded-lg">
                  <div className="tech-icon text-5xl mb-4 transition-colors">☀️</div>
                  <h3 className="text-xl font-bold mb-2">Energia Solar Autônoma</h3>
                  <p className="tech-detail">O sistema é 100% alimentado por painéis solares, eliminando custos com energia elétrica e garantindo operação sustentável e independente da rede.</p>
                </div>
              </div>
              <div className="group card p-6 text-center">
                <div className="tech-component p-6 rounded-lg">
                  <div className="tech-icon text-5xl mb-4 transition-colors">🌡️</div>
                  <h3 className="text-xl font-bold mb-2">Sensores e ESP32</h3>
                  <p className="tech-detail">Microcontroladores ESP32 com sensores de temperatura, umidade do ar, luminosidade e vento capturam dados climáticos precisos para decisões inteligentes de irrigação.</p>
                </div>
              </div>
              <div className="group card p-6 text-center">
                <div className="tech-component p-6 rounded-lg">
                  <div className="tech-icon text-5xl mb-4 transition-colors">📱</div>
                  <h3 className="text-xl font-bold mb-2">App Mobile (React Native)</h3>
                  <p className="tech-detail">Um aplicativo móvel em React Native permitirá o monitoramento e controle remoto do sistema pelos usuários, oferecendo flexibilidade total.</p>
                </div>
              </div>
              <div className="group card p-6 text-center">
                <div className="tech-component p-6 rounded-lg">
                  <div className="tech-icon text-5xl mb-4 transition-colors">🗄️</div>
                  <h3 className="text-xl font-bold mb-2">Banco de Dados (Firebase/Supabase)</h3>
                  <p className="tech-detail">Os dados capturados serão armazenados em um backend robusto como Firebase ou Supabase, garantindo segurança e acesso em tempo real.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="evapotranspiracao" className="py-16 md:py-24 bg-[#f0ebe5]">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#4a7c59]">Evapotranspiração: A Base da Irrigação Inteligente Inicial</h2>
              <p className="mt-4 text-lg max-w-3xl mx-auto">
                Enquanto coletamos dados suficientes para o treinamento de uma Inteligência Artificial avançada, o sistema de irrigação utilizará o cálculo da evapotranspiração para otimizar o uso da água desde o início. Este método garante uma irrigação eficiente e adaptada às necessidades das plantas.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-left">O Que é Evapotranspiração?</h3>
                <p className="mb-4 text-left">
                  Evapotranspiração é a combinação da evaporação da água da superfície do solo e da transpiração da água pelas plantas. É um indicador chave de quanta água uma planta "perde" para a atmosfera e, portanto, de quanta água ela precisa para se manter saudável.
                </p>
                <ul className="space-y-2 text-left">
                  <li className="flex items-center"><span className="text-green-600 mr-2">✔</span> Evaporação: Perda de água do solo e superfícies vegetais para a atmosfera.</li>
                  <li className="flex items-center"><span className="text-green-600 mr-2">✔</span> Transpiração: Liberação de vapor d'água pelas plantas através de suas folhas.</li>
                  <li className="flex items-center"><span className="text-green-600 mr-2">✔</span> Necessidade Hídrica: A evapotranspiração reflete a demanda real de água das culturas.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-4 text-left">Como Calculamos?</h3>
                <p className="text-left">
                  Utilizamos dados de sensores (temperatura, umidade do ar, luminosidade) e informações climáticas para estimar a evapotranspiração de referência (ETo). Com base nesse cálculo e nas características da cultura, o sistema determinará a quantidade e o momento ideal para irrigar.
                </p>
                <div className="mt-4 text-left">
                  <h4 className="font-bold text-lg mb-2">Fatores Considerados no Cálculo:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Temperatura do Ar: Afeta a taxa de evaporação.</li>
                    <li>Umidade do Ar: Influencia a capacidade do ar de absorver mais vapor d'água.</li>
                    <li>Radiação Solar: Principal fonte de energia para a evaporação e transpiração.</li>
                    <li>Velocidade do Vento: Ajuda a remover o vapor d'água da superfície das plantas e do solo.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="justify-items-center-safe mt-8">
              <div className="item-center">
                <img
                  src="https://s1.static.brasilescola.uol.com.br/be/2021/05/ciclo-da-agua.jpg"
                  alt="Ilustração de Evaporação"
                  className="rounded-lg shadow-md w-full min-w-lg max-w-sm"
                />
                <p className="mt-2 text-sm text-gray-600"></p>
              </div>
            </div>
          </div>
        </section>


        <section id="futuro" className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#4a7c59]">O Futuro: A Inteligência Artificial Preditiva</h2>
              <p className="mt-4 text-lg max-w-3xl mx-auto">Com a coleta contínua de dados e o aprimoramento do sistema, a próxima fase do projeto integrará a Inteligência Artificial. A IA aprenderá com os padrões históricos e as condições em tempo real para otimizar ainda mais a irrigação, tornando-a preditiva e adaptativa.</p>
            </div>

            <div className="grid md:grid-cols-5 gap-8 items-center">
              <div className="md:col-span-2">
                <div className="chart-container">
                  <canvas id="beneficiosChart" ref={beneficiosChartRef}></canvas>
                </div>
              </div>
              <div className="md:col-span-3">
                <h3 className="text-2xl font-bold mb-4">De Dados a Decisões Otimizadas com IA</h3>
                <p className="mb-4">A Inteligência Artificial irá além dos cálculos de evapotranspiração, utilizando algoritmos avançados para prever as necessidades hídricas futuras das plantas e ajustar a irrigação de forma proativa. Isso significa prever a necessidade de água antes mesmo que o solo fique seco, maximizando a eficiência.</p>
                <div className="space-y-4">
                  <div className="group p-4 rounded-lg transition hover:bg-gray-100">
                    <h4 className="font-bold">1. Coleta Contínua de Dados</h4>
                    <p className="text-sm">Sensores na horta e dados de clima alimentam o sistema.</p>
                  </div>
                  <div className="group p-4 rounded-lg transition hover:bg-gray-100">
                    <h4 className="font-bold">2. Análise Preditiva com IA</h4>
                    <p className="text-sm">Algoritmos de Machine Learning analisam os dados para encontrar padrões e prever necessidades.</p>
                  </div>
                  <div className="group p-4 rounded-lg transition hover:bg-gray-100">
                    <h4 className="font-bold">3. Recomendações Precisas e Autônomas</h4>
                    <p className="text-sm">A IA sugere ou executa o momento e a quantidade exata de água para máxima eficiência.</p>
                  </div>
                  <div className="group p-4 rounded-lg transition hover:bg-gray-100">
                    <h4 className="font-bold">4. Irrigação Otimizada e Adaptativa</h4>
                    <p className="text-sm">O sistema executa a irrigação de forma autônoma, economizando recursos e aumentando a produtividade, adaptando-se em tempo real.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="ifsp" className="py-16 md:py-24">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#4a7c59]">IFSP Birigui: O Polo de Inovação</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">O protótipo será desenvolvido e avaliado na horta do IFSP - Campus Birigui. A instituição servirá como um laboratório vivo, combinando sua expertise técnica com um ambiente de co-criação para garantir que a solução seja robusta, eficaz e pronta para ser apresentada à comunidade.</p>
            <div className="mt-8">
              <a href="https://bri.ifsp.edu.br/" target="_blank" className="bg-white text-[#4a7c59] hover:bg-gray-200 font-bold py-3 px-8 rounded-full transition duration-300">Conheça o Campus</a>
            </div>
          </div>
        </section>
      </main>

       <footer className="bg-[#f0ebe5] py-8">
        <div className="container mx-auto px-6 text-center text-gray-600">
          <p>&copy; 2025 Projeto de Irrigação Inteligente - Uma colaboração para o futuro de Birigui.</p>
          <p className="text-sm mt-2">Desenvolvido como uma iniciativa do IFSP - Campus Birigui.</p>
          <div className="flex justify-center items-center space-x-4 mt-4">
            {/* Ícone e link do Instagram */}
            <a href="https://www.instagram.com/ifspbirigui" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-instagram transition duration-300 transform hover:scale-110">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            {/* Ícone e link do YouTube */}
            <a href="https://www.youtube.com/channel/UCy79j-3UoJ4EwYJ3I3p9k9A" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-youtube transition duration-300 transform hover:scale-110">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2A54.47 54.47 0 0 0 12 3c-4.99 0-9.66.42-10.6 1.42A2.78 2.78 0 0 0 1.46 6.42C1 8.52 1 12 1 12s0 3.48.46 5.58a2.78 2.78 0 0 0 1.94 2A54.47 54.47 0 0 0 12 21c4.99 0 9.66-.42 10.6-1.42a2.78 2.78 0 0 0 1.94-2C23 15.48 23 12 23 12s0-3.48-.46-5.58z"></path>
                <polygon points="10 8 16 12 10 16 10 8"></polygon>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
