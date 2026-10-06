/**
 * Daria Nekrasova Portfolio — Internationalization (i18n)
 * Supports dynamic runtime switching between RU and EN with persistence in localStorage.
 */

const PORTFOLIO_I18N = {
  ru: {
    htmlLang: 'ru',
    metaTitle: 'Daria Nekrasova — Портфолио',
    langSwitcherText: 'EN',
    langSwitcherAria: 'Переключить на английский язык',
    mobileMenu: {
      work: 'Проекты',
      about: 'Обо мне',
      notes: 'Заметки',
      contacts: 'Контакты',
    },
    hero: {
      title: 'Созда<span class="italic-glyph">ю</span><br class="br-mobile"> цифров<span class="italic-glyph">ы</span>е<br>продукт<span class="italic-glyph">ы</span> со<br class="br-mobile"> см<span class="italic-glyph">ы</span>слом.',
      desc: 'Сочетаю UX, визуальный дизайн<br>и бизнес-мышление, создавая<br>продукты, которые работают.',
      btn: 'Смотреть проекты',
    },
    projects: {
      tag: '[ ПРОЕКТЫ ]',
      clientLabel: 'КЛИЕНТ',
      p1: {
        title: 'Страт<span class="italic-glyph">е</span>ги<span class="italic-glyph">я</span>',
        desc: 'Понимаю задачу, потребности пользователей и цели бизнеса',
      },
      p2: {
        title: 'U<span class="italic-glyph">X</span>',
        desc: 'Превращаю сложные сценарии в понятный и удобный пользовательский опыт',
      },
      p3: {
        title: 'Виз<span class="italic-glyph">уа</span>л',
        desc: 'Создаю интерфейсы с выразительным и цельным визуальным языком',
      },
      p4: {
        title: 'AI и креат<span class="italic-glyph">и</span>в',
        desc: 'Использую AI, чтобы расширять возможности дизайна и ускорять творческий процесс',
      }
    },
    about: {
      title: 'Чем я занимаюсь',
      manifesto: 'Мне интересна точка пересечения функции и выразительности: понять, что нужно бизнесу и людям, найти правильное продуктовое решение и придать ему характерный визуальный образ. Работаю на стыке UX, продуктового и веб-дизайна, визуального направления и креативных экспериментов.',
    },
    services: {
      s1: {
        title: 'Продукт и UX',
        items: [
          'ПРОДУКТОВОЕ ИССЛЕДОВАНИЕ',
          'ПРОДУКТОВОЕ ИССЛЕДОВАНИЕ',
          'ВАЙРФРЕЙМЫ',
          'ИНТЕРАКТИВНЫЕ ПРОТОТИПЫ',
          'UX-АНАЛИЗ'
        ]
      },
      s2: {
        title: 'Диза<span class="italic-glyph">й</span>н интерфейсов',
        items: [
          'ПРОДУКТ',
          'ВЕБ',
          'АДАПТИВНЫЙ ДИЗАЙН',
          'ИНТЕРАКТИВНЫЕ СЦЕНАРИИ'
        ]
      },
      s3: {
        title: 'Визу<span class="italic-glyph">а</span>льное направление',
        items: [
          'АРТ-ДИРЕКШН',
          'ВИЗУАЛЬНЫЕ КОНЦЕПЦИИ',
          'ГРАФИЧЕСКИЙ ДИЗАЙН',
          'AI ДИЗАЙН'
        ]
      }
    },
    notes: {
      heading: 'Заметки о дизайне',
      n1: {
        title: 'Что делает лендинг эффективным',
        date: '1 СЕНТЯБРЯ, 2026',
      },
      n2: {
        title: 'Красивый интерфейс может быть плохим',
        date: '13 АВГУСТА, 2026',
      },
      n3: {
        title: 'Когда визуальный дизайн становится частью UX',
        date: '24 АВГУСТА, 2026',
      }
    },
    footer: {
      heading: 'Сд<span class="italic-glyph">е</span>лаем что-то<br class="br-mobile"> стоящее?',
      desc: 'От первой идеи до проработанного<br class="br-mobile"> интерфейса —<br class="br-desktop"> проектирую цифровые<br class="br-mobile"> продукты с ясной<br class="br-desktop"> логикой, понятной<br class="br-mobile"> целью и вниманием к деталям.',
    }
  },
  en: {
    htmlLang: 'en',
    metaTitle: 'Daria Nekrasova — Portfolio',
    langSwitcherText: 'RU',
    langSwitcherAria: 'Switch to Russian',
    mobileMenu: {
      work: 'Work',
      about: 'About',
      notes: 'Notes',
      contacts: 'Contacts',
    },
    hero: {
      title: 'Des<span class="italic-glyph">ign</span>ing d<span class="italic-glyph">ig</span>ital<br>products w<span class="italic-glyph">it</span>h<br class="br-mobile"> purpose.',
      desc: 'Combining UX, visual design, and business<br class="br-desktop"> thinking to create digital products<br class="br-desktop"> that are both beautiful and effective',
      btn: 'Explore my work',
    },
    projects: {
      tag: '[ WORKS ]',
      clientLabel: 'CLIENT',
      p1: {
        title: 'Strat<span class="italic-glyph">e</span>gy',
        desc: 'Understanding the problem, users and business goals',
      },
      p2: {
        title: 'UX',
        desc: 'Turning complexity into clear, intuitive experiences',
      },
      p3: {
        title: 'V<span class="italic-glyph">is</span>ual design',
        desc: 'Creating interfaces with a strong visual language',
      },
      p4: {
        title: 'AI &amp; cr<span class="italic-glyph">eat</span>ive',
        desc: 'Using AI to expand creative possibilities and accelerate design',
      }
    },
    about: {
      title: 'What I do',
      manifesto: 'I\'m interested in the space between function and expression — understanding what people need, finding the right product solution, and giving it a distinct visual character. My work spans UX, product design, web, visual direction, and creative experimentation.',
    },
    services: {
      s1: {
        title: 'Product & UX',
        items: [
          'PRODUCT DISCOVERY',
          'USER FLOWS',
          'WIREFRAMING',
          'PROTOTYPING',
          'UX ANALYSIS'
        ]
      },
      s2: {
        title: 'Interface Design',
        items: [
          'PRODUCT',
          'WEB',
          'RESPONSIVE',
          'INTERACTION'
        ]
      },
      s3: {
        title: 'Visual Direction',
        items: [
          'ART DIRECTION',
          'VISUAL CONCEPTS',
          'GRAPHIC DESIGN',
          'AI-ASSISTED DESIGN'
        ]
      }
    },
    notes: {
      heading: 'Design Notes',
      n1: {
        title: 'What makes a landing page actually work',
        date: 'SEPTEMBER 1, 2026',
      },
      n2: {
        title: 'Beautiful interface can still be a bad interface',
        date: 'AUGUST 13, 2026',
      },
      n3: {
        title: 'When visual design becomes part of UX',
        date: 'AUGUST 24, 2026',
      }
    },
    footer: {
      heading: 'Let’s <span class="italic-glyph">make</span><br class="br-mobile"> <span class="italic-glyph">so</span>mething work',
      desc: 'From first idea to polished interface —<br class="br-mobile"> I design digital products with<br class="br-desktop"> clarity,<br class="br-mobile"> purpose, and attention to detail',
    }
  }
};

