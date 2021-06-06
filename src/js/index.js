import Search from './models/Search'; // You can use lahat ng nakalagay sa Search.js
import Recipe from './models/Recipe'; // You can use lahat ng nakalagay sa Recipe.js
import List from './models/List'; // You can use lahat ng nakalagay sa List.js
import Likes from './models/Likes'; // You can use lahat ng nakalagay sa List.js
import * as searchView from './views/searchView'; // You can use all of the file that is included sa searchView folder or file
import * as recipeView from './views/recipeView'; // You can use all of the file that is included sa searchView folder or file
import * as listView from './views/listView'; // You can use all of the file that is included sa searchView folder or file
import * as likesView from './views/likesView'; // You can use all of the file that is included sa searchView folder or file
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
window.state = state;


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
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight selected search item
        if (state.search) searchView.highlightSelected(id);

        // Create new recipe object
        state.recipe = new Recipe(id);

        try {
            // Get recipe data and parse ingredients
            await state.recipe.getRecipe();

            // console.log(state.recipe.ingredients);
            state.recipe.parseIngredients();

            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));

        } catch (error) {
            console.log(error);
            alert('Error processing recipe!');
        }

    }
};

// window.addEventListener('hashchange', controlRecipe); // I cacall nya yung controlRecipe kapag nag change yung hash sa URL
// window.addEventListener('load', controlSearch);

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


/** LIST CONTROLLER ***/
const controlList = () => {
    // Create a new list IF there is none yet
    if (!state.list) state.list = new List();

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
};


// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    // console.log(id); // This will return the id 

    // Handle the delete button 
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state    
        state.list.deleteItem(id);

        // Delete from UI
        listView.deleteItem(id);

        // Handle the count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});


// TESTING 
state.likes = new Likes();
likesView.toggleLikeMenu(state.likes.getNumLikes());



/** LIKE CONTROLLER ***/
const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // User has NOT yet liked current recipe
    if (!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLike(currentID, state.recipe.title, state.recipe.author, state.recipe.img);

        // Toggle the like button 
        likesView.toggleLikeBtn(true);

        // Add like to the UI list
        likesView.renderLike(newLike);

        // User HAS liked current recipe
    } else {
        // Remove like from the state
        state.likes.deleteLike(currentID);

        // Toggle the like button
        likesView.toggleLikeBtn(false);

        // Remove like from UI list
        likesView.deleteLike(currentID);
    }
    // likesView.toggleLikeBtn(state.likes.getNumLikes());
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};


// Handling recipe button clicks 
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked 

        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Add ingredients to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLike();
    }

    // console.log(state.recipe);
});

window.r = new List();
