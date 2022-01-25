
let hide = false;


const categoriesUrl = 'http://localhost:3000/categories'
getFetch(categoriesUrl)
    .then(data => {
        const categoriesDiv = document.querySelector("#categories")
        data.forEach(categoryObj => {
            const a = document.createElement('a')
            const img = document.createElement('img')
            a.textContent = categoryObj.strCategory
            a.href = ""
            img.src = categoryObj.strCategoryThumb
            img.className = 'filter-img'
            a.append(img)
            categoriesDiv.append(a)
        })
    })

function getFetch(url) {
    return fetch(url)
            .then(res => res.json())
}

const filters = document.querySelectorAll(".filter-li")
filters.forEach(filter => {
    filter.addEventListener('click', e => {
        const aFilter = e.target.textContent.toLowerCase().replace(/\s+/g, '')
        toggleHiddenContainer(aFilter)
    })
})

function toggleHiddenContainer(specificFilter) {
    const specificFilterContainer = document.querySelector(`#${specificFilter}`)
    hide =! hide
    if (hide) {
        specificFilterContainer.style.display = "flex"
    } else {
        specificFilterContainer.style.display = "none"
    }
}

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