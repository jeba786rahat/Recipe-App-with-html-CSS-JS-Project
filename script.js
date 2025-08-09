document.addEventListener('DOMContentLoaded', () => {
    const searchBox = document.querySelector('.searchBox');
    const searchbtn = document.querySelector('.searchbtn');
    const recipeContainer = document.querySelector('.recipe-container');
    const recipeDetailsContent = document.querySelector('.recipe-details-content');
    const recipeCloseBtn = document.querySelector('.recipe-close-Btn');

    const fetchRecipes = async(query) => {
        recipeContainer.innerHTML = "<h2>Fetching Recipes...</h2>";

        const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const response = await data.json();

        recipeContainer.innerHTML = "";

        if (response.meals) {
            response.meals.forEach(meal => {
                const recipeDiv = document.createElement('div');
                recipeDiv.classList.add('recipe');

                recipeDiv.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <h3>${meal.strMeal}</h3>
            <p><span>${meal.strArea}</span> Dish</p>
            <p>Belongs to <span>${meal.strCategory}</span> Category</p>
          `;
                const button = document.createElement('button');
                button.textContent = 'View Recipe';
                recipeDiv.appendChild(button);

                //Adding EventListener to recipe button
                button.addEventListener('click', () => {
                    openRecipePopup(meal);
                });

                recipeContainer.appendChild(recipeDiv);
            });


        } else {
            recipeContainer.innerHTML = `<p>No recipes found.</p>`;
        }
    };
    // Function to fetch ingredients and measurements
    const fetchIngredinents = (meal) => {
        let ingredentsList = "";
        for (let i = 1; i <= 20; i++) {
            const ingredents = meal[`strIngredient${i}`];
            if (ingredents) {
                const measure = meal[`strMeasure${i}`];
                ingredentsList += `<li>${measure} ${ingredents} </li>`
            } else {
                break;
            }

        }
        return ingredentsList;
    }
    const openRecipePopup = (meal) => {
        recipeDetailsContent.innerHTML = ` 
                             <h2 class="recipeName"> ${meal.strMeal} </h2> 
                             <h3> Ingredents: </h3> 
                             <ul class="IngredientList"> ${ fetchIngredinents(meal)} </ul>
                             <div class="recipeInstructions">
                                  <h3>Instruction:</h3>
                                  <p>${meal.strInstructions}</p>
                             </div>
                            `


        recipeDetailsContent.parentElement.style.display = "block";

    }
    if (recipeCloseBtn) { // prevents null error
        recipeCloseBtn.addEventListener('click', () => {
            recipeDetailsContent.parentElement.style.display = "none";
        });
    } else {
        console.error("No element found with class .recipe-close-Btn");
    }


    searchbtn.addEventListener('click', (e) => {
        e.preventDefault();
        const searchInput = searchBox.value.trim();
        if (!searchInput) {
            recipeContainer.innerHTML = `<h2>Type the meal in the search box.</h2>`;
            return;
        }
        fetchRecipes(searchInput);
    });

});