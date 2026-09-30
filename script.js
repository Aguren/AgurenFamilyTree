(() => {
  const DATA = window.FAMILY_TREE;
  const EMAIL = window.FAMILY_SUBMISSION_EMAIL || "agurenbalkov@gmail.com";
  let currentTree = "paternal";
  let lang = "en";

  try { lang = localStorage.getItem("familyLanguage") || "en"; } catch {}
  if (!["en","bg","tr"].includes(lang)) lang = "en";

  const treeRoot = document.getElementById("treeRoot");
  const mobileTreeRoot = document.getElementById("mobileTreeRoot");
  const treeWrap = document.getElementById("treeWrap");
  const linesSvg = document.getElementById("treeLines");

  const personModal = document.getElementById("personModal");
  const personDetails = document.getElementById("personDetails");
  const formModal = document.getElementById("formModal");
  const familyForm = document.getElementById("familyForm");
  const message = document.getElementById("message");

  const t = key => (window.TEXT[lang] && window.TEXT[lang][key]) || window.TEXT.en[key] || key;
  const phrase = value => {
    if (!value) return "";
    if (typeof value === "object") {
      return value[lang] || value.en || "";
    }
    if (lang === "en") return value;
    const d = (window.PHRASES && window.PHRASES[lang]) || {};
    return d[value] || value;
  };

  const localize = value => {
    if (!value) return "";
    if (typeof value === "object") return value[lang] || value.en || "";
    return phrase(value);
  };

  function applyLanguage() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(el => el.textContent = t(el.dataset.i18n));
    document.querySelectorAll(".lang").forEach(btn => btn.classList.toggle("active", btn.dataset.lang === lang));
    updateTreeHeading();
    renderTree();
  }

  function updateTreeHeading() {
    document.getElementById("sideLabel").textContent =
      currentTree === "paternal" ? t("fathers_side") : t("mothers_side");
    document.getElementById("treeTitle").textContent = DATA[currentTree].title;
  }

  function getDates(person) {
    if (person.birth || person.death) {
      return `${person.birth || "?"} – ${person.death || ""}`;
    }
    if (person.deceased) return t("deceased");
    return "";
  }

  function personCard(personId) {
    const p = DATA.people[personId];
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `person-card ${p.sex || ""}`;
    btn.dataset.personId = personId;
    btn.innerHTML = `
      <div class="photo-box">${p.photo ? `<img src="${escapeHtml(p.photo)}" alt="">` : (p.sex === "f" ? "👩" : "👨")}</div>
      <div class="person-name">${escapeHtml(p.name)}</div>
      ${getDates(p) ? `<div class="person-dates">${escapeHtml(getDates(p))}</div>` : ""}
      <div class="person-relation">${escapeHtml(t(p.relation))}</div>
      ${p.alt ? `<div class="person-alt">${escapeHtml(localize(p.alt))}</div>` : ""}
      ${p.highlights && p.highlights.length ? `
        <div class="history-preview">
          ${p.highlights.slice(0,3).map(h => `<div class="history-line">• ${escapeHtml(localize(h))}</div>`).join("")}
          ${p.highlights.length > 3 ? `<div class="history-more">+ ${p.highlights.length - 3} ${escapeHtml(t("more_notes"))}</div>` : ""}
        </div>` : ""}
      <div class="card-action">＋ ${escapeHtml(t("details"))}</div>
    `;
    btn.addEventListener("click", () => openPerson(personId));
    return btn;
  }

  function renderUnit(unit) {
    const wrapper = document.createElement("div");
    wrapper.className = "family-unit";

    const peopleRow = document.createElement("div");
    peopleRow.className = unit.people.length > 1 ? "people-row couple-row" : "people-row";
    unit.people.forEach(id => peopleRow.appendChild(personCard(id)));
    wrapper.appendChild(peopleRow);

    if (unit.children && unit.children.length) {
      const childrenRow = document.createElement("div");
      childrenRow.className = "children-row";

      unit.children.forEach(child => {
        const childWrap = document.createElement("div");
        childWrap.className = "child-unit";
        childWrap.appendChild(renderUnit(child));
        childrenRow.appendChild(childWrap);
      });

      wrapper.appendChild(childrenRow);
    }

    return wrapper;
  }

  function sizeTreeContainer() {
    const isMobileLayout = window.matchMedia("(max-width: 900px)").matches;

    if (isMobileLayout) {
      treeWrap.style.width = "";
      treeWrap.style.minWidth = "";
      return;
    }

    const rootFamily = treeRoot.firstElementChild;
    if (!rootFamily) return;

    // Measure the actual family tree instead of relying on a fixed page width.
    // The extra space becomes the white margin around the outermost family cards.
    const treeWidth = Math.ceil(rootFamily.getBoundingClientRect().width);
    const desiredWidth = Math.max(window.innerWidth - 40, treeWidth + 76);

    treeWrap.style.width = desiredWidth + "px";
    treeWrap.style.minWidth = desiredWidth + "px";
  }


  function mobilePersonCard(personId) {
    const p = DATA.people[personId];
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `mobile-person ${p.sex || ""}`;
    btn.innerHTML = `
      <div class="mobile-avatar">${p.photo ? `<img src="${escapeHtml(p.photo)}" alt="">` : (p.sex === "f" ? "👩" : "👨")}</div>
      <div>
        <div class="mobile-person-name">${escapeHtml(p.name)}</div>
        ${getDates(p) ? `<div class="mobile-person-dates">${escapeHtml(getDates(p))}</div>` : ""}
        <div class="mobile-person-relation">${escapeHtml(t(p.relation))}</div>
        <div class="mobile-person-action">＋ ${escapeHtml(t("details"))}</div>
      </div>
      ${p.alt ? `<div class="mobile-alt">${escapeHtml(localize(p.alt))}</div>` : ""}
      ${p.highlights && p.highlights.length ? `
        <div class="mobile-history">
          ${p.highlights.slice(0,2).map(h => `<div>• ${escapeHtml(localize(h))}</div>`).join("")}
          ${p.highlights.length > 2 ? `<div class="mobile-history-more">+ ${p.highlights.length - 2} ${escapeHtml(t("more_notes"))}</div>` : ""}
        </div>` : ""}
    `;
    btn.addEventListener("click", () => openPerson(personId));
    return btn;
  }

  function renderMobileUnit(unit, depth = 0) {
    const block = document.createElement("div");
    block.className = depth === 0 ? "mobile-family-block" : "mobile-child";

    const couple = document.createElement("div");
    couple.className = unit.people.length > 1 ? "mobile-couple" : "mobile-couple single";
    unit.people.forEach(id => couple.appendChild(mobilePersonCard(id)));
    block.appendChild(couple);

    if (unit.children && unit.children.length) {
      const descendants = document.createElement("div");
      descendants.className = "mobile-descendants";

      unit.children.forEach(child => {
        descendants.appendChild(renderMobileUnit(child, depth + 1));
      });

      block.appendChild(descendants);
    }

    return block;
  }

  function renderMobileTree() {
    mobileTreeRoot.innerHTML = "";
    const root = document.createElement("div");
    root.className = "mobile-family-root";
    root.appendChild(renderMobileUnit(DATA[currentTree].root, 0));
    mobileTreeRoot.appendChild(root);
  }

  function renderTree() {
    treeRoot.innerHTML = "";
    treeRoot.appendChild(renderUnit(DATA[currentTree].root));
    renderMobileTree();

    requestAnimationFrame(() => {
      sizeTreeContainer();
      requestAnimationFrame(drawLines);
    });
  }

  function drawLines() {
    if (window.matchMedia("(max-width: 900px)").matches) {
      linesSvg.innerHTML = "";
      return;
    }

    linesSvg.innerHTML = "";
    const wrapRect = treeWrap.getBoundingClientRect();
    const units = treeRoot.querySelectorAll(".family-unit");

    units.forEach(unit => {
      const directChildrenRow = Array.from(unit.children).find(el => el.classList.contains("children-row"));
      const peopleRow = Array.from(unit.children).find(el => el.classList.contains("people-row"));
      if (!peopleRow) return;

      // Traditional horizontal spouse/partner connector.
      const peopleCards = Array.from(peopleRow.children).filter(el => el.classList.contains("person-card"));
      if (peopleCards.length === 2) {
        const a = peopleCards[0].getBoundingClientRect();
        const b = peopleCards[1].getBoundingClientRect();
        const y = ((a.top + a.height / 2) + (b.top + b.height / 2)) / 2 - wrapRect.top;
        const x1 = a.right - wrapRect.left;
        const x2 = b.left - wrapRect.left;
        addPath(`M ${x1} ${y} L ${x2} ${y}`);
      }

      if (!directChildrenRow) return;

      const children = Array.from(directChildrenRow.children).filter(el => el.classList.contains("child-unit"));
      if (!children.length) return;

      const pRect = peopleRow.getBoundingClientRect();
      const parentX = pRect.left + pRect.width / 2 - wrapRect.left;
      const parentY = pRect.bottom - wrapRect.top;

      const childPoints = children.map(child => {
        const childPeople = child.querySelector(":scope > .family-unit > .people-row");
        const cRect = childPeople.getBoundingClientRect();
        return {
          x: cRect.left + cRect.width / 2 - wrapRect.left,
          y: cRect.top - wrapRect.top
        };
      });

      const minChildY = Math.min(...childPoints.map(p => p.y));
      const junctionY = parentY + Math.max(22, (minChildY - parentY) * 0.48);
      const minX = Math.min(...childPoints.map(p => p.x));
      const maxX = Math.max(...childPoints.map(p => p.x));

      addPath(`M ${parentX} ${parentY} L ${parentX} ${junctionY}`);
      if (childPoints.length > 1) {
        addPath(`M ${minX} ${junctionY} L ${maxX} ${junctionY}`);
      }
      childPoints.forEach(point => addPath(`M ${point.x} ${junctionY} L ${point.x} ${point.y}`));
    });
  }

  function addPath(d) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", d);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "#3f4652");
    path.setAttribute("stroke-width", "2");
    path.setAttribute("vector-effect", "non-scaling-stroke");
    linesSvg.appendChild(path);
  }

  function openPerson(personId) {
    const p = DATA.people[personId];
    const dates = getDates(p);
    personDetails.innerHTML = `
      <div class="person-modal-head">
        <div class="modal-photo">${p.photo ? `<img src="${escapeHtml(p.photo)}" alt="">` : (p.sex === "f" ? "👩" : "👨")}</div>
        <div>
          <h2>${escapeHtml(p.name)}</h2>
          <p>${escapeHtml(t(p.relation))}</p>
        </div>
      </div>

      <div class="info-grid">
        ${p.birth ? `<div class="info-box"><strong>${escapeHtml(t("born"))}</strong>${escapeHtml(p.birth)}</div>` : ""}
        ${p.death ? `<div class="info-box"><strong>${escapeHtml(t("died"))}</strong>${escapeHtml(p.death)}</div>` : ""}
        ${p.deceased && !p.death ? `<div class="info-box"><strong>${escapeHtml(t("died"))}</strong>${escapeHtml(t("deceased"))}</div>` : ""}
        ${p.alt ? `<div class="info-box"><strong>${escapeHtml(t("other_name"))}</strong>${escapeHtml(localize(p.alt))}</div>` : ""}
      </div>

      ${p.highlights && p.highlights.length ? `
        <div class="research-section">
          <div class="research-title">${escapeHtml(t("family_history"))}</div>
          <ul class="research-list">
            ${p.highlights.map(h => `<li>${escapeHtml(localize(h))}</li>`).join("")}
          </ul>
        </div>` : ""}

      ${p.sources && p.sources.length ? `
        <div class="research-section">
          <div class="research-title">${escapeHtml(t("research_sources"))}</div>
          <div class="source-links">
            ${p.sources.map(s => `<a href="${escapeHtml(s.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(s.label)}</a>`).join("")}
          </div>
        </div>` : ""}

      <div class="action-title">${escapeHtml(t("what_do"))}</div>
      <div class="action-grid">
        <button class="action-button" data-action="correct">✏️ ${escapeHtml(t("correct"))}</button>
        <button class="action-button" data-action="child">➕ ${escapeHtml(t("child"))}</button>
        <button class="action-button" data-action="spouse">💍 ${escapeHtml(t("spouse"))}</button>
        <button class="action-button" data-action="sibling">👥 ${escapeHtml(t("sibling"))}</button>
        <button class="action-button" data-action="parent">⬆️ ${escapeHtml(t("parent"))}</button>
        <button class="action-button" data-action="photo">📷 ${escapeHtml(t("photo"))}</button>
      </div>
    `;

    personDetails.querySelectorAll("[data-action]").forEach(btn => {
      btn.addEventListener("click", () => {
        closePerson();
        openForm(btn.dataset.action, personId);
      });
    });

    personModal.classList.remove("hidden");
  }

  function closePerson() {
    personModal.classList.add("hidden");
  }

  function actionLabel(action) {
    const map = {
      correct: t("correct"),
      child: t("child"),
      spouse: t("spouse"),
      sibling: t("sibling"),
      parent: t("parent"),
      photo: t("photo"),
      new: t("new_person")
    };
    return map[action] || action;
  }

  function relationshipPrefill(action, personName) {
    if (action === "child") return `Child of ${personName}`;
    if (action === "spouse") return `Spouse / partner of ${personName}`;
    if (action === "sibling") return `Sibling of ${personName}`;
    if (action === "parent") return `Parent of ${personName}`;
    return "";
  }

  function openForm(action = "new", personId = null) {
    familyForm.reset();
    const person = personId ? DATA.people[personId] : null;
    const about = person ? person.name : t("new_person");

    familyForm.elements.action.value = actionLabel(action);
    familyForm.elements.about.value = about;

    if (action === "correct" && person) {
      familyForm.elements.name.value = person.name;
      familyForm.elements.relationship.value = t(person.relation);
      familyForm.elements.birth.value = person.birth || "";
      familyForm.elements.death.value = person.death || "";
      familyForm.elements.notes.value = person.alt ? localize(person.alt) : "";
    } else if (person) {
      familyForm.elements.relationship.value = relationshipPrefill(action, person.name);
    }

    if (action === "photo" && person) {
      familyForm.elements.name.value = person.name;
      familyForm.elements.notes.value = `Photo/document for ${person.name}`;
    }

    message.textContent = "";
    formModal.classList.remove("hidden");
  }

  function closeForm() {
    formModal.classList.add("hidden");
  }

  document.querySelectorAll(".lang").forEach(btn => {
    btn.addEventListener("click", () => {
      lang = btn.dataset.lang;
      try { localStorage.setItem("familyLanguage", lang); } catch {}
      applyLanguage();
    });
  });

  document.querySelectorAll(".family-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      currentTree = btn.dataset.tree;
      document.querySelectorAll(".family-tab").forEach(b => b.classList.toggle("active", b === btn));
      updateTreeHeading();
      renderTree();
    });
  });

  document.getElementById("addMissing").addEventListener("click", () => openForm("new"));

  document.querySelectorAll("[data-person-close]").forEach(el => el.addEventListener("click", closePerson));
  document.querySelectorAll("[data-form-close]").forEach(el => el.addEventListener("click", closeForm));

  window.addEventListener("resize", () => {
    requestAnimationFrame(() => {
      sizeTreeContainer();
      requestAnimationFrame(drawLines);
    });
  });

  familyForm.addEventListener("submit", event => {
    event.preventDefault();

    if (!EMAIL) {
      message.textContent = t("missing_email");
      return;
    }

    const fd = new FormData(familyForm);
    const lines = [
      "BALKOV / ZERZIL FAMILY TREE SUBMISSION",
      "",
      `Type of update: ${fd.get("action") || ""}`,
      `About: ${fd.get("about") || ""}`,
      `Name to add/correct: ${fd.get("name") || ""}`,
      `Relationship: ${fd.get("relationship") || ""}`,
      `Birth date/year: ${fd.get("birth") || ""}`,
      `Death date/year: ${fd.get("death") || ""}`,
      `Location: ${fd.get("location") || ""}`,
      `Notes: ${fd.get("notes") || ""}`,
      `Photo/document: ${fd.get("photo") || ""}`,
      `Submitted by: ${fd.get("submitter") || ""}`,
      "",
      "If you are sending a photograph or document, please attach the actual file to this email before sending."
    ];

    const subjectPerson = fd.get("name") || fd.get("about") || "Family update";
    window.location.href =
      `mailto:${encodeURIComponent(EMAIL)}?subject=${encodeURIComponent("Family tree: " + subjectPerson)}&body=${encodeURIComponent(lines.join("\n"))}`;

    message.textContent = t("ready");
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closePerson();
      closeForm();
    }
  });

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
  }

  applyLanguage();
})();
