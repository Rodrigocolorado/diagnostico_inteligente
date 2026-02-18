const numero = "5551981757073"; // coloque seu WhatsApp (DDI+DDD+numero)

const radios = document.querySelectorAll("input[type='radio']");
radios.forEach(r => r.addEventListener("change", atualizarProgresso));

function atualizarProgresso(){
  const totalPerguntas = 5;
  const respondidas = document.querySelectorAll("input[type='radio']:checked").length;
  const progresso = (respondidas / totalPerguntas) * 100;
  document.getElementById("progress").style.width = progresso + "%";
}

function brl(v){
  v = Number(v) || 0;
  return v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
}

function calcular(){
  const respostas = document.querySelectorAll("input[type='radio']:checked");
  if(respostas.length < 5){
    alert("Responda todas as perguntas.");
    return;
  }

  let total = 0;
  respostas.forEach(r => total += parseInt(r.value));

  // Receita para simular prejuízo
  const revenue = Number(document.getElementById("monthlyRevenue").value) || 0;

  // taxa de perda estimada baseada na pontuação (bem conservadora)
  // organizado -> 1% a 2%
  // risco -> 3% a 5%
  // alto risco -> 6% a 9%
  let plano, nivel, cor, lossRateMin, lossRateMax;

  if(total <= 3){
    plano = "Plano Starter";
    nivel = "Negócio Organizado";
    cor = "#16a34a";
    lossRateMin = 0.01; lossRateMax = 0.02;
  } else if(total <= 6){
    plano = "Plano Profissional";
    nivel = "Negócio em Risco";
    cor = "#facc15";
    lossRateMin = 0.03; lossRateMax = 0.05;
  } else {
    plano = "Plano Premium";
    nivel = "Alto Risco Operacional";
    cor = "#ef4444";
    lossRateMin = 0.06; lossRateMax = 0.09;
  }

  // pontuação visual (0 a 10)
  const porcentagem = (total / 10) * 100;

  // prejuízo estimado
  const lossMin = revenue * lossRateMin;
  const lossMax = revenue * lossRateMax;

  const lossYearMin = lossMin * 12;
  const lossYearMax = lossMax * 12;

  const textoPerda = revenue > 0
    ? `Estimativa conservadora de perda: <strong>${brl(lossMin)} a ${brl(lossMax)}</strong> por mês`
    : `Para estimar o prejuízo, informe um faturamento mensal aproximado acima.`;

  // Render resultado
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

  // mostrar depoimentos
  document.getElementById("depoimentos").classList.remove("hidden");
}

function whats(plano, lossMin, lossMax){
  const msg = [
    "Olá! Fiz o Diagnóstico Inteligente no site.",
    `Plano recomendado: ${plano}.`,
    (lossMin && lossMax) ? `Prejuízo estimado: ${brl(lossMin)} a ${brl(lossMax)} por mês.` : "",
    "Quero entender como funciona e quanto ficaria para o meu negócio."
  ].filter(Boolean).join("\n");

  window.open(`https://wa.me/${numero}?text=${encodeURIComponent(msg)}`, "_blank");
}



