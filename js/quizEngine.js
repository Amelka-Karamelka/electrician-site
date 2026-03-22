const QUIZ_MODE_KEY = 'quizMode';
const QUESTIONS_PER_EXAM = 5;

const notification = document.getElementById('notification');
const modeLabel = document.getElementById('mode-label');
const progress = document.getElementById('quiz-progress');
const quizContent = document.getElementById('quiz-content');
const quizControls = document.getElementById('quiz-controls');

const pageConfig = document.body.dataset;
const stageKey = pageConfig.stageKey || '';
const resultsPage = pageConfig.resultsPage || '';
const stageLabel = pageConfig.stageLabel || 'этапа';

const mode = localStorage.getItem(QUIZ_MODE_KEY) === 'learn' ? 'learn' : 'exam';
const stageQuestions = window.questionBank && window.questionBank[stageKey] ? window.questionBank[stageKey] : [];
const pageTitle = document.querySelector('.questions-container h1');

const stage1Lessons = [
    {
        title: 'Урок 1. Ток, напряжение и сопротивление',
        theory: [
            'Сила тока (I) измеряется в амперах (A).',
            'Напряжение (U) измеряется в вольтах (V).',
            'Сопротивление (R) измеряется в омах (Ω).',
            'Ток растет при росте напряжения и падает при увеличении сопротивления.'
        ],
        lessonImages: ['images/этап1/stage1_lesson1_current_voltage_resistance.png'],
        activityType: 'pair',
        activityTitle: 'Соотнесите величину и единицу',
        leftCards: [
            { label: 'Сила тока (I)', image: 'images/этап1/stage1_lesson1_unit_01_i.png' },
            { label: 'Напряжение (U)', image: 'images/этап1/stage1_lesson1_unit_02_u.png' },
            { label: 'Сопротивление (R)', image: 'images/этап1/stage1_lesson1_unit_03_r.png' }
        ],
        rightCards: [
            { label: 'Вольт (V)', image: 'images/этап1/stage1_lesson1_unit_05_v.png' },
            { label: 'Ом (Ω)', image: 'images/этап1/stage1_lesson1_unit_06_ohm.png' },
            { label: 'Ампер (A)', image: 'images/этап1/stage1_lesson1_unit_04_a.png' }
        ],
        activityCorrectIndexes: [2, 0, 1],
        hint: 'Вспомните базовое соответствие: I-A, U-V, R-Ω.',
        successText: 'Верно. Базовые обозначения усвоены.'
    },
    {
        title: 'Урок 2. Закон Ома',
        theory: [
            'Основная формула: I = U / R.',
            'Производные формы: U = I * R и R = U / I.',
            'Сначала определите, какую величину нужно найти.',
            'Проверьте единицы измерения перед ответом.'
        ],
        lessonImages: [
            'images/этап1/stage1_lesson2_ohms_law_triangle.png',
            'images/этап1/stage1_lesson2_formula_hint.png'
        ],
        activityType: 'number',
        activityTitle: 'Мини-задача',
        activityQuestion: 'U = 12 В, R = 6 Ом. Введите ток I (в амперах).',
        activityAccepted: ['2', '2.0'],
        hint: 'Используйте формулу I = U / R.',
        successText: 'Верно: I = 12 / 6 = 2 А.'
    },
    {
        title: 'Урок 3. Измерительные приборы',
        theory: [
            'Амперметр измеряет ток и включается последовательно.',
            'Вольтметр измеряет напряжение и включается параллельно.',
            'Омметр измеряет сопротивление на обесточенной цепи.'
        ],
        lessonImages: ['images/этап1/stage1_lesson3_meter_connection_series_parallel.png'],
        activityType: 'match',
        activityTitle: 'Соотнесите прибор и назначение',
        activityRows: ['Амперметр', 'Вольтметр', 'Омметр'],
        activityOptions: ['Измеряет сопротивление', 'Измеряет ток', 'Измеряет напряжение'],
        activityCorrectIndexes: [1, 2, 0],
        activityImages: [],
        hint: 'Смотрите на название прибора: ампер-вольт-ом.',
        successText: 'Отлично. Соответствия по приборам верные.'
    },
    {
        title: 'Урок 4. Проводники и диэлектрики',
        theory: [
            'Проводники хорошо проводят ток: медь, алюминий.',
            'Диэлектрики почти не проводят ток: резина, стекло, пластик.',
            'В кабеле проводник переносит ток, а изоляция защищает.'
        ],
        lessonImages: ['images/этап1/stage1_lesson4_conductors_vs_insulators.png'],
        activityType: 'drag_classify',
        activityTitle: 'Распределите карточки по двум полям',
        activityOptions: ['Медь', 'Алюминий', 'Резина', 'Стекло', 'Пластик'],
        activityZones: ['Проводники', 'Диэлектрики'],
        activityCorrectZones: ['conductors', 'conductors', 'dielectrics', 'dielectrics', 'dielectrics'],
        activityImages: [
            'images/этап1/stage1_lesson4_material_01_copper.png',
            'images/этап1/stage1_lesson4_material_02_aluminum.png',
            'images/этап1/stage1_lesson4_material_03_rubber.png',
            'images/этап1/stage1_lesson4_material_04_glass.png',
            'images/этап1/stage1_lesson4_material_05_plastic.png'
        ],
        hint: 'Металлы обычно проводят ток лучше неметаллических материалов.',
        successText: 'Верно. Вы выбрали правильные проводники.'
    },
    {
        title: 'Урок 5. Электробезопасность',
        theory: [
            'Перед работой сначала отключают питание.',
            'Затем проверяют отсутствие напряжения.',
            'Работают только исправным инструментом и в СИЗ.',
            'После работ важно сообщить ответственному и зафиксировать результат.'
        ],
        lessonImages: [
            'images/этап1/stage1_lesson5_safety_steps.png',
            'images/этап1/stage1_lesson5_warning_sign_electric.png'
        ],
        lessonImagesLayout: 'vertical',
        lessonHeroImageIndex: 0,
        activityType: 'order_drag',
        activityTitle: 'Соберите правильный порядок шагов',
        activitySteps: ['Отключить питание', 'Проверить напряжение', 'Работать безопасно', 'Сообщить ответственному'],
        activityImages: [
            'images/этап1/stage1_lesson5_step_01_power_off.png',
            'images/этап1/stage1_lesson5_step_02_check_voltage.png',
            'images/этап1/stage1_lesson5_step_03_safe_work.png',
            'images/этап1/stage1_lesson5_step_04_report_supervisor.png'
        ],
        hint: 'Порядок начинается с отключения и проверки, а не наоборот.',
        successText: 'Отлично. Последовательность безопасных действий верная.'
    }
];

