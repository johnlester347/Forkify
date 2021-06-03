import Search from './models/Search'; // You can use lahat ng nakalagay sa Search.js
import * as searchView from './views/searchView'; // You can use all of the file that is included sa searchView folder or file
import { elements, renderLoader, clearLoader } from './views/base';

/** Global state of the app 
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Like recipes
**/
const state = {};

const controlSearch = async () => {
    // 1. Get query from view
    const query = searchView.getInput(); // Read the search query from the input field

    if (query) {
        // 2. New search object and add to state 
        state.search = new Search(query); // Gumawa tayo search object that contains yung search query

        // 3. Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);


        // 4. Search for recipes
        await state.search.getResults(); // Eto yung API na connected na nasa Recipe

        // 5. Render results on UI
        clearLoader();
        searchView.renderResults(state.search.result); // We render it to the user interface or sa DOM
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline'); // Hahanapin nya yung pinaka malapit na element na same sa naka lagay sa parameter

    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10); // Kapag clinick mo yung button yung value ng data-goto yung i rereturn 
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});
