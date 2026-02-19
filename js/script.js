const numero = "5551981757073"; // Seu WhatsApp (DDI+DDD+numero)

// ================================
// BARRA DE PROGRESSO
// ================================

const radios = document.querySelectorAll("input[type='radio']");
radios.forEach(r => r.addEventListener("change", atualizarProgresso));

function atualizarProgresso(){
  const totalPerguntas = 5;
  const respondidas = document.querySelectorAll("input[type='radio']:checked").length;
  const progresso = (respondidas / totalPerguntas) * 100;
  document.getElementById("progress").style.width = progresso + "%";
}

// ================================
// FORMATAÇÃO EM REAL (R$)
// ================================

function brl(v){
  v = Number(v) || 0;
  return v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
}

// Máscara automática no faturamento
const revenueInput = document.getElementById("monthlyRevenue");

revenueInput.addEventListener("input", function(e) {

    let value = e.target.value.replace(/\D/g, "");

    if (!value) {
        e.target.value = "";
        return;
    }

    value = (parseInt(value, 10) / 100).toFixed(2);
    value = value.replace(".", ",");
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    e.target.value = value;
});

// ================================
// FUNÇÃO PRINCIPAL
// ================================

function calcular(){

  const respostas = document.querySelectorAll("input[type='radio']:checked");

  if(respostas.length < 5){
    alert("Responda todas as perguntas.");
    return;
  }

  let total = 0;
  respostas.forEach(r => total += parseInt(r.value));

  // Pegar faturamento formatado corretamente
  let revenueString = document.getElementById("monthlyRevenue").value;

  let revenue = parseFloat(
      revenueString.replace(/\./g, "").replace(",", ".")
  ) || 0;

  // Definir nível e taxa de perda
  let plano, nivel, cor, lossRateMin, lossRateMax;

  if(total <= 3){
    plano = "Plano Starter";
    nivel = "Negócio Organizado";
    cor = "#16a34a";
    lossRateMin = 0.01; 
    lossRateMax = 0.02;

  } else if(total <= 6){
    plano = "Plano Profissional";
    nivel = "Negócio em Risco";
    cor = "#facc15";
    lossRateMin = 0.03; 
    lossRateMax = 0.05;

  } else {
    plano = "Plano Premium";
    nivel = "Alto Risco Operacional";
    cor = "#ef4444";
    lossRateMin = 0.06; 
    lossRateMax = 0.09;
  }

  // Pontuação visual
  const porcentagem = (total / 10) * 100;

  // Cálculo prejuízo
  const lossMin = revenue * lossRateMin;
  const lossMax = revenue * lossRateMax;

  const lossYearMin = lossMin * 12;
  const lossYearMax = lossMax * 12;

  const textoPerda = revenue > 0
    ? `Estimativa conservadora de perda: <strong>${brl(lossMin)} a ${brl(lossMax)}</strong> por mês`
    : `Informe um faturamento aproximado para calcular a estimativa de prejuízo.`;

  // Renderizar resultado
  document.getElementById("resultado").innerHTML = `
    <h2>${nivel}</h2>

    <div class="score-circle"
      style="background:conic-gradient(${cor} ${porcentagem}%, #334155 ${porcentagem}%);">
      ${porcentagem.toFixed(0)}%
    </div>

    <p>Plano recomendado: <strong>${plano}</strong></p>

    <div class="kpis">
      <div class="kpi">
        <span>Prejuízo estimado/mês</span>
        <strong>${revenue > 0 ? `${brl(lossMin)} - ${brl(lossMax)}` : "—"}</strong>
      </div>
      <div class="kpi">
        <span>Prejuízo estimado/ano</span>
        <strong>${revenue > 0 ? `${brl(lossYearMin)} - ${brl(lossYearMax)}` : "—"}</strong>
      </div>
    </div>

    <div class="alert">
      ${textoPerda}
      <br><br>
      ✅ A boa notícia: com um sistema, você reduz erros, melhora o controle e aumenta a margem.
    </div>

    <button class="btn" onclick="whats('${plano}', ${lossMin}, ${lossMax})">
      Quero Resolver Agora (WhatsApp)
    </button>
  `;

  // Mostrar botão flutuante WhatsApp
  document.getElementById("whatsappFloat").classList.remove("hidden");

  // Mostrar depoimentos
  document.getElementById("depoimentos").classList.remove("hidden");
}

// ================================
// FUNÇÃO WHATSAPP
// ================================

function whats(plano, lossMin, lossMax){
  const msg = [
    "Olá! Fiz o Diagnóstico Inteligente no site.",
    `Plano recomendado: ${plano}.`,
    (lossMin && lossMax) ? `Prejuízo estimado: ${brl(lossMin)} a ${brl(lossMax)} por mês.` : "",
    "Quero entender como funciona e quanto ficaria para o meu negócio."
  ].filter(Boolean).join("\n");

  window.open(`https://wa.me/${numero}?text=${encodeURIComponent(msg)}`, "_blank");
}

// ================================
// ANO AUTOMÁTICO
// ================================

const yearEl = document.getElementById("year");
if(yearEl){
  yearEl.textContent = new Date().getFullYear();
}

function fecharCard(){
  const card = document.getElementById("heroCard");
  card.classList.add("hide");
}

// ===============================
// CONTADOR INTELIGENTE
// ===============================

// Número base inicial (você escolhe)
const baseInicial = 97;

// Recupera contador salvo
let contadorGlobal = localStorage.getItem("contadorGlobal");

if(!contadorGlobal){
  contadorGlobal = baseInicial;
} else {
  contadorGlobal = parseInt(contadorGlobal);
}

// Incrementa a cada visita
contadorGlobal += 1;

// Salva novamente
localStorage.setItem("contadorGlobal", contadorGlobal);

// ===============================
// ANIMAÇÃO SUAVE DO NÚMERO
// ===============================

function animarNumero(final){
  let atual = 0;
  const elemento = document.getElementById("visitCount");
  const incremento = Math.ceil(final / 60);

  const intervalo = setInterval(() => {
    atual += incremento;

    if(atual >= final){
      atual = final;
      clearInterval(intervalo);
    }

    elemento.textContent = atual;
  }, 20);
}

// Executar animação
animarNumero(contadorGlobal);