const stage2Lessons = [
    {
        title: 'Урок 1. Измерение тока: амперметр и клещи',
        theory: [
            'Ток измеряют приборами, через которые он проходит или которые фиксируют его магнитное поле.',
            'Амперметр включают строго последовательно - в разрыв цепи.',
            'Если включить амперметр параллельно, это приведет к короткому замыканию.',
            'Токоизмерительные клещи позволяют измерять ток без разрыва цепи.'
        ],
        lessonImages: [
            'images/этап2/stage2_lesson1_ammeter_and_clamp_connection.png'
        ],
        activityType: 'image_label_drag',
        activityTitle: 'Выберите правильный способ измерения тока',
        activityOptions: [
            'Последовательно в разрыв цепи',
            'Параллельно участку',
            'Без разрыва цепи'
        ],
        activityCorrectIndexes: [0, 2, 1],
        activityImages: [
            'images/этап2/stage2_lesson1_tool_01_ammeter.png',
            'images/этап2/stage2_lesson1_tool_03_clamp_meter.png',
            'images/этап2/stage2_lesson1_tool_02_voltmeter.png'
        ],
        hint: 'Ток должен проходить через прибор.',
        successText: 'Верно. Способы измерения тока определены правильно.'
    },
    {
        title: 'Урок 2. Измерение напряжения: вольтметр',
        theory: [
            'Напряжение - это разность потенциалов между двумя точками.',
            'Вольтметр подключают параллельно участку цепи.',
            'Последовательное подключение вольтметра приведет к неправильным показаниям.',
            'Измерение выполняют между двумя точками, а не "внутри" цепи.'
        ],
        lessonImages: [
            'images/этап2/stage2_lesson2_voltmeter_parallel_connection.png'
        ],
        activityType: 'single',
        activityTitle: 'Как правильно подключить вольтметр?',
        activityOptions: [
            'Параллельно участку',
            'Последовательно в разрыв цепи',
            'К заземлению',
            'Через корпус щита'
        ],
        activityCorrectIndex: 0,
        hint: 'Измеряется разность потенциалов между двумя точками.',
        successText: 'Верно. Вольтметр подключают параллельно.'
    },
    {
        title: 'Урок 3. Подготовка мультиметра',
        theory: [
            'Ошибки настройки прибора - частая причина неверных измерений.',
            'Перед работой проверяют режим: напряжение, ток или сопротивление.',
            'Устанавливают предел измерения, начиная с большего значения.',
            'Обязательно проверяют целостность щупов и изоляции.'
        ],
        lessonImages: [
            'images/этап2/stage2_lesson3_multimeter_setup.png'
        ],
        activityType: 'multi',
        activityTitle: 'Что нужно проверить перед измерением?',
        activityOptions: [
            'Режим измерения',
            'Предел измерения',
            'Целостность щупов',
            'Цвет корпуса'
        ],
        activityCorrectIndexes: [0, 1, 2],
        hint: 'Сначала проверка безопасности и настроек.',
        successText: 'Верно. Подготовка выполнена правильно.'
    },
    {
        title: 'Урок 4. Расчеты: мощность',
        theory: [
            'Мощность показывает, какую нагрузку создает устройство.',
            'Формула: P = U * I.',
            'Результат измеряется в ваттах.',
            'Расчет помогает понять, не перегружена ли цепь.'
        ],
        lessonImages: [
            'images/этап2/stage2_lesson4_power_formula.png'
        ],
        activityType: 'number',
        activityTitle: 'Рассчитайте мощность',
        activityQuestion: 'U = 220 В, I = 5 А. Введите мощность в ваттах.',
        activityAccepted: ['1100', '1100.0'],
        hint: 'Умножьте напряжение на ток.',
        successText: 'Верно: 220 * 5 = 1100 Вт.'
    },
    {
        title: 'Урок 5. Расчеты: закон Ома',
        theory: [
            'Закон Ома связывает напряжение, ток и сопротивление.',
            'Формула: R = U / I.',
            'Используется для расчета сопротивления участка цепи.',
            'Позволяет проверить корректность работы оборудования.'
        ],
        lessonImages: [
            'images/этап2/stage2_lesson5_calculation_hint.png'
        ],
        activityType: 'number',
        activityTitle: 'Рассчитайте сопротивление',
        activityQuestion: 'U = 24 В, I = 2 А. Введите сопротивление.',
        activityAccepted: ['12', '12.0'],
        hint: 'Разделите напряжение на ток.',
        successText: 'Верно: 24 / 2 = 12 Ом.'
    },
    {
        title: 'Урок 6. Неисправности и их причины',
        theory: [
            'Разные симптомы указывают на разные типы проблем.',
            'Мерцание света обычно связано с нестабильным контактом.',
            'Нагрев клемм - признак плохого контакта и повышенного сопротивления.',
            'Срабатывание автомата связано с перегрузкой или коротким замыканием.'
        ],
        lessonImages: [
            'images/этап2/stage2_lesson6_fault_diagnosis_flow.png'
        ],
        activityType: 'match',
        activityTitle: 'Соотнесите неисправность и причину',
        activityRows: [
            'Мерцание освещения',
            'Нагрев клеммы',
            'Срабатывание автомата'
        ],
        activityOptions: [
            'Перегрузка или КЗ',
            'Плохой контакт',
            'Нестабильный контакт'
        ],
        activityCorrectIndexes: [2, 1, 0],
        hint: 'Нагрев почти всегда из-за плохого контакта.',
        successText: 'Верно. Причины определены правильно.'
    },
    {
        title: 'Урок 7. Защитные устройства и приборы контроля',
        theory: [
            'Защитные устройства предотвращают повреждение оборудования и аварии.',
            'Автоматический выключатель отключает цепь при перегрузке и коротком замыкании.',
            'УЗО реагирует на ток утечки и защищает человека.',
            'Предохранитель разрывает цепь за счет расплавления вставки.',
            'Индикатор напряжения показывает наличие напряжения.',
            'Мегомметр измеряет сопротивление изоляции.'
        ],
        lessonImages: [
            'images/этап2/stage2_lesson7_protection_devices_compare.png'
        ],
        activityType: 'image_label_drag',
        activityTitle: 'Перетащите подписи к изображениям приборов',
        activityOptions: [
            'Проверка наличия напряжения',
            'Измерение сопротивления изоляции',
            'Защита от перегрузки и КЗ'
        ],
        activityCorrectIndexes: [0, 1, 2],
        activityImages: [
            'images/этап2/stage2_lesson7_device_01_voltage_indicator.png',
            'images/этап2/stage2_lesson7_device_02_megohmmeter.png',
            'images/этап2/stage2_lesson7_device_03_circuit_breaker.png'
        ],
        hint: 'Индикатор - напряжение, мегомметр - изоляция.',
        successText: 'Верно. Назначение определено правильно.'
    }
];

