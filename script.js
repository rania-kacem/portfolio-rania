
document.addEventListener("DOMContentLoaded", () => {
  // Année automatique dans le pied de page
  const yearElement = document.getElementById("current-year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Menu de navigation mobile
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  function closeMenu() {
    if (!menuToggle || !navLinks) return;

    navLinks.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Ouvrir le menu");
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("is-open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Fermer le menu" : "Ouvrir le menu"
      );
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }

  // Filtrage des projets
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      filterButtons.forEach((item) => {
        item.classList.remove("active");
      });

      button.classList.add("active");

      projectCards.forEach((card) => {
        const categories = (card.dataset.category || "").split(" ");
        const shouldShow =
          filter === "all" || categories.includes(filter);

        card.classList.toggle("is-hidden", !shouldShow);
      });
    });
  });

  // Contenu des fenêtres de détails des projets
  const projectDetails = {
    ai: {
      category: "IA GÉNÉRATIVE · DATA",
      title: "Automatisation de la description de jeux de données par IA générative",
      description:
        "Ce projet explore l’automatisation de la description de jeux de données. " +
        "L’objectif est de produire des descriptions et des métadonnées à partir " +
        "des données disponibles, en s’appuyant sur Python et un modèle de langage (LLM).",
      tags: ["Python", "LLM", "CSV", "API"]
    },

    fraud: {
      category: "ANALYSE DE DONNÉES",
      title: "Détection de fraudes sur tickets de caisse",
      description:
        "Ce projet porte sur l’analyse de tickets de caisse afin d’étudier les données " +
        "et de rechercher des comportements ou des transactions atypiques.",
      tags: ["Python", "Analyse de données", "Anomalies"]
    },

    booktok: {
      category: "SOCIAL DATA",
      title: "Outils d’analyse de BookTok sur TikTok",
      description:
        "Ce projet explore les contenus liés à BookTok pour analyser les thèmes, " +
        "les tendances littéraires et les informations présentes dans les publications.",
      tags: ["Python", "Analyse de contenu", "Data"]
    },

    nlp: {
      category: "NLP · TEXT MINING",
      title: "Thèmes et extraction d’information",
      description:
        "Ce projet mobilise des méthodes de traitement automatique du langage pour " +
        "étudier des textes, identifier des thèmes à l’aide de la modélisation LDA " +
        "et extraire des mots-clés ou des informations pertinentes.",
      tags: ["LDA", "Gensim", "NLTK", "NLP"]
    },

    search: {
      category: "DÉVELOPPEMENT",
      title: "Moteur de recherche plein texte",
      description:
        "Ce projet étudie l’indexation de documents et la recherche plein texte, " +
        "avec une comparaison de solutions telles qu’Apache Solr et Elasticsearch.",
      tags: ["Apache Solr", "Elasticsearch", "Indexation"]
    }
  };

  // Ouverture et fermeture de la fenêtre de détails
  const modal = document.getElementById("project-modal");
  const modalCategory = document.getElementById("modal-category");
  const modalTitle = document.getElementById("modal-title");
  const modalDescription = document.getElementById("modal-description");
  const modalTags = document.getElementById("modal-tags");
  const modalCloseButtons = document.querySelectorAll("[data-close-modal]");

  let previousFocus = null;

  function openModal(projectId, trigger) {
    const project = projectDetails[projectId];

    if (
      !project ||
      !modal ||
      !modalCategory ||
      !modalTitle ||
      !modalDescription ||
      !modalTags
    ) {
      return;
    }

    previousFocus = trigger;

    modalCategory.textContent = project.category;
    modalTitle.textContent = project.title;
    modalDescription.textContent = project.description;

    // Création sécurisée des étiquettes
    modalTags.replaceChildren();

    project.tags.forEach((tag) => {
      const element = document.createElement("span");
      element.textContent = tag;
      modalTags.appendChild(element);
    });

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    const closeButton = modal.querySelector(".modal-close");

    if (closeButton) closeButton.focus();
  }

  function closeModal() {
    if (!modal) return;

    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    if (previousFocus) previousFocus.focus();
  }

  document.querySelectorAll(".project-open").forEach((button) => {
    button.addEventListener("click", () => {
      openModal(button.dataset.project, button);
    });
  });

  modalCloseButtons.forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal?.classList.contains("is-open")) {
      closeModal();
    }
  });

  // Animation progressive des éléments
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -30px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  // Mise en évidence de la section visible dans le menu
  const sections = document.querySelectorAll("main section[id]");
  const menuLinks = document.querySelectorAll(".nav-links a[href^='#']");

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const currentId = entry.target.id;

          menuLinks.forEach((link) => {
            const isActive = link.getAttribute("href") === `#${currentId}`;

            link.classList.toggle("active", isActive);

            if (isActive) {
              link.setAttribute("aria-current", "location");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      {
        rootMargin: "-30% 0px -60% 0px",
        threshold: 0
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }
});
