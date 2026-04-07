/* ========================
   INTERNATIONALIZATION (i18n)
   ======================== */

const i18n = {
    kk: {
        title: 'Концертный зал',
        subtitle: 'Интерактивная схема рассадки',
        loading: 'Схема жүктеліп жатыр...',
        data_unavailable: 'Деректер уақытша қолжетімсіз',
        retry: 'Қайтау',
        reset: 'Бастапқы',
        filter_by_section: 'Бөлімге сәйкес сүзгілеу:',
        normal_view: 'Қалыпты көрініс',
        high_contrast: 'Жоғары контраст',
        section_info: 'Бөлім туралы ақпарат',
        select_section: 'Схемада бөлімді таңдаңыз',
        total_seats: 'Барлық орындар:',
        available: 'Қолжетімді:',
        section_name: 'Атауы:',
        price: 'Баға диапазоны:',
        select_seats: 'Орындарды таңдау',
        zoom: 'Масштаб:',
        touch_hint: '💡 Ақпаратты көру үшін бөлімге қарай табыңыз',
        
        parterre: 'Партер',
        beletage: 'Бельэтаж',
        balkon: 'Балкон',
        galery: 'Галерея',
    },
    
    ru: {
        title: 'Концертный зал',
        subtitle: 'Интерактивная схема рассадки',
        loading: 'Загрузка схемы...',
        data_unavailable: 'Данные временно недоступны',
        retry: 'Повторить',
        reset: 'Исходный',
        filter_by_section: 'Фильтр по секции:',
        normal_view: 'Обычный вид',
        high_contrast: 'Высокий контраст',
        section_info: 'Информация о секции',
        select_section: 'Выберите секцию на схеме',
        total_seats: 'Всего мест:',
        available: 'Доступно:',
        section_name: 'Название:',
        price: 'Ценовой диапазон:',
        select_seats: 'Выбрать места',
        zoom: 'Масштаб:',
        touch_hint: '💡 Касайтесь секции для просмотра информации',
        
        parterre: 'Партер',
        beletage: 'Бельэтаж',
        balkon: 'Балкон',
        galery: 'Галерея',
    },
    
    en: {
        title: 'Concert Hall',
        subtitle: 'Interactive Seating Chart',
        loading: 'Loading seating chart...',
        data_unavailable: 'Data temporarily unavailable',
        retry: 'Retry',
        reset: 'Reset',
        filter_by_section: 'Filter by section:',
        normal_view: 'Normal View',
        high_contrast: 'High Contrast',
        section_info: 'Section Information',
        select_section: 'Select a section on the chart',
        total_seats: 'Total Seats:',
        available: 'Available:',
        section_name: 'Name:',
        price: 'Price Range:',
        select_seats: 'Select Seats',
        zoom: 'Zoom:',
        touch_hint: '💡 Tap a section to view information',
        
        parterre: 'Parterre',
        beletage: 'Beletage',
        balkon: 'Balkon',
        galery: 'Gallery',
    }
};

function t(key, lang = getCurrentLanguage()) {
    if (i18n[lang] && i18n[lang][key]) {
        return i18n[lang][key];
    }
    if (i18n.ru && i18n.ru[key]) {
        return i18n.ru[key];
    }
    return key;
}

function getCurrentLanguage() {
    let lang = localStorage.getItem('concert-hall-lang');
    
    if (!lang) {
        const browserLang = navigator.language || navigator.userLanguage;
        lang = browserLang.startsWith('kk') ? 'kk' : 
               browserLang.startsWith('ru') ? 'ru' : 
               browserLang.startsWith('en') ? 'en' : 'ru';
        localStorage.setItem('concert-hall-lang', lang);
    }
    
    return lang;
}

function setLanguage(lang) {
    if (!i18n[lang]) return;
    
    localStorage.setItem('concert-hall-lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    updatePageTranslations(lang);
}

function updatePageTranslations(lang) {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = t(key, lang);
        
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.placeholder = translation;
        } else if (element.tagName === 'BUTTON' || element.tagName === 'OPTION') {
            element.textContent = translation;
        } else {
            element.textContent = translation;
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const currentLang = getCurrentLanguage();
    
    document.documentElement.lang = currentLang;
    updatePageTranslations(currentLang);
    
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('lang-active');
        if (btn.getAttribute('data-lang') === currentLang) {
            btn.classList.add('lang-active');
        }
    });
    
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            setLanguage(lang);
            
            document.querySelectorAll('.lang-btn').forEach(b => {
                b.classList.remove('lang-active');
            });
            btn.classList.add('lang-active');
        });
    });
});

window.i18n = { t, setLanguage, getCurrentLanguage };