const stage3Lessons = [
    {
        title: 'Урок 1. Безопасное начало работ: отключение и блокировка',
        theory: [
            'Перед ремонтом электрооборудования на производстве в первую очередь исключают подачу энергии на рабочее место.',
            'Для этого оборудование отключают, выполняют блокировку источника энергии и проверяют отсутствие напряжения.',
            'Снятие крышек, разборка и любые ремонтные действия допустимы только после безопасного отключения.',
            'Такой порядок предотвращает случайный пуск оборудования и поражение электрическим током.'
        ],
        lessonImages: [
            'images/этап3/stage3_lesson1_loto_procedure.png'
        ],
        activityType: 'order_drag',
        activityTitle: 'Выстройте правильный порядок начала ремонтных работ',
        activitySteps: [
            'Отключить питание оборудования',
            'Выполнить блокировку источника энергии',
            'Проверить отсутствие напряжения',
            'Только после этого приступать к ремонту'
        ],
        activityImages: [
            'images/этап3/stage3_lesson1_step_01_power_off.png',
            'images/этап3/stage3_lesson1_step_02_lockout.png',
            'images/этап3/stage3_lesson1_step_03_test_no_voltage.png',
            'images/этап3/stage3_lesson1_step_04_start_repair.png'
        ],
        hint: 'На производстве сначала исключают подачу энергии, а потом начинают ремонт.',
        successText: 'Верно. Безопасный порядок начала работ соблюден.'
    },
    {
        title: 'Урок 2. Защитное заземление и средства индивидуальной защиты',
        theory: [
            'Защитное заземление - это преднамеренное электрическое соединение открытых проводящих частей с заземляющим устройством.',
            'Его задача - снизить риск поражения током при повреждении изоляции и появлении напряжения на корпусе.',
            'При работе электромонтер использует базовые СИЗ: диэлектрические перчатки, защитную каску и защитные очки.',
            'Открытая обувь, отсутствие защиты глаз и работа без необходимых СИЗ на производстве недопустимы.'
        ],
        lessonImages: [
            'images/этап3/stage3_lesson2_grounding_and_ppe.png'
        ],
        activityType: 'image_multi',
        activityTitle: 'Выберите СИЗ, которые обычно применяются электромонтером',
        activityOptions: [
            'Диэлектрические перчатки',
            'Защитная каска',
            'Защитные очки',
            'Открытая обувь'
        ],
        activityImages: [
            'images/этап3/stage3_lesson2_ppe_01_gloves.png',
            'images/этап3/stage3_lesson2_ppe_02_helmet.png',
            'images/этап3/stage3_lesson2_ppe_03_goggles.png',
            'images/этап3/stage3_lesson2_ppe_04_open_shoes.png'
        ],
        activityCorrectIndexes: [0, 1, 2],
        hint: 'Выбирайте только те средства, которые реально защищают при электромонтажных работах.',
        successText: 'Верно. Основные СИЗ выбраны правильно.'
    },
    {
        title: 'Урок 3. Первые действия при аварийных признаках',
        theory: [
            'На производстве при обнаружении опасного признака сначала исключают риск для людей и оборудования.',
            'Если на корпусе станка появилось напряжение, оборудование нужно отключить и оградить опасную зону.',
            'Если обнаружен нагрев клеммы, сначала отключают оборудование, а затем проверяют контактное соединение.',
            'Если появился запах горелой изоляции, оборудование немедленно выводят из работы и начинают диагностику.'
        ],
        lessonImages: [
            'images/этап3/stage3_lesson3_emergency_signs.png'
        ],
        activityType: 'match',
        activityTitle: 'Соотнесите ситуацию и первое правильное действие',
        activityRows: [
            'На корпусе станка появилось напряжение',
            'Обнаружен нагрев клеммы',
            'Появился запах горелой изоляции'
        ],
        activityOptions: [
            'Отключить и оградить зону',
            'Отключить и проверить контактное соединение',
            'Немедленно вывести из работы и начать диагностику'
        ],
        activityCorrectIndexes: [0, 1, 2],
        hint: 'Сначала всегда убирают аварийный риск, потом ищут причину.',
        successText: 'Верно. Первичные действия определены правильно.'
    },
    {
        title: 'Урок 4. Наряд-допуск и работы повышенной опасности',
        theory: [
            'На производстве часть работ относится к работам повышенной опасности и требует специального допуска.',
            'Для таких работ оформляют наряд-допуск с перечнем мер безопасности, составом бригады и ответственными лицами.',
            'Наряд-допуск не нужен для обычных офисных или бытовых действий, не связанных с опасными производственными рисками.',
            'Смысл наряда-допуска - заранее определить условия безопасного выполнения опасной работы.'
        ],
        lessonImages: [
            'images/этап3/stage3_lesson4_work_permit.png'
        ],
        activityType: 'single',
        activityTitle: 'Для каких работ обычно требуется наряд-допуск?',
        activityOptions: [
            'Для работ повышенной опасности',
            'Для любой офисной задачи',
            'Для уборки помещения',
            'Для настройки принтера'
        ],
        activityCorrectIndex: 0,
        hint: 'Наряд-допуск связан с опасными работами и дополнительными мерами защиты.',
        successText: 'Верно. Наряд-допуск оформляют для работ повышенной опасности.'
    },
    {
        title: 'Урок 5. Защитные устройства в производственной цепи',
        theory: [
            'Защитные устройства работают по разным принципам, поэтому важно различать их назначение.',
            'УЗО отключает цепь при токе утечки.',
            'Автоматический выключатель защищает от перегрузки и короткого замыкания.',
            'Плавкий предохранитель разрывает цепь, когда его вставка расплавляется от аварийного тока.'
        ],
        lessonImages: [
            'images/этап3/stage3_lesson5_protection_devices_factory.png'
        ],
        activityType: 'image_label_drag',
        activityTitle: 'Перетащите подписи к изображениям устройств',
        activityOptions: [
            'Отключение при токе утечки',
            'Защита от перегрузки и КЗ',
            'Разрыв цепи расплавлением вставки'
        ],
        activityCorrectIndexes: [0, 1, 2],
        activityImages: [
            'images/этап3/stage3_lesson5_device_01_rcd.png',
            'images/этап3/stage3_lesson5_device_02_circuit_breaker.png',
            'images/этап3/stage3_lesson5_device_03_fuse.png'
        ],
        hint: 'Смотрите на причину срабатывания каждого устройства.',
        successText: 'Верно. Назначение защитных устройств определено правильно.'
    },
    {
        title: 'Урок 6. Контроль после ремонта',
        theory: [
            'После завершения ремонта работу нельзя считать законченной без контрольных действий.',
            'Обязательно выполняют функциональную проверку оборудования.',
            'Результаты ремонта и выполненные действия фиксируют в журнале работ или другой принятой документации.',
            'Перед вводом в эксплуатацию восстанавливают ограждения, крышки, защиты и другие элементы безопасной эксплуатации.'
        ],
        lessonImages: [
            'images/этап3/stage3_lesson6_post_repair_check.png'
        ],
        activityType: 'multi',
        activityTitle: 'Что входит в завершающий этап после ремонтных работ?',
        activityOptions: [
            'Функциональная проверка',
            'Запись в журнал работ',
            'Восстановление ограждений и защит',
            'Игнорирование замечаний оператора'
        ],
        activityCorrectIndexes: [0, 1, 2],
        hint: 'После ремонта нужно подтвердить исправность, безопасность и зафиксировать результат.',
        successText: 'Верно. Завершающий этап определен правильно.'
    },
    {
        title: 'Урок 7. Практические величины на производстве: ток утечки, мощность и аварийное освещение',
        theory: [
            'На производстве электромонтер должен быстро переводить и оценивать электрические величины.',
            'При переводе тока из ампер в миллиамперы используют соотношение: 1 А = 1000 мА.',
            'При переводе мощности из киловатт в ватты используют соотношение: 1 кВт = 1000 Вт.',
            'Светильники аварийного освещения должны быть визуально отличимы от обычных - обычно по маркировке или окраске.'
        ],
        lessonImages: [
            'images/этап3/stage3_lesson7_units_and_emergency_lighting.png'
        ],
        activityType: 'number',
        activityTitle: 'Выполните перевод величины',
        activityQuestion: 'Мощность двигателя 3 кВт. Введите значение в ваттах.',
        activityAccepted: ['3000', '3000.0'],
        hint: '1 кВт = 1000 Вт.',
        successText: 'Верно: 3 кВт = 3000 Вт.'
    }
];

let selectedQuestions = [];
let currentIndex = 0;
let learnCorrectCount = 0;
let learnLocked = false;
let lessonIndex = 0;
let lessonLocked = false;
let lessonPairState = null;
let lessonDragState = null;
let pairResizeHandler = null;
let activeLessons = [];
let activeLessonStage = '';

function getStageDisplayName(key) {
    if (key === 'stage1') return 'Школа';
    if (key === 'stage2') return 'Колледж';
    if (key === 'stage3') return 'Завод';
    return 'Этап';
}

function configureHeader() {
    const stageName = getStageDisplayName(stageKey);
    if (pageTitle) {
        pageTitle.textContent = stageName + ': ' + (mode === 'learn' ? 'обучение' : 'экзамен');
    }

    modeLabel.textContent = '';
    progress.textContent = '';
    modeLabel.style.display = 'none';
    progress.style.display = 'none';
}

function isStageUnlocked(key) {
    if (key === 'stage1') return true;
    if (key === 'stage2') return localStorage.getItem('stage1Completed') === 'true';
    if (key === 'stage3') return localStorage.getItem('stage2Completed') === 'true';
    return false;
}

