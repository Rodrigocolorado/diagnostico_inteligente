// js/script.js

// ================================
// CONFIG
// ================================
const numero = "5551981757073"; // WhatsApp (DDI+DDD+numero)

// ================================
// BARRA DE PROGRESSO
// ================================
function atualizarProgresso() {
  const totalPerguntas = 5;
  const respondidas = document.querySelectorAll("input[type='radio']:checked").length;
  const progresso = (respondidas / totalPerguntas) * 100;

  const progressEl = document.getElementById("progress");
  if (progressEl) progressEl.style.width = progresso + "%";
}

// ================================
// FORMATAÇÃO EM REAL (R$)
// ================================
function brl(v) {
  v = Number(v) || 0;
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// ================================
// FUNÇÃO PRINCIPAL
// ================================
function calcular() {
  const respostas = document.querySelectorAll("input[type='radio']:checked");

  if (respostas.length < 5) {
    alert("Responda todas as perguntas.");
    return;
  }

  let total = 0;
  respostas.forEach((r) => (total += parseInt(r.value, 10)));

  // Faturamento
  const revenueEl = document.getElementById("monthlyRevenue");
  const revenueString = revenueEl ? revenueEl.value : "";

  const revenue =
    parseFloat(revenueString.replace(/\./g, "").replace(",", ".")) || 0;

  // Definir nível e taxa de perda
  let plano, nivel, cor, lossRateMin, lossRateMax;

  if (total <= 3) {
    plano = "Plano Starter";
    nivel = "Negócio Organizado";
    cor = "#16a34a";
    lossRateMin = 0.01;
    lossRateMax = 0.02;
  } else if (total <= 6) {
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

  const textoPerda =
    revenue > 0
      ? `Estimativa conservadora de perda: <strong>${brl(lossMin)} a ${brl(lossMax)}</strong> por mês`
      : `Informe um faturamento aproximado para calcular a estimativa de prejuízo.`;

  // Renderizar resultado
  const resultadoEl = document.getElementById("resultado");
  if (resultadoEl) {
    resultadoEl.innerHTML = `
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
  }

  // Mostrar depoimentos
  const depoimentosEl = document.getElementById("depoimentos");
  if (depoimentosEl) depoimentosEl.classList.remove("hidden");
}

// ================================
// FUNÇÃO WHATSAPP
// ================================
function whats(plano, lossMin, lossMax) {
  const msg = [
    "Olá! Fiz o Diagnóstico Inteligente no site.",
    `Plano recomendado: ${plano}.`,
    lossMin && lossMax
      ? `Prejuízo estimado: ${brl(lossMin)} a ${brl(lossMax)} por mês.`
      : "",
    "Quero entender como funciona e quanto ficaria para o meu negócio.",
  ]
    .filter(Boolean)
    .join("\n");

  window.open(`https://wa.me/${numero}?text=${encodeURIComponent(msg)}`, "_blank");
}

// ================================
// ANO AUTOMÁTICO
// ================================
function setYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

// ================================
// FECHAR CARD (onclick no HTML)
// ================================
function fecharCard() {
  const card = document.getElementById("heroCard");
  if (card) card.classList.add("hide");
}

// ===============================
// ANIMAÇÃO SUAVE 0 → FINAL
// ===============================
function animarNumero(final) {
  let atual = 0;
  const elemento = document.getElementById("visitCount");
  if (!elemento) return;

  const incremento = Math.max(1, Math.ceil(final / 80));

  const intervalo = setInterval(() => {
    atual += incremento;

    if (atual >= final) {
      atual = final;
      clearInterval(intervalo);
    }

    elemento.textContent = atual.toLocaleString("pt-BR");
  }, 15);
}

// ===============================
// CONTADOR GLOBAL (Opção A) - CountAPI
// Mesma contagem em PC e celular
// Conta 1 vez por sessão (evita inflar no F5)
// ===============================
const COUNTER_NAMESPACE = "rodrigo-systems-visitcount-7073"; // deixe único
const COUNTER_KEY = "diagnostico";
const SESSION_KEY = "counted_this_session_v1";

async function getCount() {
  const url = `https://api.countapi.xyz/get/${encodeURIComponent(
    COUNTER_NAMESPACE
  )}/${encodeURIComponent(COUNTER_KEY)}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Falha ao ler contador");
  const data = await res.json();
  return Number(data.value || 0);
}

async function hitCount() {
  const url = `https://api.countapi.xyz/hit/${encodeURIComponent(
    COUNTER_NAMESPACE
  )}/${encodeURIComponent(COUNTER_KEY)}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Falha ao incrementar contador");
  const data = await res.json();
  return Number(data.value || 0);
}

async function initVisitCount() {
  const visitEl = document.getElementById("visitCount");
  if (!visitEl) return;

  try {
    const already = sessionStorage.getItem(SESSION_KEY) === "1";
    const value = already ? await getCount() : await hitCount();
    sessionStorage.setItem(SESSION_KEY, "1");
    animarNumero(value);
  } catch (e) {
    console.warn("Contador global falhou:", e);
    animarNumero(98); // fallback
  }
}

// ================================
// MÁSCARA AUTOMÁTICA NO FATURAMENTO
// ================================
function initRevenueMask() {
  const revenueInput = document.getElementById("monthlyRevenue");
  if (!revenueInput) return;

  revenueInput.addEventListener("input", function (e) {
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
}

// ================================
// INIT
// ================================
document.addEventListener("DOMContentLoaded", () => {
  // listeners do progresso
  const radios = document.querySelectorAll("input[type='radio']");
  radios.forEach((r) => r.addEventListener("change", atualizarProgresso));

  initRevenueMask();
  setYear();
  initVisitCount();
});
