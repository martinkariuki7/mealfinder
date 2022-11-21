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
    
    mealsWrapper.innerHTML = meals.map(meal => {
      return `
      <div>${meal.strMeal}</div>
      `
    }).join('')

   } else {
    alert('Please type in a meal or ingredient');
   }
}            

async function getRandomMeal(){
    let response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    let data = await response.json();
    data = await data.meals;
    let randomMeal = await data[0];

    let randomMealName = randomMeal.strMeal;
    let randomMealVideo = watchToEmbed(randomMeal.strYoutube);
    let randomMealImage = randomMeal.strMealThumb;
    let randomMealMedia = randomMealVideo ? randomMealVideo : randomMealImage;
    let randomMealInstructions = randomMeal.strInstructions;

    const ingredients = [];

    for(let i=1; i<=20; i++){
        if(randomMeal[`strIngredient${i}`]){
            ingredients.push(
                `${randomMeal[`strIngredient${i}`]} - ${randomMeal[`strMeasure${i}`]}`
            );
        } else {
          break;
        }
    }

    singleMeal.innerHTML = 
      `<h1>${randomMealName}</h1>
      <iframe width=400 height=200 src='${randomMealMedia}'></iframe>
      <ul>
        ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
      </ul>
      <p>${randomMealInstructions}</p>
      `
}

// Make YouTube videos embeddable
function watchToEmbed(string){
    return string.replace('watch?v=', 'embed/');
}

random.addEventListener('click', getRandomMeal, false);
submit.addEventListener('submit', getMealFromSearch, false);