function showNotification(message) {
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(function () {
        notification.classList.remove('show');
    }, 2500);
}

function shuffleArray(array) {
    const clone = array.slice();
    for (let i = clone.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = clone[i];
        clone[i] = clone[j];
        clone[j] = temp;
    }
    return clone;
}

function prepareQuestion(question) {
    if (question.type === 'single') {
        const options = question.options.map(function (text, index) {
            return {
                text: text,
                isCorrect: index === question.correctIndex
            };
        });
        return Object.assign({}, question, { options: shuffleArray(options) });
    }

    if (question.type === 'multi') {
        const options = question.options.map(function (text, index) {
            return {
                text: text,
                isCorrect: question.correctIndexes.indexOf(index) !== -1
            };
        });
        return Object.assign({}, question, { options: shuffleArray(options) });
    }

    if (question.type === 'match') {
        const rightOptions = question.rightOptions.map(function (text, rightId) {
            return { text: text, rightId: rightId };
        });
        return Object.assign({}, question, { rightOptions: shuffleArray(rightOptions) });
    }

    return Object.assign({}, question);
}

function getQuestionSet() {
    if (!stageQuestions.length) {
        return [];
    }

    const shuffled = shuffleArray(stageQuestions).map(prepareQuestion);
    if (mode === 'learn') {
        return shuffled;
    }

    return shuffled.slice(0, QUESTIONS_PER_EXAM);
}

function updateHeader() {
    modeLabel.textContent = mode === 'learn'
        ? 'Режим: с подсказками (обучение)'
        : 'Режим: без подсказок (проверка)';
}

function getTypeLabel(type) {
    if (type === 'single') return 'Один ответ';
    if (type === 'multi') return 'Несколько ответов';
    if (type === 'match') return 'Соответствие';
    if (type === 'number') return 'Числовой ответ';
    return 'Вопрос';
}

function renderQuestionBody(question, scope) {
    if (question.type === 'single') {
        return question.options.map(function (option, optionIndex) {
            return '<label class="quiz-option"><input type="radio" name="' + scope + '_single" value="' + optionIndex + '"> ' + option.text + '</label>';
        }).join('');
    }

    if (question.type === 'multi') {
        return question.options.map(function (option, optionIndex) {
            return '<label class="quiz-option"><input type="checkbox" name="' + scope + '_multi" value="' + optionIndex + '"> ' + option.text + '</label>';
        }).join('');
    }

    if (question.type === 'match') {
        const rows = question.leftItems.map(function (leftText, leftIndex) {
            const options = question.rightOptions.map(function (option) {
                return '<option value="' + option.rightId + '">' + option.text + '</option>';
            }).join('');

            return '<div class="match-row">'
                + '<div class="match-left">' + leftText + '</div>'
                + '<select name="' + scope + '_match_' + leftIndex + '" class="match-select">'
                + '<option value="">Выберите</option>'
                + options
                + '</select>'
                + '</div>';
        }).join('');

        return '<div class="match-grid">' + rows + '</div>';
    }

    if (question.type === 'number') {
        return '<input type="text" name="' + scope + '_number" class="number-input" placeholder="Введите число">';
    }

    return '';
}

function renderQuestionCard(question, index, scope, showTypeBadge) {
    const typeBadge = showTypeBadge ? ('<div class="quiz-type-badge">' + getTypeLabel(question.type) + '</div>') : '';
    return '<section class="quiz-card" data-question-id="' + question.id + '">'
        + typeBadge
        + '<h3>Вопрос ' + (index + 1) + '</h3>'
        + '<h4>' + question.question + '</h4>'
        + '<div class="question-body">' + renderQuestionBody(question, scope) + '</div>'
        + '</section>';
}

function readUserAnswer(question, scope) {
    if (question.type === 'single') {
        const selected = document.querySelector('input[name="' + scope + '_single"]:checked');
        return selected ? Number(selected.value) : null;
    }

    if (question.type === 'multi') {
        return Array.from(document.querySelectorAll('input[name="' + scope + '_multi"]:checked')).map(function (item) {
            return Number(item.value);
        });
    }

    if (question.type === 'match') {
        return question.leftItems.map(function (_, index) {
            const select = document.querySelector('select[name="' + scope + '_match_' + index + '"]');
            return select ? select.value : '';
        });
    }

    if (question.type === 'number') {
        const input = document.querySelector('input[name="' + scope + '_number"]');
        return input ? input.value.trim().replace(',', '.') : '';
    }

    return null;
}

function isAnswered(question, answer) {
    if (question.type === 'single') return answer !== null;
    if (question.type === 'multi') return Array.isArray(answer) && answer.length > 0;
    if (question.type === 'match') return Array.isArray(answer) && answer.every(function (value) { return value !== ''; });
    if (question.type === 'number') return answer !== '';
    return false;
}

function checkAnswer(question, answer) {
    if (question.type === 'single') {
        return question.options[answer] && question.options[answer].isCorrect === true;
    }

    if (question.type === 'multi') {
        const expected = question.options
            .map(function (option, index) { return { option: option, index: index }; })
            .filter(function (entry) { return entry.option.isCorrect; })
            .map(function (entry) { return entry.index; })
            .sort(function (a, b) { return a - b; });

        const actual = answer.slice().sort(function (a, b) { return a - b; });
        return JSON.stringify(expected) === JSON.stringify(actual);
    }

    if (question.type === 'match') {
        return answer.every(function (rightId, leftIndex) {
            return Number(rightId) === question.correctRightIndexes[leftIndex];
        });
    }

    if (question.type === 'number') {
        return question.acceptedAnswers.indexOf(answer) !== -1;
    }

    return false;
}

function buildResultsUrl(correct, total) {
    return resultsPage + '?correct=' + correct + '&total=' + total;
}

function renderExam() {
    quizContent.innerHTML = selectedQuestions.map(function (question, index) {
        return renderQuestionCard(question, index, 'exam_' + question.id, false);
    }).join('');

    quizControls.innerHTML = '<button type="button" id="exam-submit-btn">Проверить результат</button>';
    document.getElementById('exam-submit-btn').addEventListener('click', submitExam);
}

function submitExam() {
    let correctCount = 0;

    for (const question of selectedQuestions) {
        const scope = 'exam_' + question.id;
        const answer = readUserAnswer(question, scope);

        if (!isAnswered(question, answer)) {
            showNotification('Пожалуйста, ответьте на все вопросы.');
            return;
        }

        if (checkAnswer(question, answer)) {
            correctCount++;
        }
    }

    window.location.href = buildResultsUrl(correctCount, selectedQuestions.length);
}

function renderLearnQuestion() {
    const question = selectedQuestions[currentIndex];
    const scope = 'learn_current';

    quizContent.innerHTML = renderQuestionCard(question, currentIndex, scope, true)
        + '<div id="learn-feedback" class="learn-feedback" aria-live="polite"></div>';

    quizControls.innerHTML = ''
        + '<button type="button" id="check-btn">Проверить</button>'
        + '<button type="button" id="next-btn" style="display:none;">Далее</button>';

    learnLocked = false;

    document.getElementById('check-btn').addEventListener('click', function () {
        if (learnLocked) {
            return;
        }

        const answer = readUserAnswer(question, scope);
        if (!isAnswered(question, answer)) {
            showNotification('Ответьте на вопрос перед проверкой.');
            return;
        }

        const feedback = document.getElementById('learn-feedback');
        const isCorrect = checkAnswer(question, answer);

        if (isCorrect) {
            feedback.textContent = question.explainCorrect;
            feedback.className = 'learn-feedback is-correct';
            learnCorrectCount++;
            learnLocked = true;
            document.getElementById('check-btn').style.display = 'none';
            document.getElementById('next-btn').style.display = 'inline-block';
        } else {
            feedback.textContent = 'Неверно, попробуйте еще раз.';
            feedback.className = 'learn-feedback is-wrong';
        }
    });

    document.getElementById('next-btn').addEventListener('click', function () {
        currentIndex++;
        if (currentIndex >= selectedQuestions.length) {
            window.location.href = buildResultsUrl(learnCorrectCount, selectedQuestions.length);
            return;
        }
        renderLearnQuestion();
    });
}

