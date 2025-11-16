// ---------------------------------------------
// recommendation engine
// ---------------------------------------------
//
// input:
//    userIngredients = ["egg", "rice", "tomato"]
//    preference = "veg" or "non-veg" or "both"
//
// output:
//    returns the top 3 best matching recipes
//
// logic:
//    1. filter recipes by type (veg / non-veg / both)
//    2. calculate "match score" = number of ingredients that match
//    3. sort recipes by score (descending)
//    4. return top 3
//
// simple, clean, scalable.
// ---------------------------------------------

import { recipes } from "../data/recipes.js";

export const recommendRecipes = (userIngredients, preference = "both") => {
    // step 1 → filter by food preference
    let filteredRecipes = recipes;

    if (preference === "veg") {
        filteredRecipes = recipes.filter(r => r.type === "veg");
    } else if (preference === "non-veg") {
        filteredRecipes = recipes.filter(r => r.type === "non-veg");
    }

    // step 2 → score each recipe based on matching ingredients
    const scored = filteredRecipes.map(recipe => {
        let score = 0;

        recipe.ingredients.forEach(ing => {
            if (userIngredients.includes(ing)) score++;
        });

        return { ...recipe, score };
    });

    // step 3 → sort by the highest score first
    scored.sort((a, b) => b.score - a.score);

    // step 4 → return the top 3 recipes
    return scored.slice(0, 3);
};
