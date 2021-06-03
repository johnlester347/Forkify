import { elements } from './base'; // Magagamit mo yung method/function element na nasa folder na base

export const getInput = () => elements.searchInput.value; // Getting the value from the input

export const clearInput = () => {
    elements.searchInput.value = ''; // Clearing the input fields after the request
};

export const clearResults = () => {
    elements.searchResList.innerHTML = '';
};

const renderRecipe = recipe => {
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${recipe.title}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

export const renderResults = recipes => {
    // console.log(recipes);
    recipes.forEach(renderRecipe);
};