function renderLessonActivity(lesson) {
    if (lesson.activityType === 'single') {
        return lesson.activityOptions.map(function (optionText, optionIndex) {
            return '<label class="quiz-option"><input type="radio" name="lesson_single" value="' + optionIndex + '"> ' + optionText + '</label>';
        }).join('');
    }

    if (lesson.activityType === 'pair') {
        const leftCards = lesson.leftCards.map(function (card, leftIndex) {
            return '<button type="button" class="pair-card" data-side="left" data-index="' + leftIndex + '">'
                + '<img src="' + card.image + '" alt="' + card.label + '" class="pair-card-image">'
                + '</button>';
        }).join('');

        const rightCards = lesson.rightCards.map(function (card, rightIndex) {
            return '<button type="button" class="pair-card" data-side="right" data-index="' + rightIndex + '">'
                + '<img src="' + card.image + '" alt="' + card.label + '" class="pair-card-image">'
                + '</button>';
        }).join('');

        return '<div class="pair-board">'
            + '<svg id="pair-lines" class="pair-lines" aria-hidden="true"></svg>'
            + '<div class="pair-column">' + leftCards + '</div>'
            + '<div class="pair-column">' + rightCards + '</div>'
            + '</div>'
            + '<p id="pair-helper" class="pair-helper">Выберите карточку слева, затем соответствующую карточку справа.</p>'
            + '<button type="button" id="pair-reset-btn">Сбросить связи</button>';
    }

    if (lesson.activityType === 'drag_classify') {
        const items = lesson.activityOptions.map(function (label, index) {
            return {
                label: label,
                image: lesson.activityImages[index] || '',
                originalIndex: index
            };
        });
        const shuffledItems = shuffleArray(items);

        const cards = shuffledItems.map(function (item) {
            return '<div class="drag-card" draggable="true" data-index="' + item.originalIndex + '">'
                + '<img src="' + item.image + '" alt="' + item.label + '" class="drag-card-image">'
                + '</div>';
        }).join('');

        return '<p class="lesson-activity-question">Перетащите карточки в соответствующие поля.</p>'
            + '<div class="drag-board">'
            + '<div class="drag-source drag-zone" data-zone="source">'
            + '<h5>Карточки</h5>'
            + '<div class="drag-zone-cards">' + cards + '</div>'
            + '</div>'
            + '<div class="drag-targets">'
            + '<div class="drag-zone" data-zone="conductors">'
            + '<h5>' + lesson.activityZones[0] + '</h5>'
            + '<div class="drag-zone-cards"></div>'
            + '</div>'
            + '<div class="drag-zone" data-zone="dielectrics">'
            + '<h5>' + lesson.activityZones[1] + '</h5>'
            + '<div class="drag-zone-cards"></div>'
            + '</div>'
            + '</div>'
            + '</div>';
    }

    if (lesson.activityType === 'order_drag') {
        const items = lesson.activitySteps.map(function (stepText, index) {
            return {
                text: stepText,
                image: lesson.activityImages[index] || '',
                originalIndex: index
            };
        });
        const shuffledItems = shuffleArray(items);

        const cards = shuffledItems.map(function (item) {
            return '<div class="order-card" draggable="true" data-index="' + item.originalIndex + '">'
                + '<img src="' + item.image + '" alt="' + item.text + '" class="order-card-image">'
                + '</div>';
        }).join('');
        const boardClass = lesson.activityLayout === 'vertical'
            ? 'order-board order-board--vertical'
            : 'order-board';

        return '<p class="lesson-activity-question">Перетащите карточки, чтобы выстроить правильный порядок.</p>'
            + '<div id="order-board" class="' + boardClass + '">'
            + cards
            + '</div>';
    }

    if (lesson.activityType === 'image_multi') {
        const cards = lesson.activityOptions.map(function (optionText, optionIndex) {
            const imageSrc = lesson.activityImages && lesson.activityImages[optionIndex] ? lesson.activityImages[optionIndex] : '';
            return '<button type="button" class="image-multi-card" data-index="' + optionIndex + '" aria-pressed="false">'
                + '<img src="' + imageSrc + '" alt="' + optionText + '" class="image-multi-image">'
                + '</button>';
        }).join('');

        return '<p class="lesson-activity-question">Нажмите на изображения, которые считаете правильными.</p>'
            + '<div class="image-multi-grid">' + cards + '</div>';
    }

    if (lesson.activityType === 'image_label_drag') {
        const labels = lesson.activityOptions.map(function (text, index) {
            return { text: text, originalIndex: index };
        });
        const shuffledLabels = shuffleArray(labels);

        const chips = shuffledLabels.map(function (item) {
            return '<div class="text-drag-chip" draggable="true" data-index="' + item.originalIndex + '">' + item.text + '</div>';
        }).join('');

        const targets = lesson.activityImages.map(function (src, index) {
            return '<div class="image-label-card">'
                + '<img src="' + src + '" alt="" class="image-label-image">'
                + '<div class="image-drop-slot" data-target-index="' + index + '">'
                + '<span class="image-drop-placeholder">Перетащите подпись</span>'
                + '</div>'
                + '</div>';
        }).join('');

        return '<p class="lesson-activity-question">Перетащите текстовые плашки к правильным изображениям.</p>'
            + '<div class="image-label-board">'
            + '<div class="text-chip-pool">'
            + '<h5>Плашки с ответами</h5>'
            + '<div class="text-chip-list">' + chips + '</div>'
            + '</div>'
            + '<div class="image-label-targets">' + targets + '</div>'
            + '</div>'
            + '<button type="button" id="image-label-reset-btn">Сбросить</button>';
    }

    if (lesson.activityType === 'match') {
        const rows = lesson.activityRows.map(function (rowText, rowIndex) {
            const options = lesson.activityOptions.map(function (optionText, optionIndex) {
                return '<option value="' + optionIndex + '">' + optionText + '</option>';
            }).join('');

            return '<div class="match-row">'
                + '<div class="match-left">' + rowText + '</div>'
                + '<select name="lesson_match_' + rowIndex + '" class="match-select">'
                + '<option value="">Выберите</option>'
                + options
                + '</select>'
                + '</div>';
        }).join('');

        return '<div class="match-grid">' + rows + '</div>';
    }

    if (lesson.activityType === 'number') {
        return '<p class="lesson-activity-question">' + lesson.activityQuestion + '</p>'
            + '<input type="text" name="lesson_number" class="number-input" placeholder="Введите число">';
    }

    if (lesson.activityType === 'multi') {
        return lesson.activityOptions.map(function (optionText, optionIndex) {
            return '<label class="quiz-option"><input type="checkbox" name="lesson_multi" value="' + optionIndex + '"> ' + optionText + '</label>';
        }).join('');
    }

    return '';
}

