const randomMeal = ('https://www.themealdb.com/api/json/v1/1/random.php')
const randomMealButton = document.getElementById('random-meal-button')

fetch(randomMeal)
.then(res => res.json())
.then(meal => {
    renderCenter(meal)
})

randomMealButton.addEventListener('click', () => {
    fetch(randomMeal)
    .then(res => res.json())
    .then(meal => {
    renderCenter(meal)
  })
})

function renderCenter(meal) {
    const mealObject = meal.meals[0]
    const selectedName = document.getElementById('recipe-name')
    const selectedImage = document.getElementById('selected-img')
    const selectedIngedients = document.getElementById('ingredients-list')
    const instructions = document.getElementById('instructions')


    selectedName.innerText = mealObject.strMeal
    selectedImage.setAttribute('src', mealObject.strMealThumb)
    instructions.innerText = mealObject.strInstructions
    const measuresArry = [];
    const ingredientsArry = [];
    
    for(const item in mealObject) {
        if(item.match(/strIngredient.*/)) {
            ingredientsArry.push(mealObject[`${item}`])
        }
    }
    for(const item in mealObject) {
        if(item.match(/strMeasure.*/)) {
            measuresArry.push(mealObject[`${item}`])
        }
    }
    
    let newArray = measuresArry.map((value, index) => {
        return `${value}  ${ingredientsArry[index]}`
    })
    
    const ingredientsList = newArray.filter(item => item.length > 3 && item !== 'null  null'
     && item !== '  null')
    console.log(newArray)

    
    while(selectedIngedients.firstChild) {
        selectedIngedients.removeChild(selectedIngedients.firstChild);
    }
    
    ingredientsList.forEach(ingredient => {
        const ingredientLi = document.createElement('li')
        ingredientLi.innerText = ingredient
        selectedIngedients.appendChild(ingredientLi)
    })
}