(function initI18n() {
  const STORAGE_KEY = 'portfolio_language';

  function getSavedLanguage() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlLang = urlParams.get('lang');
      if (urlLang && (urlLang === 'ru' || urlLang === 'en')) return urlLang;

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && (saved === 'ru' || saved === 'en')) return saved;
    } catch (e) {
      // localStorage disabled or not available
    }
    return 'ru';
  }

  function getNestedValue(obj, path) {
    return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : null), obj);
  }

  function applyLanguage(lang) {
    const data = PORTFOLIO_I18N[lang];
    if (!data) return;

    // 1. Update <html> attribute & document title
    document.documentElement.lang = data.htmlLang;
    document.title = data.metaTitle;

    // 2. Update simple text elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = getNestedValue(data, key);
      if (val !== null && val !== undefined) {
        el.textContent = val;
      }
    });

    // 3. Update HTML elements (with italic spans & line breaks)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      const val = getNestedValue(data, key);
      if (val !== null && val !== undefined) {
        el.innerHTML = val;
      }
    });

    // 4. Update language switcher button text & aria-label
    document.querySelectorAll('.lang-switcher').forEach(btn => {
      btn.setAttribute('aria-label', data.langSwitcherAria);
      const textSpans = btn.querySelectorAll('.nav-link-text, .lang-text');
      textSpans.forEach(span => {
        span.textContent = data.langSwitcherText;
      });
    });

    // 5. Update running marquee ticker texts in Services section
    if (typeof window.rebuildServicesMarquee === 'function') {
      window.rebuildServicesMarquee();
    }

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      // localStorage disabled
    }
  }

  // Language toggle click handler
  function toggleLanguage() {
    const current = document.documentElement.lang === 'en' ? 'en' : 'ru';
    const next = current === 'ru' ? 'en' : 'ru';
    applyLanguage(next);
  }

  window.setLanguage = applyLanguage;
  window.toggleLanguage = toggleLanguage;

  function init() {
    const initialLang = getSavedLanguage();
    applyLanguage(initialLang);

    // Attach click listeners to all language switcher buttons
    document.querySelectorAll('.lang-switcher').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        toggleLanguage();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
