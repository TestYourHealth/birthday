const storageKey = "birthdayTributeConfig";

const defaultConfig = {
  name: "Dr. Anup Rastogi",
  title: "A celebration of legacy, warmth & excellence",
  message:
    "Your leadership is a beacon of inspiration for everyone around you. May this new chapter be filled with health, happiness, purpose, and countless meaningful moments.",
  image: "assets/doctor-hero.svg",
};

const nameEl = document.getElementById("birthdayName");
const titleEl = document.getElementById("birthdayTitle");
const heroImageEl = document.getElementById("heroPhoto");
const modal = document.getElementById("uploaderBackdrop");
const form = document.getElementById("tributeForm");
const secretToggle = document.getElementById("secretToggle");
const closeButton = document.getElementById("closeUploader");
const cancelButton = document.getElementById("cancelUploader");

function getStoredConfig() {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? { ...defaultConfig, ...JSON.parse(raw) } : { ...defaultConfig };
  } catch (error) {
    console.warn("Saved birthday config could not be parsed.", error);
    return { ...defaultConfig };
  }
}

function saveConfig(config) {
  localStorage.setItem(storageKey, JSON.stringify(config));
}

function applyConfig(config) {
  const safeName = config.name || defaultConfig.name;
  const safeTitle = config.title || defaultConfig.title;
  const safeMessage = config.message || defaultConfig.message;
  const safeImage = config.image || defaultConfig.image;

  if (nameEl) {
    nameEl.innerHTML = `Happy Birthday<br /><span>${safeName}</span>`;
  }

  if (titleEl) {
    titleEl.textContent = safeTitle;
  }

  const messageEl = document.getElementById("birthdayMessage");
  if (messageEl) {
    messageEl.textContent = safeMessage;
  }

  if (heroImageEl) {
    heroImageEl.src = safeImage;
    heroImageEl.alt = `${safeName} birthday tribute`;
  }

  document.title = `Happy Birthday | ${safeName}`;
}

function openEditor() {
  const config = getStoredConfig();
  document.getElementById("fieldName").value = config.name || "";
  document.getElementById("fieldTitle").value = config.title || "";
  document.getElementById("fieldMessage").value = config.message || "";
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
}

function closeEditor() {
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
  form.reset();
}

if (secretToggle) {
  secretToggle.addEventListener("click", openEditor);
}

if (closeButton) {
  closeButton.addEventListener("click", closeEditor);
}

if (cancelButton) {
  cancelButton.addEventListener("click", closeEditor);
}

if (modal) {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeEditor();
  });
}

document.addEventListener("keydown", (event) => {
  if (event.altKey && event.shiftKey && event.key.toLowerCase() === "u") {
    openEditor();
  }

  if (event.key === "Escape" && modal && !modal.classList.contains("hidden")) {
    closeEditor();
  }
});

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const existing = getStoredConfig();
    const fileInput = document.getElementById("photoUpload");
    const selectedFile = fileInput && fileInput.files && fileInput.files[0];

    const updatedConfig = {
      name: document.getElementById("fieldName").value.trim() || existing.name,
      title: document.getElementById("fieldTitle").value.trim() || existing.title,
      message: document.getElementById("fieldMessage").value.trim() || existing.message,
      image: existing.image,
    };

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = function (loadEvent) {
        updatedConfig.image = loadEvent.target.result;
        saveConfig(updatedConfig);
        applyConfig(updatedConfig);
        closeEditor();
      };
      reader.readAsDataURL(selectedFile);
      return;
    }

    saveConfig(updatedConfig);
    applyConfig(updatedConfig);
    closeEditor();
  });
}

applyConfig(getStoredConfig());
