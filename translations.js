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
        desc: 'Понимаю задачу, потребности пользователей<br class="br-desktop"> и цели бизнеса',
      },
      p2: {
        title: 'UX',
        desc: 'Превращаю сложные сценарии в понятный<br class="br-desktop"> и удобный пользовательский опыт',
      },
      p3: {
        title: 'Виз<span class="italic-glyph">уа</span>л',
        desc: 'Создаю интерфейсы с выразительным<br class="br-desktop"> и цельным визуальным языком',
      },
      p4: {
        title: 'AI и креат<span class="italic-glyph">и</span>в',
        desc: 'Использую AI, чтобы расширять возможности<br class="br-desktop"> дизайна и ускорять творческий процесс',
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
      heading: 'Сделаем чт<span class="italic-glyph">о</span>-то<br class="br-mobile"> стоящее?',
      desc: 'От первой идеи до проработанного интерфейса —<br class="br-desktop"> проектирую цифровые продукты с ясной<br class="br-desktop"> логикой, понятной целью и вниманием к деталям.',
    },
    articleLanding: {
      metaTitle: 'Что делает лендинг эффективным — Daria Nekrasova',
      time: '11 МИНУТ',
      date: '1 СЕНТЯБРЯ, 2026',
      title: 'Что делает<br class="br-mobile"> л<span class="italic-glyph">е</span>ндинг<br>эффект<span class="italic-glyph">и</span>вным',
      intro: 'Сильный оффер, заметная кнопка, отзывы, короткая<br class="br-desktop"> форма. Этот чек-лист знают все — и всё равно по нему<br class="br-desktop"> легко собрать аккуратный экран, который не работает.',
      toc: {
        s1: 'Всё начинается до первого экрана',
        s2: 'Первый экран должен быстро дать оффер',
        s3: 'Иерархия важнее количества информации',
        s4: 'Роль текста',
        s5: 'Как создаётся доверие',
        s6: 'Куда вы ведёте пользователя',
        s7: 'Что меняется вместе с экраном',
        s8: 'Скорость — часть пользовательского опыта',
        s9: 'Красивый ≠ эффективный',
        s10: 'После запуска смотрим на данные',
        sources: 'Источники'
      },
      s1: {
        title: 'Всё начинается до первого экрана',
        p1: 'Пользователь почти никогда не видит лендинг в вакууме. До него уже была реклама, письмо, пост, рекомендация или поисковый запрос. Всё это формирует ожидание.',
        p2: 'Если в объявлении человек увидел «бесплатный пробный урок», а на первом экране ему предлагают просто «открыть новые возможности вместе с нами», странице приходится заново объяснять, куда он попал и есть ли здесь то, что ему обещали. Даже красивый дизайн не компенсирует этот разрыв.',
        p3: 'Google прямо включает соответствие страницы объявлению и ключевым словам в рекомендации по оптимизации лендингов: пользователь должен сразу найти то, чего ожидал после клика. Похожую закономерность показывает и отчёт Unbounce, основанный на 41 тысяче лендингов, 464 миллионах посещений и 57 миллионах конверсий: источник трафика заметно связан с конверсией, а сообщение на странице должно продолжать сообщение в рекламе.',
        p4: 'То есть работа над лендингом начинается не с композиции и даже не с текста. Сначала нужно понять:',
        li1: 'откуда придёт человек;',
        li2: 'что он уже знает о продукте;',
        li3: 'что ему пообещали до перехода;',
        li4: 'какое одно действие мы хотим получить от него на этом этапе.',
        p5: 'Один и тот же продукт может требовать разных лендингов для тёплой аудитории из рассылки и для человека, который впервые увидел рекламу. У них разный контекст, разный уровень доверия и разные вопросы. Универсальная страница в таком случае часто оказывается одинаково неточной для всех.'
      },
      s2: {
        title: 'Первый экран должен быстро дать оффер',
        p1: 'Первый экран не должен рассказывать о продукте всё. Его задача проще: за первые секунды человек должен понять, куда он попал, что ему предлагают и есть ли здесь то, что он искал.',
        p2: 'При этом первый экран совсем не обязан выглядеть как стандартная связка из заголовка, подзаголовка и кнопки. Он может быть эмоциональным, необычным или почти полностью построенным на визуале. Но даже в таком случае должно быть понятно, что именно здесь предлагают и что можно сделать дальше.',
        p3: 'Это особенно важно потому, что первое впечатление возникает очень быстро. В исследовании Гитте Линдгаард и её коллег участники оценивали визуальную привлекательность сайтов уже через 50 миллисекунд. Это не значит, что за такое время человек успевает разобраться в продукте или решить, будет ли его покупать. Но визуал действительно начинает влиять на восприятие страницы ещё до того, как пользователь успевает прочитать текст.',
        p4: 'При этом одного визуала недостаточно. Пользователь должен понимать, что его ждёт дальше. В Nielsen Norman Group это описывается через понятие information scent — сигналы, по которым человек оценивает, насколько вероятно найти на странице нужную информацию. Если на первом экране есть только крупная картинка и абстрактный слоган, но непонятно, что именно предлагает компания, у пользователя может не быть причины продолжать просмотр.',
        p5: 'Поэтому хороший первый экран не обязательно должен быть максимально информативным. Он должен дать достаточно информации, чтобы человек понял предложение и захотел узнать больше. Визуал может привлечь внимание, текст — объяснить суть, а CTA — показать следующий шаг.'
      },
      s3: {
        title: 'Иерархия важнее количества информации',
        p1: 'Пользователь не обязан внимательно изучать каждый блок в том порядке, в котором дизайнер расположил их в макете. Сначала он сканирует страницу: цепляется за заголовки, цифры, изображения, кнопки и знакомые паттерны, а уже потом решает, что читать подробнее.',
        p2: 'В классическом исследовании Nielsen Norman Group 79% участников сканировали новые веб-страницы, а не читали их слово за слово. Более поздние исследования команды показывают, что сканирование по-прежнему характерно и для десктопа, и для мобильных устройств, хотя оно далеко не всегда складывается в известный F-паттерн.',
        p3: 'Из этого следует не то, что нужно уместить весь смысл в трёх строках. Скорее, смысл должен сохраняться на разных уровнях чтения. Если человек посмотрит только на заголовки и ключевые визуальные акценты, он всё равно должен понять основную логику предложения. Если захочет разобраться глубже — найти детали там, где ожидает их увидеть.',
        p4: 'Хорошая иерархия отвечает на вопросы последовательно:',
        li1: 'Что это и для кого?',
        li2: 'Какую задачу решает?',
        li3: 'Почему этому можно верить?',
        li4: 'Как это работает или что входит в предложение?',
        li5: 'Что нужно сделать дальше?',
        p5: 'Эти вопросы не обязательно превращать в пять одинаковых блоков. Но если все смыслы спорят за внимание одновременно, пользователю приходится самостоятельно собирать предложение из фрагментов. И чем больше усилий требует страница, тем проще её закрыть.'
      },
      s4: {
        title: 'Роль текста',
        p1: 'Лендинг не становится убедительнее от слов «уникальный», «инновационный» и «лучший». Такие формулировки ничего не доказывают и заставляют человека переводить маркетинговый язык обратно в факты.',
        p2: 'В исследовании Nielsen Norman Group объективный текст показал на 27% более высокое удобство использования, чем версия с преувеличенной рекламной подачей. Краткий текст улучшил показатель на 58%, сканируемая структура — на 47%, а сочетание краткости, структуры и нейтрального языка — на 124%. Это старое и небольшое UX-исследование, поэтому его цифры нельзя механически переносить на любой коммерческий лендинг. Но сам принцип хорошо совпадает с тем, что мы видим сегодня: конкретику человеку обрабатывать проще, чем абстрактные обещания.',
        p3: 'Данные Unbounce дают похожий сигнал уже на большой выборке реальных лендингов. В их отчёте количество сложных слов отрицательно коррелировало с конверсией на 24,3%, время чтения — на 19,4%, объём текста — на 18,6%. Важно: это корреляция, а не доказательство того, что любое сокращение текста автоматически повысит продажи. Более того, сами авторы отмечают, что закономерность отличается в разных отраслях.',
        p4: 'Поэтому задача не в том, чтобы сделать текст максимально коротким. Задача — убрать всё, что не помогает понять ценность, снизить риск или принять решение.',
        p5: 'Вместо «комплексной инновационной платформы для эффективного управления» лучше объяснить, что именно человек сможет сделать, для кого предназначен продукт и какой результат он получит. Понятный текст не упрощает сам продукт — он упрощает путь к его пониманию.'
      },
      s5: {
        title: 'Как создаётся доверие',
        p1: 'Отзывы, рейтинги, кейсы и логотипы клиентов могут усиливать предложение. Но они работают только тогда, когда отвечают на реальное сомнение пользователя и выглядят проверяемыми.',
        p2: 'Фраза «нам доверяют тысячи клиентов» без имён, цифр и контекста почти ничего не добавляет. А короткий кейс с исходной задачей, результатом и понятным источником уже помогает оценить продукт. Для одного бизнеса главным доказательством будет демонстрация интерфейса, для другого — лицензия, условия возврата, состав команды или живые фотографии.',
        p3: 'Рекомендации Stanford Web Credibility Project основаны на трёх годах исследований с участием более 4 500 человек. Среди факторов доверия там названы возможность проверить информацию, наличие реальной организации и людей за сайтом, понятные контакты, профессиональный и уместный визуальный образ, удобство, актуальность контента и отсутствие ошибок.',
        p4: 'То есть доверие — не один блок ближе к футеру. Это общее ощущение непротиворечивости страницы. Текст не обещает невозможного, визуал соответствует продукту, доказательства можно проверить, форма не просит лишнего, а условия не прячутся мелким шрифтом.'
      },
      s6: {
        title: 'Куда вы ведёте пользователя',
        p1: 'Часто правило «один лендинг — одна кнопка» понимают слишком буквально. На длинной странице кнопок может быть несколько. Важно не количество повторений, а то, ведут ли они к одной логичной цели или растаскивают внимание в разные стороны.',
        p2: 'Если рядом одинаково активно предлагают купить, подписаться, скачать презентацию, написать менеджеру и перейти в каталог, пользователю приходится сначала решить, чего хочет от него сама страница.',
        p3: 'Хороший CTA объясняет следующий шаг. «Получить расчёт» обычно информативнее, чем «Отправить», а «Попробовать бесплатно» — яснее, чем «Узнать больше», если после клика действительно начинается пробный период. Кнопка должна не просто выделяться цветом, а продолжать обещание страницы.',
        p4: 'То же относится к форме. Короткая форма не всегда лучше длинной: дорогая B2B-услуга и регистрация на бесплатный вебинар требуют разного объёма информации. Но каждое поле должно быть оправдано ценностью следующего шага. Чем раньше бизнес просит телефон, должность, бюджет и название компании, тем яснее должен быть ответ на вопрос: что человек получит взамен?'
      },
      s7: {
        title: 'Что меняется вместе с экраном',
        p1: 'По данным Conversion Benchmark Report 2024, 83% проанализированных посещений лендингов пришлись на мобильные устройства. При этом десктоп конвертировал в среднем на 8% лучше. Эти цифры нельзя считать универсальным бенчмарком для любого проекта, но они хорошо показывают масштаб проблемы: основная часть аудитории часто получает менее удобную версию страницы.',
        p2: 'На мобильном меняется не только размер экрана. Меняется контекст использования, видимая область, точность нажатия, скорость соединения и терпимость к длинным формам. Поэтому адаптация — это не просто перестроить сетку и уменьшить заголовок.',
        p3: 'Нужно заново проверить:',
        li1: 'понятен ли оффер без контекста, который остался за пределами экрана;',
        li2: 'виден ли следующий шаг;',
        li3: 'легко ли нажать на элементы;',
        li4: 'удобно ли заполнить форму;',
        li5: 'не ломают ли ритм слишком тяжёлые изображения и анимация;',
        li6: 'сохраняется ли приоритет смыслов.',
        p4: 'Иногда ради этого приходится сокращать второстепенный текст, менять порядок блоков или выбирать другой визуал. Это не компромиссная версия дизайна, а отдельный сценарий в рамках той же задачи.'
      },
      s8: {
        title: 'Скорость — часть пользовательского опыта',
        p1: 'Можно идеально выстроить иерархию, но пользователь её не увидит, если первый экран загружается слишком долго или прыгает при появлении контента.',
        p2: 'Показательный пример — <a href="#source-8" class="article-source-link">A/B-тест Vodafone</a>. Компания сравнила две визуально и функционально одинаковые версии лендинга; отличие было в оптимизации Web Vitals. Улучшение показателя LCP на 31% сопровождалось ростом продаж на 8%, ростом отношения лидов к посещениям на 15% и переходов в корзину — на 11%.',
        p3: 'Это кейс одной компании, а не универсальная формула «минус секунда — плюс N процентов». Но он хорошо показывает, почему производительность нельзя оставлять на последний этап разработки. Вес изображений, видео на первом экране, шрифты, анимация и логика загрузки — это в том числе дизайн-решения.'
      },
      s9: {
        title: 'Красивый ≠ эффективный',
        p1: 'Визуальный дизайн влияет на первое впечатление и доверие. Но эффектный приём работает на задачу только тогда, когда помогает заметить главное, почувствовать характер продукта или лучше понять предложение.',
        p2: 'Если анимация задерживает доступ к содержанию, метафора требует расшифровки, а нестандартная навигация превращает простое действие в квест, визуальное решение начинает конкурировать с целью страницы.',
        p3: 'Это не аргумент в пользу одинаковых минималистичных лендингов. Наоборот: в среде, где базовые UX-паттерны стали нормой, выразительный визуальный язык помогает бренду выделиться и создать эмоциональную связь. Но различимость не должна покупаться ценой понимания. Сильный дизайн не украшает логику страницы — он делает её яснее и убедительнее.',
      },
      s10: {
        title: 'После запуска смотрим на данные',
        p1: 'До запуска можно проверить почти всё, что касается самого лендинга: понятен ли оффер, логично ли выстроена структура, совпадает ли страница с рекламой, удобно ли ей пользоваться с телефона, быстро ли загружается первый экран. Но после запуска появляется то, чего не даст ни один макет или прототип, — реальные данные.',
        p2: 'И смотреть только на конверсию здесь недостаточно. Допустим, после сокращения формы заявок стало на 20% больше. На первый взгляд результат хороший. Но если вместе с ними выросло количество нецелевых обращений, для бизнеса это может вообще ничего не изменить. Поэтому важно заранее понимать, какое действие действительно имеет ценность. Иногда это заявка, иногда покупка, активация, квалифицированный лид или выручка.',
        p3: 'По той же причине не стоит искать универсальные решения. Красная кнопка не обязательно будет работать лучше зелёной. Короткий лендинг не обязательно окажется эффективнее длинного, а видео на первом экране не обязательно даст больше продаж. Всё это может быть хорошей гипотезой — но только проверка на конкретной аудитории покажет, так ли это в данном случае.',
        p4: 'В результате хороший лендинг — это не набор обязательных блоков вроде «оффер → преимущества → отзывы → форма». Важно другое: человек должен быстро понять, что ему предлагают, разобраться, зачем ему это нужно, получить ответы на основные сомнения и понять, что делать дальше.',
        p5: 'Если какой-то блок не помогает пройти этот путь, его необязательно оставлять только потому, что так принято. Иногда лучше убрать текст, переставить блоки, изменить форму или вообще отказаться от привычного решения.',
        p6: 'Поэтому эффективный лендинг выглядит по-разному в зависимости от продукта, аудитории и задачи. Универсального набора «продающих» элементов нет. Есть конкретная страница, конкретные пользователи и результат, который можно проверить после запуска.'
      },
      sources: {
        title: 'Источники'
      }
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
      title: 'Designing digital<br>products <span class="italic-text">with</span><br class="br-mobile"> purpose.',
      desc: 'Combining UX, visual design, and business<br class="br-desktop"> thinking to create digital products<br class="br-desktop"> that are both beautiful and effective',
      btn: 'Explore my work',
    },
    projects: {
      tag: '[ WORKS ]',
      clientLabel: 'CLIENT',
      p1: {
        title: 'Strat<span class="italic-glyph">e</span>gy',
        desc: 'Understanding the problem, users<br class="br-desktop"> and business goals',
      },
      p2: {
        title: 'UX',
        desc: 'Turning complexity into clear,<br class="br-desktop"> intuitive experiences',
      },
      p3: {
        title: 'V<span class="italic-glyph">is</span>ual des<span class="italic-glyph">ig</span>n',
        desc: 'Creating interfaces with<br class="br-desktop"> a strong visual language',
      },
      p4: {
        title: 'AI <span class="italic-glyph">&amp;</span> cr<span class="italic-glyph">eat</span>ive',
        desc: 'Using AI to expand creative possibilities<br class="br-desktop"> and accelerate design',
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
      heading: 'Let’s m<span class="italic-glyph">ak</span>e s<span class="italic-glyph">o</span>mething<br class="br-mobile"> work',
      desc: 'From first idea to polished interface —<br class="br-desktop"> I design digital products with clarity,<br class="br-desktop"> purpose, and attention to detail',
    },
    articleLanding: {
      metaTitle: 'What makes a landing page effective — Daria Nekrasova',
      time: '11 MIN READ',
      date: 'SEPTEMBER 1, 2026',
      title: 'Wh<span class="italic-glyph">at</span> makes<br class="br-mobile"> a landing<br>page effective',
      intro: 'A strong offer, a prominent button, testimonials, a short<br class="br-desktop"> form. Everyone knows this checklist — yet it can still<br class="br-desktop"> produce a polished page that simply doesn’t work.',
      toc: {
        s1: 'It starts before the first screen',
        s2: 'Make the offer clear at first glance',
        s3: 'Hierarchy matters more than volume',
        s4: 'The role of copy',
        s5: 'How trust is built',
        s6: 'Where you lead the user',
        s7: 'What changes with the screen',
        s8: 'Speed is part of the experience',
        s9: 'Beautiful ≠ effective',
        s10: 'After launch, look at the data',
        sources: 'Sources'
      },
      s1: {
        title: 'It starts before the first screen',
        p1: 'Users almost never encounter a landing page in isolation. Before it, there was an ad, an email, a post, a recommendation, or a search query. All of these shape expectations.',
        p2: 'If an ad offers a “free trial lesson” but the first screen merely invites someone to “discover new possibilities with us,” the page has to explain all over again where they are and whether the promised offer is actually here. Even beautiful design cannot bridge that gap.',
        p3: 'Google explicitly includes alignment with ads and keywords in its landing page optimization guidance: users should immediately find what they expected after clicking. A similar pattern appears in the Unbounce report, based on 41,000 landing pages, 464 million visits, and 57 million conversions: traffic source is closely associated with conversion, and the message on the page should carry the ad’s message forward.',
        p4: 'So work on a landing page begins neither with composition nor even with copy. First, you need to understand:',
        li1: 'where the visitor will come from;',
        li2: 'what they already know about the product;',
        li3: 'what they were promised before clicking;',
        li4: 'the one action we want them to take at this stage.',
        p5: 'The same product may need different landing pages for a warm audience from an email list and for someone seeing an ad for the first time. Their context, level of trust, and questions are different. In that situation, a universal page often ends up being equally off-target for everyone.'
      },
      s2: {
        title: 'Make the offer clear at first glance',
        p1: 'The first screen does not need to tell people everything about the product. Its job is simpler: within the first few seconds, visitors should understand where they are, what is being offered, and whether it is what they were looking for.',
        p2: 'That does not mean the first screen must follow the familiar headline, subheading, and button formula. It can be emotional, unconventional, or built almost entirely around visuals. Even then, it should be clear what is on offer and what to do next.',
        p3: 'This matters because first impressions form very quickly. In a study by Gitte Lindgaard and her colleagues, participants judged websites’ visual appeal after just 50 milliseconds. That does not mean someone can understand a product or decide to buy it in that time. But visuals do influence how a page is perceived before the user has a chance to read the copy.',
        p4: 'Visuals alone, however, are not enough. Users need to understand what lies ahead. Nielsen Norman Group describes this through information scent — the cues people use to judge how likely they are to find the information they need. If the first screen contains only a large image and an abstract slogan, with no clear explanation of what the company offers, users may have no reason to keep exploring.',
        p5: 'A good first screen, then, does not have to be as informative as possible. It needs to give people enough information to understand the offer and want to learn more. Visuals can attract attention, copy can explain the essentials, and a CTA can show the next step.'
      },
      s3: {
        title: 'Hierarchy matters more than volume',
        p1: 'Users are not obliged to carefully study every section in the order the designer arranged them. First, they scan the page: headlines, numbers, images, buttons, and familiar patterns catch their eye. Only then do they decide what to read more closely.',
        p2: 'In a classic Nielsen Norman Group study, 79% of participants scanned new web pages rather than reading them word for word. The team’s later research shows that scanning remains common on both desktop and mobile, although it does not always follow the familiar F-shaped pattern.',
        p3: 'This does not mean the whole message must fit into three lines. Rather, the meaning should survive at different levels of reading. Someone who looks only at headlines and key visual highlights should still understand the offer’s basic logic. Someone who wants to go deeper should find details where they expect them.',
        p4: 'A good hierarchy answers questions in sequence:',
        li1: 'What is it, and who is it for?',
        li2: 'What problem does it solve?',
        li3: 'Why should I trust it?',
        li4: 'How does it work, or what does the offer include?',
        li5: 'What should I do next?',
        p5: 'These questions do not have to become five identical sections. But when every message competes for attention at once, users have to piece the offer together themselves. And the more effort a page demands, the easier it is to close it.'
      },
      s4: {
        title: 'The role of copy',
        p1: 'Words like “unique,” “innovative,” and “best” do not make a landing page more convincing. They prove nothing and force people to translate marketing language back into facts.',
        p2: 'In a Nielsen Norman Group study, objective copy delivered 27% higher usability than an exaggerated promotional version. Concise copy improved the measure by 58%, a scannable structure by 47%, and the combination of brevity, structure, and neutral language by 124%. This was an old, small-scale UX study, so its figures cannot simply be applied to every commercial landing page. But the principle fits what we see today: concrete information is easier to process than abstract promises.',
        p3: 'Unbounce’s data points in a similar direction, this time across a large sample of real landing pages. In its report, the number of complex words correlated negatively with conversion by 24.3%, reading time by 19.4%, and copy length by 18.6%. Importantly, this is correlation, not proof that cutting any text will automatically increase sales. The authors also note that the pattern varies by industry.',
        p4: 'The goal, then, is not to make the copy as short as possible. It is to remove anything that does not help people understand the value, reduce risk, or make a decision.',
        p5: 'Instead of describing a “comprehensive, innovative platform for efficient management,” explain what people can actually do, who the product is for, and what outcome they will get. Clear copy does not simplify the product itself — it simplifies the path to understanding it.'
      },
      s5: {
        title: 'How trust is built',
        p1: 'Testimonials, ratings, case studies, and client logos can strengthen an offer. But they work only when they address a real user concern and look verifiable.',
        p2: '“Thousands of customers trust us” adds little without names, numbers, and context. A short case study with an initial challenge, a result, and a clear source helps people assess the product. For one business, the strongest evidence may be an interface demo; for another, a license, return policy, team profile, or real photographs.',
        p3: 'The Stanford Web Credibility Project’s guidelines are based on three years of research involving more than 4,500 people. Its trust factors include verifiable information, a real organization and people behind the website, clear contact details, a professional and appropriate visual identity, ease of use, up-to-date content, and an absence of errors.',
        p4: 'Trust, then, is not a single section near the footer. It is an overall sense that the page holds together. The copy does not promise the impossible, the visuals fit the product, the evidence can be checked, the form does not ask for more than it needs, and the terms are not hidden in fine print.'
      },
      s6: {
        title: 'Where you lead the user',
        p1: 'The rule “one landing page, one button” is often taken too literally. A long page can have several buttons. What matters is not how often they appear, but whether they lead to one logical goal or pull attention in different directions.',
        p2: 'If buying, subscribing, downloading a presentation, contacting a manager, and browsing a catalog are all promoted with equal emphasis, users first have to work out what the page actually wants them to do.',
        p3: 'A good CTA explains the next step. “Get a quote” is usually more informative than “Submit,” and “Try it free” is clearer than “Learn more” if clicking really does start a trial. The button should not merely stand out through color — it should carry the page’s promise forward.',
        p4: 'The same applies to forms. A short form is not always better than a long one: an expensive B2B service and registration for a free webinar require different amounts of information. But every field should be justified by the value of the next step. The earlier a business asks for a phone number, job title, budget, and company name, the clearer the answer must be to one question: what will the person get in return?'
      },
      s7: {
        title: 'What changes with the screen',
        p1: 'According to the Conversion Benchmark Report 2024, 83% of the landing page visits analyzed came from mobile devices. Yet desktop converted 8% better on average. These figures are not a universal benchmark for every project, but they show the scale of the problem: much of the audience often gets the less convenient version of the page.',
        p2: 'On mobile, more than screen size changes. The context of use, visible area, tap precision, connection speed, and tolerance for long forms change too. Responsive adaptation is therefore more than rearranging the grid and shrinking the headline.',
        p3: 'You need to check again:',
        li1: 'is the offer clear without the context that is now off-screen;',
        li2: 'is the next step visible;',
        li3: 'are elements easy to tap;',
        li4: 'is the form easy to complete;',
        li5: 'do heavy images and animation disrupt the rhythm;',
        li6: 'are the priorities of the message preserved?',
        p4: 'Sometimes this means trimming secondary copy, changing the order of sections, or choosing different visuals. This is not a compromised version of the design, but a distinct scenario within the same task.'
      },
      s8: {
        title: 'Speed is part of the experience',
        p1: 'You can build a perfect hierarchy, but users will never see it if the first screen takes too long to load or shifts around as content appears.',
        p2: 'A useful example is the <a href="#source-8" class="article-source-link">Vodafone A/B test</a>. The company compared two visually and functionally identical landing pages; the difference was Web Vitals optimization. A 31% improvement in LCP was accompanied by an 8% increase in sales, a 15% increase in the lead-to-visit ratio, and an 11% increase in visits to the cart.',
        p3: 'This is one company’s case study, not a universal formula of “one second less, N percent more.” But it clearly shows why performance cannot be left to the final stage of development. Image weight, video on the first screen, fonts, animation, and loading logic are design decisions too.'
      },
      s9: {
        title: 'Beautiful ≠ effective',
        p1: 'Visual design affects first impressions and trust. But a striking technique serves the task only when it helps people notice what matters, feel the product’s character, or better understand the offer.',
        p2: 'If animation delays access to content, a metaphor needs decoding, or unconventional navigation turns a simple action into a quest, the visual solution starts competing with the page’s goal.',
        p3: 'This is not an argument for identical minimalist landing pages. Quite the opposite: in a landscape where basic UX patterns have become standard, an expressive visual language helps a brand stand out and build an emotional connection. But distinctiveness should not come at the expense of understanding. Strong design does not decorate the page’s logic — it makes that logic clearer and more convincing.',
      },
      s10: {
        title: 'After launch, look at the data',
        p1: 'Before launch, you can check almost everything about the landing page itself: whether the offer is clear, the structure is logical, the page matches the ad, it is easy to use on a phone, and the first screen loads quickly. After launch, however, you gain something no mockup or prototype can provide — real data.',
        p2: 'Looking only at conversion is not enough. Suppose shortening the form produces 20% more inquiries. At first glance, that looks like a good result. But if unqualified inquiries also increase, it may change nothing for the business. That is why it is important to define in advance which action truly has value. Sometimes it is an inquiry; sometimes a purchase, activation, qualified lead, or revenue.',
        p3: 'For the same reason, do not look for universal solutions. A red button will not necessarily outperform a green one. A short landing page will not necessarily be more effective than a long one, and video on the first screen will not necessarily generate more sales. Any of these can be a good hypothesis — but only testing with a specific audience will show whether it holds true in that case.',
        p4: 'Ultimately, a good landing page is not a collection of mandatory sections such as “offer → benefits → testimonials → form.” What matters is that people quickly understand what is being offered, see why they need it, find answers to their main concerns, and know what to do next.',
        p5: 'If a section does not help them along that path, there is no need to keep it just because convention says so. Sometimes it is better to remove copy, rearrange sections, change the form, or abandon a familiar solution altogether.',
        p6: 'An effective landing page therefore looks different depending on the product, audience, and task. There is no universal set of “high-converting” elements. There is a specific page, specific users, and a result you can measure after launch.'
      },
      sources: {
        title: 'Sources'
      }
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
    const pageTitleKey = document.body ? document.body.getAttribute('data-page-title') : null;
    if (pageTitleKey) {
      const pageTitle = getNestedValue(data, pageTitleKey);
      if (pageTitle) document.title = pageTitle;
    } else {
      document.title = data.metaTitle;
    }

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
