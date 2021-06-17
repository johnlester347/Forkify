import { elements } from './base'; // Magagamit mo yung method/function element na nasa folder na base

export const getInput = () => elements.searchInput.value; // Getting the value from the input

export const clearInput = () => {
    elements.searchInput.value = ''; // Clearing the input fields after the request
};

export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link--active')); // converting nodelist into array
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });

    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active'); // this will select all the a tags 
    // that is active and add the class
};

/** 
 // 'Pasta with tomato and spinach'
 acc: 0 / acc + cur.length = 5 / newTitle = ['Pasta']  -- Pasta is 5 letters
 acc: 5 / acc + cur.length = 9 / newTitle = ['Pasta', 'with']
 acc: 9 / acc + cur.length = 15 / newTitle = ['Pasta', 'with', 'tomato']
 acc: 15 / acc + cur.length = 18 / newTitle = ['Pasta', 'with', 'tomato']  // Not pushed because 17 is the limit
 acc: 18 / acc + cur.length = 24 / newTitle = ['Pasta', 'with', 'tomato']  // Not pushed because 17 is the limit
**/
export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) { // If yung title is sobra sa 17.. execute
        title.split(' ').reduce((acc, cur) => { // By splitting yung words ay magiging array, acc is mag sstart sa 0 , then cur is Pasta whic is equals to 5
            if (acc + cur.length <= limit) {
                newTitle.push(cur); // Hanggat di na rereach yung limit na 17 mapupush sa array yung item
            }
            return acc + cur.length;
        }, 0); // acc is = 0

        return `${newTitle.join('')} ...`; // Now lahat ng naka store sa array newTitle is gagawin nating string separeted by space
    }
    return title;
};

const renderRecipe = recipe => {
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
    elements.searchResList.insertAdjacentHTML('beforeend', markup); // Now iinsert nya yung recipe sa sa UI 
};


// All of the code below are for pagination
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);

    let button;
    if (page === 1 && pages > 1) {
        // Only button to go to next page
        button = createButton(page, 'next');
    } else if (page < pages) {
        // Both buttons
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
    } else if (page === pages && pages > 1) {
        // Only button to go to prev page
        button = createButton(page, 'prev');
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    // Render result of current page
    const start = (page - 1) * resPerPage; // Sample if nasa page 1 tayo 1 x 10 = 10
    const end = page * resPerPage; // 2 x 10 = 20

    recipes.slice(start, end).forEach(renderRecipe);

    // Render pagination buttons
    renderButtons(page, recipes.length, resPerPage);
};

