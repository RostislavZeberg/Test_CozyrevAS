// DOM элементы
const coursesGrid = document.getElementById('courses-grid');
const noResultsMessage = document.getElementById('no-results');
const filterButtons = document.querySelectorAll('.filter');
const searchInput = document.querySelector('.search__input');
const loadMoreBtn = document.getElementById('load-more-btn');
const loadMoreContainer = document.getElementById('load-more-container');
const loadMoreSvg = document.getElementById('load-more-svg'); 

// Текущее состояние
let currentFilter = 'all';
let currentSearch = '';
let visibleCoursesCount = 9;
const COURSES_PER_LOAD = 9;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    if (typeof coursesData === 'undefined') {
        console.error('coursesData is not defined. Make sure courses-data.js is loaded before script.js');
        return;
    }

    updateFilterCounts();
    renderCourses();
    setupEventListeners();
    updateLoadMoreButton();
});

// Настройка обработчиков событий
function setupEventListeners() {
    // Обработчики для фильтров
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('filter--active'));
            button.classList.add('filter--active');
            currentFilter = button.getAttribute('data-category');
            visibleCoursesCount = 9;
            renderCourses();
            updateLoadMoreButton();
        });
    });

    // Обработчик для поиска
    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value.toLowerCase().trim();
        visibleCoursesCount = 9;
        renderCourses();
        updateLoadMoreButton();
    });

    // Обработчик для кнопки Load More
    loadMoreBtn.addEventListener('click', () => {
        visibleCoursesCount += COURSES_PER_LOAD;
        renderCourses();
        updateLoadMoreButton();
    });

    // Обработчик для SVG (свернуть все карточки)
    loadMoreSvg.addEventListener('click', () => {
        const filteredCourses = getFilteredCourses();

        // Если показаны все карточки, сворачиваем обратно до 9
        if (visibleCoursesCount >= filteredCourses.length) {
            visibleCoursesCount = 9;

            renderCourses();
            updateLoadMoreButton();
        }
    });
}

// Функция для получения отфильтрованных курсов
function getFilteredCourses() {
    return coursesData.filter(course => {
        const categoryMatch = currentFilter === 'all' || course.category === currentFilter;
        const searchMatch = currentSearch === '' ||
            course.title.toLowerCase().includes(currentSearch) ||
            course.author.toLowerCase().includes(currentSearch) ||
            course.category.toLowerCase().includes(currentSearch);
        return categoryMatch && searchMatch;
    });
}

// Функция для отрисовки курсов
function renderCourses() {
    coursesGrid.innerHTML = '';
    const filteredCourses = getFilteredCourses();

    if (filteredCourses.length === 0) {
        noResultsMessage.classList.add('no-results--visible');
        loadMoreContainer.style.display = 'none';
    } else {
        noResultsMessage.classList.remove('no-results--visible');
        const coursesToShow = Math.min(visibleCoursesCount, filteredCourses.length);

        for (let i = 0; i < coursesToShow; i++) {
            const course = filteredCourses[i];
            const courseElement = createCourseElement(course);
            coursesGrid.appendChild(courseElement);
        }

        loadMoreContainer.style.display = 'flex';
    }

    updateFilterCounts();
}

// Функция для создания элемента курса (остается без изменений)
function createCourseElement(course) {
    const courseCard = document.createElement('div');
    courseCard.className = 'course-card';

    const categoryDisplayNames = {
        'marketing': 'Marketing',
        'management': 'Management',
        'hr-recruiting': 'HR & Recruiting',
        'design': 'Design',
        'development': 'Development'
    };

    const categoryDisplayName = categoryDisplayNames[course.category] || course.category;

    let color;
    if (categoryDisplayName === 'Marketing') {
        color = 'rgba(3, 206, 164, 1)';
    } else if (categoryDisplayName === 'Management') {
        color = 'rgba(90, 135, 252, 1)';
    } else if (categoryDisplayName === 'HR & Recruiting') {
        color = 'rgba(248, 152, 40, 1)';
    } else if (categoryDisplayName === 'Design') {
        color = 'rgba(245, 47, 110, 1)';
    } else if (categoryDisplayName === 'Development') {
        color = 'rgba(119, 114, 241, 1)';
    }

    const categoryStyle = color ? `style="background-color: ${color}"` : '';

    courseCard.innerHTML = `
        <img src="${course.image}" alt="${course.title}" class="course-card__image">
        <div class="course-card__content">
            <span class="course-card__category" ${categoryStyle}>${categoryDisplayName}</span>
            <h3 class="course-card__title">${course.title}</h3>
            <div class="course-card__info">
                <span class="course-card__price">${course.price}</span>
                <span class="course-card__line">|</span>
                <span class="course-card__author">${course.author}</span>
            </div>
        </div>
    `;

    return courseCard;
}

// Функция для обновления кнопки Load More и SVG
function updateLoadMoreButton() {
    const filteredCourses = getFilteredCourses();
    const filteredCoursesCount = filteredCourses.length;

    // Проверяем, показаны ли все карточки
    const allCoursesShown = visibleCoursesCount >= filteredCoursesCount;

    if (allCoursesShown) {
        // Если показаны все карточки
        loadMoreSvg.style.display = 'block';
        loadMoreContainer.classList.add('load-more-container--all-shown');
        loadMoreSvg.style.cursor = 'pointer';
        loadMoreBtn.style.cursor = 'default';

        // Меняем текст кнопки на "Show less" для информативности
        loadMoreBtn.textContent = 'Show less';
    } else {
        // Если можно загрузить еще карточки
        loadMoreBtn.classList.remove('load-more-btn--hidden');
        loadMoreContainer.classList.remove('load-more-container--all-shown');

        const remainingCourses = filteredCoursesCount - visibleCoursesCount;
        loadMoreBtn.textContent = `Load more (${remainingCourses} more)`;
    }
}

// Функция для обновления счетчиков в фильтрах (остается без изменений)
function updateFilterCounts() {
    const categoryCounts = {
        'all': coursesData.length,
        'marketing': coursesData.filter(course => course.category === 'marketing').length,
        'management': coursesData.filter(course => course.category === 'management').length,
        'hr-recruiting': coursesData.filter(course => course.category === 'hr-recruiting').length,
        'design': coursesData.filter(course => course.category === 'design').length,
        'development': coursesData.filter(course => course.category === 'development').length
    };

    const filteredCourses = getFilteredCourses();

    filterButtons.forEach(button => {
        const category = button.getAttribute('data-category');
        let count;

        if (category === 'all') {
            count = coursesData.length;
        } else if (category === currentFilter && currentSearch !== '') {
            count = filteredCourses.filter(course => course.category === category).length;
        } else {
            count = categoryCounts[category] || 0;
        }

        const titleElement = button.querySelector('.filter__title');
        if (titleElement) {
            titleElement.setAttribute('data-count', count);
        }
    });
}