function readLessonAnswer(lesson) {
    if (lesson.activityType === 'single') {
        const selected = document.querySelector('input[name="lesson_single"]:checked');
        return selected ? Number(selected.value) : null;
    }

    if (lesson.activityType === 'pair') {
        if (!lessonPairState) return [];
        return lesson.leftCards.map(function (_, idx) {
            return lessonPairState.pairs[idx] === undefined ? '' : String(lessonPairState.pairs[idx]);
        });
    }

    if (lesson.activityType === 'drag_classify') {
        return lesson.activityOptions.map(function (_, idx) {
            const card = document.querySelector('.drag-card[data-index="' + idx + '"]');
            if (!card) return '';
            const zone = card.closest('.drag-zone');
            return zone ? zone.dataset.zone : '';
        });
    }

    if (lesson.activityType === 'order_drag') {
        return Array.from(document.querySelectorAll('#order-board .order-card')).map(function (card) {
            return Number(card.dataset.index);
        });
    }

    if (lesson.activityType === 'image_label_drag') {
        return lesson.activityImages.map(function (_, targetIndex) {
            const slot = document.querySelector('.image-drop-slot[data-target-index="' + targetIndex + '"]');
            if (!slot) return '';
            const chip = slot.querySelector('.text-drag-chip');
            return chip ? chip.dataset.index : '';
        });
    }

    if (lesson.activityType === 'match') {
        return lesson.activityRows.map(function (_, rowIndex) {
            const select = document.querySelector('select[name="lesson_match_' + rowIndex + '"]');
            return select ? select.value : '';
        });
    }

    if (lesson.activityType === 'number') {
        const input = document.querySelector('input[name="lesson_number"]');
        return input ? input.value.trim().replace(',', '.') : '';
    }

    if (lesson.activityType === 'multi') {
        return Array.from(document.querySelectorAll('input[name="lesson_multi"]:checked')).map(function (item) {
            return Number(item.value);
        });
    }

    if (lesson.activityType === 'image_multi') {
        return Array.from(document.querySelectorAll('.image-multi-card.is-selected')).map(function (item) {
            return Number(item.dataset.index);
        });
    }

    return null;
}

function isLessonAnswered(lesson, answer) {
    if (lesson.activityType === 'single') {
        return answer !== null;
    }
    if (lesson.activityType === 'pair') {
        return Array.isArray(answer) && answer.length === lesson.leftCards.length && answer.every(function (value) { return value !== ''; });
    }
    if (lesson.activityType === 'drag_classify') {
        return Array.isArray(answer) && answer.every(function (zone) { return zone === 'conductors' || zone === 'dielectrics'; });
    }
    if (lesson.activityType === 'order_drag') {
        return Array.isArray(answer) && answer.length === lesson.activitySteps.length;
    }
    if (lesson.activityType === 'image_label_drag') {
        return Array.isArray(answer) && answer.length === lesson.activityImages.length && answer.every(function (value) { return value !== ''; });
    }
    if (lesson.activityType === 'match') {
        return Array.isArray(answer) && answer.every(function (value) { return value !== ''; });
    }
    if (lesson.activityType === 'number') {
        return answer !== '';
    }
    if (lesson.activityType === 'multi') {
        return Array.isArray(answer) && answer.length > 0;
    }
    if (lesson.activityType === 'image_multi') {
        return Array.isArray(answer) && answer.length > 0;
    }
    return false;
}

function isLessonAnswerCorrect(lesson, answer) {
    if (lesson.activityType === 'single') {
        const expectedIndex = typeof lesson.activityCorrectIndex === 'number'
            ? lesson.activityCorrectIndex
            : (Array.isArray(lesson.activityCorrectIndexes) ? lesson.activityCorrectIndexes[0] : -1);
        return answer === expectedIndex;
    }

    if (lesson.activityType === 'pair') {
        return answer.every(function (value, idx) {
            return Number(value) === lesson.activityCorrectIndexes[idx];
        });
    }

    if (lesson.activityType === 'drag_classify') {
        return answer.every(function (zone, idx) {
            return zone === lesson.activityCorrectZones[idx];
        });
    }

    if (lesson.activityType === 'order_drag') {
        const expected = lesson.activitySteps.map(function (_, idx) { return idx; });
        return JSON.stringify(answer) === JSON.stringify(expected);
    }

    if (lesson.activityType === 'image_label_drag') {
        return answer.every(function (value, idx) {
            return Number(value) === lesson.activityCorrectIndexes[idx];
        });
    }

    if (lesson.activityType === 'match') {
        return answer.every(function (value, idx) {
            return Number(value) === lesson.activityCorrectIndexes[idx];
        });
    }

    if (lesson.activityType === 'number') {
        return lesson.activityAccepted.indexOf(answer) !== -1;
    }

    if (lesson.activityType === 'multi') {
        const expected = lesson.activityCorrectIndexes.slice().sort(function (a, b) { return a - b; });
        const actual = answer.slice().sort(function (a, b) { return a - b; });
        return JSON.stringify(expected) === JSON.stringify(actual);
    }

    if (lesson.activityType === 'image_multi') {
        const expected = lesson.activityCorrectIndexes.slice().sort(function (a, b) { return a - b; });
        const actual = answer.slice().sort(function (a, b) { return a - b; });
        return JSON.stringify(expected) === JSON.stringify(actual);
    }

    return false;
}

function renderPairArrows() {
    if (!lessonPairState) return;
    const board = document.querySelector('.pair-board');
    const svg = document.getElementById('pair-lines');
    if (!board || !svg) return;

    const boardRect = board.getBoundingClientRect();
    const width = Math.max(1, Math.round(boardRect.width));
    const height = Math.max(1, Math.round(boardRect.height));

    svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
    svg.setAttribute('width', String(width));
    svg.setAttribute('height', String(height));

    let lines = '';
    Object.keys(lessonPairState.pairs).forEach(function (leftKey) {
        const leftIdx = Number(leftKey);
        const rightIdx = lessonPairState.pairs[leftKey];
        const leftCard = document.querySelector('.pair-card[data-side="left"][data-index="' + leftIdx + '"]');
        const rightCard = document.querySelector('.pair-card[data-side="right"][data-index="' + rightIdx + '"]');
        if (!leftCard || !rightCard) return;

        const leftRect = leftCard.getBoundingClientRect();
        const rightRect = rightCard.getBoundingClientRect();
        const x1 = leftRect.right - boardRect.left;
        const y1 = leftRect.top - boardRect.top + leftRect.height / 2;
        const x2 = rightRect.left - boardRect.left;
        const y2 = rightRect.top - boardRect.top + rightRect.height / 2;
        const curve = Math.max(30, (x2 - x1) * 0.35);
        const d = 'M ' + x1 + ' ' + y1 + ' C ' + (x1 + curve) + ' ' + y1 + ', ' + (x2 - curve) + ' ' + y2 + ', ' + x2 + ' ' + y2;
        lines += '<path d="' + d + '" class="pair-line" marker-end="url(#pair-arrow)"></path>';
    });

    svg.innerHTML = ''
        + '<defs>'
        + '<marker id="pair-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth">'
        + '<path d="M0,0 L8,4 L0,8 z" class="pair-line-arrow"></path>'
        + '</marker>'
        + '</defs>'
        + lines;
}

function paintPairSelection() {
    if (!lessonPairState) return;
    const cards = Array.from(document.querySelectorAll('.pair-card'));
    cards.forEach(function (card) {
        const side = card.dataset.side;
        const index = Number(card.dataset.index);
        card.classList.remove('is-selected');
        card.classList.remove('is-paired');

        if (side === 'left') {
            if (lessonPairState.selectedLeft === index) {
                card.classList.add('is-selected');
            }
            if (lessonPairState.pairs[index] !== undefined) {
                card.classList.add('is-paired');
            }
        } else {
            const used = Object.keys(lessonPairState.pairs).some(function (leftKey) {
                return lessonPairState.pairs[leftKey] === index;
            });
            if (used) {
                card.classList.add('is-paired');
            }
        }
    });

    renderPairArrows();
}

