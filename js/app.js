/* Valkirias Events — calculator state machine */

const state = {
  cityId: null,
  themeId: null,
  extraIds: new Set(),
};

const fmt = (n) => "€" + n.toLocaleString("en-US");

function getCity() { return CITIES.find((c) => c.id === state.cityId) || null; }
function getTheme() { return THEMES.find((t) => t.id === state.themeId) || null; }
function getSelectedExtras() { return EXTRAS.filter((e) => state.extraIds.has(e.id)); }

function computeTotals() {
  const city = getCity();
  const theme = getTheme();
  if (!city) return null;

  const cityBase = city.basePrice;
  const themePrice = theme ? priceForCity(theme.basePrice, city) : 0;
  const extrasPriced = getSelectedExtras().map((e) => ({
    ...e,
    price: priceForCity(e.basePrice, city),
  }));
  const extrasTotal = extrasPriced.reduce((sum, e) => sum + e.price, 0);

  const subtotal = cityBase + themePrice + extrasTotal;
  const vat = Math.round(subtotal * VAT_RATE);
  const total = subtotal + vat;
  const deposit = Math.round(total * DEPOSIT_RATE);

  return { city, theme, extrasPriced, cityBase, themePrice, extrasTotal, subtotal, vat, total, deposit };
}

/* ---------- Screen navigation ---------- */

const SCREEN_ORDER = ["screen-intro", "screen-city", "screen-theme", "screen-extras", "screen-summary"];
const STEP_FOR_SCREEN = { "screen-city": 1, "screen-theme": 2, "screen-extras": 3, "screen-summary": 4 };

function showScreen(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.toggle("active", s.id === id));
  updateProgress(id);
  updateStickyTotal(id);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateProgress(activeId) {
  const progress = document.getElementById("progress");
  const currentStep = STEP_FOR_SCREEN[activeId] || 0;
  progress.style.visibility = currentStep === 0 ? "hidden" : "visible";
  document.querySelectorAll(".progress-step").forEach((el) => {
    const step = Number(el.dataset.step);
    el.classList.toggle("current", step === currentStep);
    el.classList.toggle("done", step < currentStep);
  });
}

function updateStickyTotal(activeId) {
  const bar = document.getElementById("sticky-total");
  const showOn = ["screen-theme", "screen-extras"];
  if (!showOn.includes(activeId) || !state.cityId) {
    bar.classList.remove("visible");
    return;
  }
  bar.classList.add("visible");
  const totals = computeTotals();
  document.getElementById("sticky-label").textContent =
    activeId === "screen-theme" ? "Starting from" : "Running total (excl. VAT)";
  document.getElementById("sticky-amount").textContent = fmt(totals.subtotal);
  document.getElementById("btn-see-quote").style.display = activeId === "screen-extras" ? "inline-block" : "none";
}

/* ---------- Renderers ---------- */

function renderCities() {
  const grid = document.getElementById("city-grid");
  grid.innerHTML = "";
  CITIES.forEach((city) => {
    const card = document.createElement("div");
    card.className = "pick-card" + (state.cityId === city.id ? " selected" : "");
    card.innerHTML = `
      <span class="checkmark">✓</span>
      <div class="region">${city.region}</div>
      <div class="name">${city.name}</div>
      <div class="tagline">${city.tagline}</div>
      <div class="price-tag">From ${fmt(city.basePrice)} base</div>
    `;
    card.addEventListener("click", () => selectCity(city.id));
    grid.appendChild(card);
  });
}

function selectCity(cityId) {
  if (state.cityId !== cityId) {
    // Reset downstream choices that may no longer be valid/available
    state.themeId = null;
    state.extraIds.clear();
  }
  state.cityId = cityId;
  renderCities();
  renderThemes();
  renderExtras();
  showScreen("screen-theme");
}

function renderThemes() {
  const city = getCity();
  const grid = document.getElementById("theme-grid");
  const subtitle = document.getElementById("theme-subtitle");
  grid.innerHTML = "";
  if (!city) return;

  subtitle.textContent = `Themes available in ${city.name}.`;

  const available = THEMES.filter((t) => isAvailableInCity(t, city.id));
  available.forEach((theme) => {
    const price = priceForCity(theme.basePrice, city);
    const card = document.createElement("div");
    card.className = "pick-card" + (state.themeId === theme.id ? " selected" : "");
    card.innerHTML = `
      <span class="checkmark">✓</span>
      <div class="icon">${theme.icon}</div>
      <div class="name">${theme.name}</div>
      <div class="tagline">${theme.tagline}</div>
      <div class="price-tag">${fmt(price)}</div>
    `;
    card.addEventListener("click", () => selectTheme(theme.id));
    grid.appendChild(card);
  });

  const unavailableCount = THEMES.length - available.length;
  if (unavailableCount > 0) {
    const note = document.createElement("p");
    note.className = "extra-empty-note";
    note.style.gridColumn = "1 / -1";
    note.textContent = `${unavailableCount} theme${unavailableCount > 1 ? "s" : ""} not currently offered in ${city.name}.`;
    grid.appendChild(note);
  }
}

