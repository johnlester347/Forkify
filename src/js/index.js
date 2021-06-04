import Search from './models/Search'; // You can use lahat ng nakalagay sa Search.js
import Recipe from './models/Recipe'; // You can use lahat ng nakalagay sa Recipe.js
import * as searchView from './views/searchView'; // You can use all of the file that is included sa searchView folder or file
import { elements, renderLoader, clearLoader } from './views/base';
// import { Stats } from 'webpack';

/** Global state of the app 
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Like recipes
**/
const state = {};
// const search = new Search(q);
// search.getResults();


/** SEARCH CONTROLLER ***/
const controlSearch = async () => {
    // 1. Get query from view
    const query = searchView.getInput(); // Read the search query from the input field

    if (query) {
        // 2. New search object and add to state 
        state.search = new Search(query); // Gumawa tayo search object that contains yung search query

        // 3. Prepare UI for results
        searchView.clearInput(); // I cleclear nya yung input field after running
        searchView.clearResults(); // I cleclear nya yung recipe list after running so it means na kapag nag search ka mag rurun yunthen clear 
        renderLoader(elements.searchRes);


        try {
            // 4. Search for recipes
            await state.search.getResults(); // Eto yung API na connected na nasa Recipe, it will going to return  a promise
            // Ang i rereturn neto is yung recipe data na nasa Search.js, so this awaits is going to run and after it finished running 
            //then proceed

            // 5. Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result); // We render it to the user interface or sa DOM
            // I papasa nya sa argument yung data ng recipe na naka store sa state.search.result
        } catch (err) {
            alert('Something wrong with the search');
            clearLoader();
        }
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault(); // Eto yung kapag clinick mo yung search hindi sya mag rereload
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline'); // Hahanapin nya yung pinaka malapit na element na same sa naka lagay sa parameter
    // console.log(btn);
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10); // Kapag clinick mo yung button yung value ng data-goto yung i rereturn 
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});


/** RECIPE CONTROLLER ***/
const controlRecipe = async () => {
    // Get the ID from the URL
    const id = window.location.hash.replace('#', ''); // Windows.location is the entire URL and with means returning hash
    console.log(id);

    if (id) {
        // Prepare UI for changes

        // Create new recipe object
        state.recipe = new Recipe(id);

        try {
            // Get recipe data
            await state.recipe.getRecipe();

            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // Render recipe
            console.log(state.recipe);
        } catch (error) {
            alert('Error processing recipe!');
        }

    }
};

// window.addEventListener('hashchange', controlRecipe); // I cacall nya yung controlRecipe kapag nag change yung hash sa URL
// window.addEventListener('load', controlSearch);

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));