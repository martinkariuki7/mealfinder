console.clear();

let singleMeal = document.getElementById('single-meal');
let mealsWrapper = document.getElementById('meals');
let random = document.getElementById('random');

const submit = document.getElementById('submit'),
      search = document.getElementById('search');

// Generate meals by search
async function getMealFromSearch(e){
   e.preventDefault();
   let searchTerm = search.value;
   mealsWrapper.innerHTML = '';
   singleMeal.innerHTML = '';

   if(searchTerm.trim()){
    
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`)
    let data = await response.json();
    let meals = data.meals;
    
    meals.map(meal => {
      let mealLink = document.createElement('div');
      mealLink.classList.add('meal');
      mealLink.innerHTML = `
      <h2>${meal.strMeal}</h2>
      `
      mealsWrapper.appendChild(mealLink);

      mealLink.addEventListener('click', () => {
        addMealToDom(meal);
      }, false)
    })

   } else {
    alert('Please type in a meal or ingredient');
   }
}            

// Generate random meal
async function getRandomMeal(){
    
    mealsWrapper.innerHTML = '';

    let response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    let data = await response.json();
    data = await data.meals;
    let randomMeal = await data[0];

    addMealToDom(randomMeal);
}

// Helper function that adds a meal to the DOM
function addMealToDom(meal){
  
  let mealMedia = `<img src="${meal.strMealThumb}" alt="${meal.strMeal}" />`

  if(meal.strYoutube != null){
    mealMedia = `<iframe width=400 height=200 src='${watchToEmbed(meal.strYoutube)}'></iframe>`
  }

  const ingredients = [];

  for(let i=1; i<=20; i++){
      if(meal[`strIngredient${i}`]){
          ingredients.push(
              `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
          );
      } else {
        break;
      }
  }

  singleMeal.innerHTML = 
    `<h1>${meal.strMeal}</h1>
    ${mealMedia}
    <ul>
      ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
    </ul>
    <p>${meal.strInstructions}</p>
    `
  
}

// Make YouTube videos embeddable
function watchToEmbed(string){
    return string.replace('watch?v=', 'embed/');
}

// Event listeners
random.addEventListener('click', getRandomMeal, false);
submit.addEventListener('submit', getMealFromSearch, false);