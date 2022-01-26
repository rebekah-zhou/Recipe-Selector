let hide = false;


const categoriesUrl = 'http://localhost:3000/categories'
getFetch(categoriesUrl)
    .then(categories => {
        const categoriesDiv = document.querySelector("#categories")
        categories.forEach(categoryObj => {
            // want to add something with 
            // categoryObj.strCategoryDescription
            const div = document.createElement('div')
            const span = document.createElement('span')
            const img = document.createElement('img')
            span.textContent = categoryObj.strCategory
            img.src = categoryObj.strCategoryThumb
            img.alt = categoryObj.strCategory
            img.className = 'filter-img'
            div.className = 'filter-div'
            div.append(span, img)
            categoriesDiv.append(div)
        })
    })

const mainIngredientUrl = 'http://localhost:3000/meals'
getFetch(mainIngredientUrl)
    .then(mainIngredient => {
        const mainIngredientDiv = document.querySelector("#mainingredient")
        mainIngredient.forEach(ingredientObj => {
            const div = document.createElement('div')
            const span = document.createElement('span')
            const img = document.createElement('img')
            span.textContent = ingredientObj.strIngredient
            img.src = `https://www.themealdb.com/images/ingredients/${ingredientObj.strIngredient}.png`
            img.alt = ingredientObj.strIngredient
            img.className = 'filter-img'
            div.className = 'filter-div'
            div.append(span, img)
            mainIngredientDiv.append(div)
        })
    })

// function createThumbnailElements() {
//     const div = document.createElement('div')
//     const span = document.createElement('span')
//     const img = document.createElement('img')
//     span.textContent = categoryObj.strCategory
//     img.src = categoryObj.strCategoryThumb
//             img.alt = categoryObj.strCategory
//             img.className = 'filter-img'
//             div.className = 'category-div'
//             div.append(span, img)
//             categoriesDiv.append(div)
// }

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
const searchBar = document.getElementById('search-bar')
const searchBarIcon = document.getElementById('search-bar-icon')
const form = document.getElementById('search-form')

fetch(randomMeal)
.then (res => res.json())
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

searchBarIcon.addEventListener('click', (e) => {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=` + `${searchBar.value}`)
    .then(res => res.json())
    .then(meal => {
        renderCenter(meal)
    })
    form.reset()
})

form.addEventListener('submit', (e) => {
    e.preventDefault()
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=` + `${searchBar.value}`)
    .then(res => res.json())
    .then(meal => {
        renderCenter(meal)
    })
    form.reset()
})

function renderCenter(meal) {
    const mealObject = meal.meals[0]
    const selectedName = document.getElementById('recipe-name')
    const selectedImage = document.getElementById('selected-img')
    const selectedIngedients1 = document.getElementById('ingredients-list-1')
    const selectedIngedients2 = document.getElementById('ingredients-list-2')
    const selectedIngedients3 = document.getElementById('ingredients-list-3')
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

    
    while(selectedIngedients1.firstChild) {
        selectedIngedients1.removeChild(selectedIngedients1.firstChild);
    }
    while(selectedIngedients2.firstChild) {
        selectedIngedients2.removeChild(selectedIngedients2.firstChild);
    }
    while(selectedIngedients3.firstChild) {
        selectedIngedients3.removeChild(selectedIngedients3.firstChild);
    }
    let idCounter = 1;

    ingredientsList.forEach(ingredient => {
        const ingredientLi = document.createElement('li')
        idCounter = idCounter ++
        ingredientLi.innerText = ingredient
        ingredientLi.setAttribute('id', idCounter ++)
        if(ingredientLi.getAttribute('id') % 3 === 0) {
            selectedIngedients3.appendChild(ingredientLi)
        } else if(ingredientLi.getAttribute('id') % 2 === 0) {
            selectedIngedients2.appendChild(ingredientLi)
        } else {
            selectedIngedients1.appendChild(ingredientLi)
        }
        
        console.log(ingredientsList.length)
    })
}