function bindPairHandlers(lesson) {
    lessonPairState = { selectedLeft: null, pairs: {} };
    paintPairSelection();

    Array.from(document.querySelectorAll('.pair-card')).forEach(function (card) {
        card.addEventListener('click', function () {
            if (lessonLocked) return;

            const side = card.dataset.side;
            const index = Number(card.dataset.index);
            const helper = document.getElementById('pair-helper');

            if (side === 'left') {
                lessonPairState.selectedLeft = index;
                if (helper) helper.textContent = 'Теперь выберите подходящую единицу справа.';
                paintPairSelection();
                return;
            }

            if (lessonPairState.selectedLeft === null) {
                if (helper) helper.textContent = 'Сначала выберите карточку слева.';
                return;
            }

            const rightAlreadyUsed = Object.keys(lessonPairState.pairs).some(function (leftKey) {
                return Number(leftKey) !== lessonPairState.selectedLeft && lessonPairState.pairs[leftKey] === index;
            });

            if (rightAlreadyUsed) {
                showNotification('Эта единица уже связана с другой величиной.');
                return;
            }

            lessonPairState.pairs[lessonPairState.selectedLeft] = index;
            lessonPairState.selectedLeft = null;
            if (helper) helper.textContent = 'Связь сохранена. Можно выбрать следующую пару.';
            paintPairSelection();
        });
    });

    const resetBtn = document.getElementById('pair-reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function () {
            if (lessonLocked) return;
            lessonPairState = { selectedLeft: null, pairs: {} };
            const helper = document.getElementById('pair-helper');
            if (helper) helper.textContent = 'Сначала выберите карточку слева, затем справа.';
            paintPairSelection();
        });
    }

    if (pairResizeHandler) {
        window.removeEventListener('resize', pairResizeHandler);
    }
    pairResizeHandler = function () {
        renderPairArrows();
    };
    window.addEventListener('resize', pairResizeHandler);
}

function bindDragClassifyHandlers() {
    lessonDragState = { draggedIndex: null };
    const cards = Array.from(document.querySelectorAll('.drag-card'));
    const zones = Array.from(document.querySelectorAll('.drag-zone'));

    cards.forEach(function (card) {
        card.addEventListener('dragstart', function (event) {
            if (lessonLocked) {
                event.preventDefault();
                return;
            }
            const idx = card.dataset.index;
            lessonDragState.draggedIndex = idx;
            event.dataTransfer.setData('text/plain', idx);
            event.dataTransfer.effectAllowed = 'move';
            card.classList.add('is-dragging');
        });

        card.addEventListener('dragend', function () {
            card.classList.remove('is-dragging');
        });
    });

    zones.forEach(function (zone) {
        zone.addEventListener('dragover', function (event) {
            if (lessonLocked) return;
            event.preventDefault();
            zone.classList.add('is-over');
        });

        zone.addEventListener('dragleave', function () {
            zone.classList.remove('is-over');
        });

        zone.addEventListener('drop', function (event) {
            if (lessonLocked) return;
            event.preventDefault();
            zone.classList.remove('is-over');

            const idx = event.dataTransfer.getData('text/plain') || lessonDragState.draggedIndex;
            if (idx === null || idx === '') return;

            const card = document.querySelector('.drag-card[data-index="' + idx + '"]');
            const container = zone.querySelector('.drag-zone-cards');
            if (!card || !container) return;

            container.appendChild(card);
            lessonDragState.draggedIndex = null;
        });
    });
}

function bindOrderDragHandlers() {
    const board = document.getElementById('order-board');
    if (!board) return;

    let draggingCard = null;

    function handleDragOver(event) {
        if (lessonLocked) return;
        event.preventDefault();
        const target = event.target.closest('.order-card');
        if (!target || target === draggingCard) return;

        const rect = target.getBoundingClientRect();
        const before = event.clientY < rect.top + rect.height / 2;
        if (before) {
            board.insertBefore(draggingCard, target);
        } else {
            board.insertBefore(draggingCard, target.nextSibling);
        }
    }

    board.addEventListener('dragover', handleDragOver);

    Array.from(board.querySelectorAll('.order-card')).forEach(function (card) {
        card.addEventListener('dragstart', function (event) {
            if (lessonLocked) {
                event.preventDefault();
                return;
            }
            draggingCard = card;
            card.classList.add('is-dragging');
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('text/plain', card.dataset.index || '');
        });

        card.addEventListener('dragend', function () {
            card.classList.remove('is-dragging');
            draggingCard = null;
        });
    });
}

function bindImageMultiHandlers() {
    const cards = Array.from(document.querySelectorAll('.image-multi-card'));
    cards.forEach(function (card) {
        card.addEventListener('click', function () {
            if (lessonLocked) return;
            const willSelect = !card.classList.contains('is-selected');
            card.classList.toggle('is-selected', willSelect);
            card.setAttribute('aria-pressed', willSelect ? 'true' : 'false');
        });
    });
}

function refreshImageDropSlots() {
    Array.from(document.querySelectorAll('.image-drop-slot')).forEach(function (slot) {
        const hasChip = !!slot.querySelector('.text-drag-chip');
        slot.classList.toggle('has-label', hasChip);
    });
}

function bindImageLabelDragHandlers() {
    lessonDragState = { draggedIndex: null };
    const chips = Array.from(document.querySelectorAll('.text-drag-chip'));
    const pool = document.querySelector('.text-chip-list');
    const slots = Array.from(document.querySelectorAll('.image-drop-slot'));
    if (!pool || !slots.length) return;

    chips.forEach(function (chip) {
        chip.addEventListener('dragstart', function (event) {
            if (lessonLocked) {
                event.preventDefault();
                return;
            }
            const idx = chip.dataset.index;
            lessonDragState.draggedIndex = idx;
            event.dataTransfer.setData('text/plain', idx);
            event.dataTransfer.effectAllowed = 'move';
            chip.classList.add('is-dragging');
        });

        chip.addEventListener('dragend', function () {
            chip.classList.remove('is-dragging');
        });
    });

    const zones = [pool].concat(slots);
    zones.forEach(function (zone) {
        zone.addEventListener('dragover', function (event) {
            if (lessonLocked) return;
            event.preventDefault();
            zone.classList.add('is-over');
        });

        zone.addEventListener('dragleave', function () {
            zone.classList.remove('is-over');
        });

        zone.addEventListener('drop', function (event) {
            if (lessonLocked) return;
            event.preventDefault();
            zone.classList.remove('is-over');

            const idx = event.dataTransfer.getData('text/plain') || lessonDragState.draggedIndex;
            if (idx === null || idx === '') return;

            const chip = document.querySelector('.text-drag-chip[data-index="' + idx + '"]');
            if (!chip) return;

            if (zone.classList.contains('image-drop-slot')) {
                const existingChip = zone.querySelector('.text-drag-chip');
                if (existingChip && existingChip !== chip) {
                    pool.appendChild(existingChip);
                }
                zone.appendChild(chip);
            } else {
                pool.appendChild(chip);
            }

            lessonDragState.draggedIndex = null;
            refreshImageDropSlots();
        });
    });

    const resetBtn = document.getElementById('image-label-reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function () {
            if (lessonLocked) return;
            Array.from(document.querySelectorAll('.text-drag-chip')).forEach(function (chip) {
                pool.appendChild(chip);
            });
            refreshImageDropSlots();
        });
    }

    refreshImageDropSlots();
}

function renderLessonImages(images, cssClass, heroIndex) {
    if (!images || !images.length) return '';
    return '<div class="' + cssClass + '">'
        + images.map(function (src, index) {
            const imageClass = index === heroIndex ? 'lesson-image lesson-image--hero' : 'lesson-image';
            return '<img src="' + src + '" alt="" class="' + imageClass + '">';
        }).join('')
        + '</div>';
}