function selectTheme(themeId) {
  state.themeId = themeId;
  renderThemes();
  updateStickyTotal("screen-theme");
  renderExtras();
  showScreen("screen-extras");
}

function renderExtras() {
  const city = getCity();
  const container = document.getElementById("extras-categories");
  const subtitle = document.getElementById("extras-subtitle");
  container.innerHTML = "";
  if (!city) return;

  subtitle.textContent = `Available add-ons in ${city.name} — pick as many as you like.`;

  const categories = [...new Set(EXTRAS.map((e) => e.category))];
  categories.forEach((category) => {
    const itemsInCategory = EXTRAS.filter((e) => e.category === category);
    const available = itemsInCategory.filter((e) => isAvailableInCity(e, city.id));
    if (available.length === 0) return;

    const section = document.createElement("div");
    section.className = "extra-category";
    const heading = document.createElement("h3");
    heading.textContent = category;
    section.appendChild(heading);

    const grid = document.createElement("div");
    grid.className = "card-grid";

    available.forEach((extra) => {
      const price = priceForCity(extra.basePrice, city);
      const card = document.createElement("div");
      card.className = "pick-card" + (state.extraIds.has(extra.id) ? " selected" : "");
      card.innerHTML = `
        <span class="checkmark">✓</span>
        <div class="icon">${extra.icon}</div>
        <div class="name">${extra.name}</div>
        <div class="tagline">${extra.tagline}</div>
        <div class="price-tag">${fmt(price)}</div>
      `;
      card.addEventListener("click", () => toggleExtra(extra.id));
      grid.appendChild(card);
    });

    section.appendChild(grid);
    container.appendChild(section);
  });
}

function toggleExtra(extraId) {
  if (state.extraIds.has(extraId)) {
    state.extraIds.delete(extraId);
  } else {
    state.extraIds.add(extraId);
  }
  renderExtras();
  updateStickyTotal("screen-extras");
}

function renderSummary() {
  const totals = computeTotals();
  const invoice = document.getElementById("invoice");
  if (!totals) return;

  const { city, theme, extrasPriced, cityBase, themePrice, extrasTotal, subtotal, vat, total, deposit } = totals;

  let html = "";

  html += `<div class="invoice-section-label">Location</div>`;
  html += `<div class="invoice-line"><span class="item-name">${city.name} <span class="item-sub">${city.region}</span></span><span class="item-price">${fmt(cityBase)}</span></div>`;

  if (theme) {
    html += `<div class="invoice-section-label">Theme</div>`;
    html += `<div class="invoice-line"><span class="item-name">${theme.icon} ${theme.name}</span><span class="item-price">${fmt(themePrice)}</span></div>`;
  }

  if (extrasPriced.length > 0) {
    html += `<div class="invoice-section-label">Extras (${extrasPriced.length})</div>`;
    extrasPriced.forEach((e) => {
      html += `<div class="invoice-line"><span class="item-name">${e.icon} ${e.name}</span><span class="item-price">${fmt(e.price)}</span></div>`;
    });
  }

  html += `<div class="invoice-line" style="border-bottom:none; opacity:0.85;"><span class="item-name">Subtotal</span><span class="item-price">${fmt(subtotal)}</span></div>`;
  html += `<div class="invoice-line" style="border-bottom:none; opacity:0.85;"><span class="item-name">VAT (21%)</span><span class="item-price">${fmt(vat)}</span></div>`;

  html += `<div class="invoice-total-row"><span class="label">Estimated Total</span><span class="amount">${fmt(total)}</span></div>`;
  html += `<div class="invoice-deposit">Reservation deposit (30%): <strong>${fmt(deposit)}</strong></div>`;

  invoice.innerHTML = html;

  document.getElementById("fine-print").textContent =
    `This estimate was generated on ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} ` +
    `for a ${theme ? theme.name : "custom"} wedding in ${city.name}, based on example prototype pricing. ` +
    `Figures include an illustrative 21% VAT and exclude travel surcharges outside the metro area, guest catering, and photography unless separately quoted. ` +
    `Final pricing is confirmed only after a consultation with a Valkirias Events planner and a signed venue-availability check. Prices are not a binding offer.`;
}

/* ---------- Wire up ---------- */

document.getElementById("btn-start").addEventListener("click", () => showScreen("screen-city"));

document.querySelectorAll("[data-back]").forEach((btn) => {
  btn.addEventListener("click", () => showScreen(btn.dataset.back));
});

document.getElementById("btn-see-quote").addEventListener("click", () => {
  renderSummary();
  showScreen("screen-summary");
});

document.getElementById("btn-print").addEventListener("click", () => window.print());

document.getElementById("btn-restart").addEventListener("click", () => {
  state.cityId = null;
  state.themeId = null;
  state.extraIds.clear();
  renderCities();
  renderThemes();
  renderExtras();
  showScreen("screen-intro");
});

renderCities();
showScreen("screen-intro");