function renderLearnTheory() {
    if (pairResizeHandler) {
        window.removeEventListener('resize', pairResizeHandler);
        pairResizeHandler = null;
    }

    const lesson = activeLessons[lessonIndex];
    if (!lesson) {
        renderLearnFinish();
        return;
    }

    const theoryImagesClass = lesson.lessonImagesLayout === 'vertical'
        ? 'lesson-images lesson-images--vertical'
        : 'lesson-images';

    quizContent.innerHTML = '<section class="quiz-card lesson-card">'
        + '<h3>' + lesson.title + '</h3>'
        + '<ul class="lesson-theory">'
        + lesson.theory.map(function (line) { return '<li>' + line + '</li>'; }).join('')
        + '</ul>'
        + renderLessonImages(lesson.lessonImages, theoryImagesClass, lesson.lessonHeroImageIndex)
        + '</section>';

    quizControls.innerHTML = '<button type="button" id="to-activity-btn">Перейти к заданию</button>';

    document.getElementById('to-activity-btn').addEventListener('click', function () {
        renderLearnActivity();
    });
}

function goToNextLesson() {
    lessonIndex++;
    if (lessonIndex >= activeLessons.length) {
        renderLearnFinish();
        return;
    }
    renderLearnTheory();
}

function renderLearnActivity() {
    const lesson = activeLessons[lessonIndex];
    if (!lesson) {
        renderLearnFinish();
        return;
    }

    quizContent.innerHTML = '<section class="quiz-card lesson-card">'
        + '<h3>' + lesson.title + '</h3>'
        + '<div class="lesson-activity">'
        + '<h4>' + lesson.activityTitle + '</h4>'
        + ((lesson.activityType === 'drag_classify' || lesson.activityType === 'order_drag' || lesson.activityType === 'image_label_drag' || lesson.activityType === 'image_multi') ? '' : renderLessonImages(lesson.activityImages, 'lesson-images lesson-images--small'))
        + renderLessonActivity(lesson)
        + '</div>'
        + '<div id="learn-feedback" class="learn-feedback" aria-live="polite"></div>'
        + '</section>';

    quizControls.innerHTML = ''
        + '<button type="button" id="back-to-lesson-btn">Вернуться к уроку</button>'
        + '<button type="button" id="check-btn">Проверить</button>'
        + '<button type="button" id="next-lesson-btn" style="display:none;">Перейти к следующему уроку</button>';

    lessonLocked = false;
    lessonPairState = null;
    lessonDragState = null;

    if (lesson.activityType === 'pair') {
        bindPairHandlers(lesson);
    } else if (lesson.activityType === 'drag_classify') {
        bindDragClassifyHandlers();
    } else if (lesson.activityType === 'order_drag') {
        bindOrderDragHandlers();
    } else if (lesson.activityType === 'image_label_drag') {
        bindImageLabelDragHandlers();
    } else if (lesson.activityType === 'image_multi') {
        bindImageMultiHandlers();
    }

    document.getElementById('back-to-lesson-btn').addEventListener('click', function () {
        renderLearnTheory();
    });

    document.getElementById('check-btn').addEventListener('click', function () {
        if (lessonLocked) return;

        const answer = readLessonAnswer(lesson);
        if (!isLessonAnswered(lesson, answer)) {
            showNotification('Ответьте на задание перед проверкой.');
            return;
        }

        const feedback = document.getElementById('learn-feedback');
        const isCorrect = isLessonAnswerCorrect(lesson, answer);

        if (isCorrect) {
            feedback.textContent = lesson.successText;
            feedback.className = 'learn-feedback is-correct';
            lessonLocked = true;
            document.getElementById('check-btn').disabled = true;
            document.getElementById('next-lesson-btn').style.display = 'inline-block';
        } else {
            feedback.textContent = 'Неверно, попробуйте еще раз.';
            feedback.className = 'learn-feedback is-wrong';
        }
    });

    document.getElementById('next-lesson-btn').addEventListener('click', function () {
        if (!lessonLocked) return;
        goToNextLesson();
    });
}

function renderLearnFinish() {
    const stageNumber = activeLessonStage === 'stage3' ? 3 : (activeLessonStage === 'stage2' ? 2 : 1);
    const lessonsCount = activeLessons.length || 5;

    quizContent.innerHTML = '<section class="quiz-card lesson-card">'
        + '<h3>Этап ' + stageNumber + ': обучение пройдено</h3>'
        + '<p>Вы завершили все ' + lessonsCount + ' уроков. Теперь можно перейти к экзамену этапа ' + stageNumber + '.</p>'
        + '</section>';

    quizControls.innerHTML = ''
        + '<button type="button" id="go-exam-btn">Сдать экзамен этапа ' + stageNumber + '</button>'
        + '<button type="button" id="go-home-btn">На главную</button>';

    document.getElementById('go-exam-btn').addEventListener('click', function () {
        localStorage.setItem(QUIZ_MODE_KEY, 'exam');
        window.location.href = 'questions' + stageNumber + '.html?stage=' + stageNumber;
    });

    document.getElementById('go-home-btn').addEventListener('click', function () {
        window.location.href = 'index.html';
    });
}

function startStage1Learning() {
    modeLabel.textContent = 'Режим: обучение (уроки + интерактив)';
    activeLessonStage = 'stage1';
    activeLessons = stage1Lessons;
    learnLocked = false;
    lessonLocked = false;
    lessonPairState = null;
    lessonDragState = null;
    learnCorrectCount = 0;
    currentIndex = 0;
    selectedQuestions = [];
    lessonIndex = 0;
    renderLearnTheory();
}

function startStage2Learning() {
    modeLabel.textContent = 'Режим: обучение (уроки + интерактив)';
    activeLessonStage = 'stage2';
    activeLessons = stage2Lessons;
    learnLocked = false;
    lessonLocked = false;
    lessonPairState = null;
    lessonDragState = null;
    learnCorrectCount = 0;
    currentIndex = 0;
    selectedQuestions = [];
    lessonIndex = 0;
    renderLearnTheory();
}

function startStage3Learning() {
    modeLabel.textContent = 'Режим: обучение (уроки + интерактив)';
    activeLessonStage = 'stage3';
    activeLessons = stage3Lessons;
    learnLocked = false;
    lessonLocked = false;
    lessonPairState = null;
    lessonDragState = null;
    learnCorrectCount = 0;
    currentIndex = 0;
    selectedQuestions = [];
    lessonIndex = 0;
    renderLearnTheory();
}

function init() {
    if (!stageKey) {
        quizContent.innerHTML = '<p>Не удалось определить этап.</p>';
        quizControls.innerHTML = '';
        progress.textContent = '';
        return;
    }

    if (!resultsPage) {
        quizContent.innerHTML = '<p>Не задана страница результатов для текущего этапа.</p>';
        quizControls.innerHTML = '';
        progress.textContent = '';
        return;
    }

    if (!isStageUnlocked(stageKey)) {
        window.location.href = 'index.html';
        return;
    }

    configureHeader();

    if (mode === 'learn' && stageKey === 'stage1') {
        startStage1Learning();
        return;
    }

    if (mode === 'learn' && stageKey === 'stage2') {
        startStage2Learning();
        return;
    }

    if (mode === 'learn' && stageKey === 'stage3') {
        startStage3Learning();
        return;
    }

    selectedQuestions = getQuestionSet();

    if (!selectedQuestions.length) {
        quizContent.innerHTML = '<p>Не удалось загрузить вопросы для ' + stageLabel + '.</p>';
        quizControls.innerHTML = '';
        return;
    }

    updateHeader();

    if (mode === 'learn') {
        renderLearnQuestion();
    } else {
        renderExam();
    }
}

init();
