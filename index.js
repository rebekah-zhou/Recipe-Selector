
loadCategoriesMenu();
loadMainIngredientsMenu();
loadRegionMenu();
makeFiltersEventListener();

function getFetch(url) {
    return fetch(url)
            .then(res => res.json())
}

function loadCategoriesMenu() {
    const categoriesUrl = 'http://localhost:3000/categories'
    getFetch(categoriesUrl)
    .then(categories => {
        categories.forEach(categoryObj => {
            const {strCategory, strCategoryThumb} = categoryObj
            createThumbnailElements("categories", strCategory, strCategoryThumb)
        })
        makeMenuEventListener("categories", "c")
    })
}

function loadMainIngredientsMenu() {
    const mainIngredientUrl = 'http://localhost:3000/meals'
    getFetch(mainIngredientUrl)
    .then(mainIngredient => {
        mainIngredient.forEach(ingredientObj => {
            const {strIngredient} = ingredientObj
            createThumbnailElements("mainingredient", strIngredient, `https://www.themealdb.com/images/ingredients/${strIngredient}.png`)
        })
        makeMenuEventListener("mainingredient", "i")
    })
}

function loadRegionMenu() {
    const regionUrl = 'https://www.themealdb.com/api/json/v1/1/list.php?a=list'
    getFetch(regionUrl)
    .then(data => {
        data.meals.forEach(area => {
            const {strArea} = area
            const specificRegionUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${strArea}`
            getFetch(specificRegionUrl)
            .then(data => {
                const areaImg = data.meals[0].strMealThumb
                createThumbnailElements("region", strArea, areaImg)
                makeRegionMenuEventListener(data)
            })
        })
    })
}

function createThumbnailElements(filter, name, image) {
    const filterDiv = document.querySelector(`#${filter}`)
    const div = document.createElement('div')
    const span = document.createElement('span')
    const img = document.createElement('img')
    span.textContent = name
    img.src = image
    img.alt = name
    img.className = `${filter}-img`
    div.className = 'filter-div'
    div.append(span, img)
    filterDiv.append(div)
}

function makeFiltersEventListener() {
    document.addEventListener('click', e => toggleHiddenContainer(), false)
    const filtersLi = document.querySelectorAll(".filter-li")
    filtersLi.forEach(filter => {
        filter.addEventListener('click', e => {
        const aFilter = e.target.textContent.toLowerCase().replace(/\s+/g, '')
        toggleHiddenContainer(aFilter)
        e.stopPropagation();
        })
    }, true)
}

const hideMenuObj = {
    categories: true,
    mainingredient: true,
    region: true
}

function toggleHiddenContainer(specificFilter = "") {
    for (const filter in hideMenuObj) {
        if (filter === specificFilter) {
            hideMenuObj[filter] = false
        } else {
            hideMenuObj[filter] = true
        }
    }
    console.log(hideMenuObj)
    for (const filter in hideMenuObj) {
        const filterContainer = document.querySelector(`#${filter}`)
        if (!hideMenuObj[filter]) {
            filterContainer.style.display = "flex"
        } else {
            filterContainer.style.display = "none"
        }
    }
}

// function hideOnClickOutside(element) {
//     const outsideClickListener = e => {
//         if (e.target.closest(selector) === null) {
//             element.style.display = 'none'
//             removeClickListener()
//         }
//     }

//     const removeClickListener = () => {
//         document.removeEventListener('click', outsideClickListener)
//     }

//     document.addEventListener('click', outsideClickListener)
// }

function makeRegionMenuEventListener(meal) {
    const filterDivs = document.querySelectorAll(`#region .filter-div`)
        filterDivs[filterDivs.length - 1].addEventListener('click', e => {
            console.log(e.target)
            renderSideBar(meal)
            const firstMealId = meal.meals[0].idMeal
            getFetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${firstMealId}`)
            .then(mealObj => renderCenter(mealObj))
        })
}

function makeMenuEventListener(filter, filterLetter) {
    const filterDivs = document.querySelectorAll(`#${filter} .filter-div`)
    filterDivs.forEach(div => {
        div.addEventListener('click', e => {
            const filterUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?${filterLetter}=${e.target.alt}`
            getFetch(filterUrl)
            .then(meal => {
                renderSideBar(meal)
                const firstMealId = meal.meals[0].idMeal
                getFetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${firstMealId}`)
                .then(mealObj => renderCenter(mealObj))
            })
        })
    })
}

const randomMeal = ('https://www.themealdb.com/api/json/v1/1/random.php')
const randomMealButton = document.getElementById('random-meal-button')
const searchBar = document.getElementById('search-bar')
const searchBarIcon = document.getElementById('search-bar-icon')
const form = document.getElementById('search-form')
const recipeListTitle = document.getElementById('recipe-list-title')

fetch(randomMeal)
.then (res => res.json())
.then(meal => {
    renderCenter(meal)
    // console.log(meal.meals[0]['strCategory'])
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=` + `${meal.meals[0]['strArea']}`)
    .then(res => res.json())
    .then(meals => {
        renderSideBar(meals)
    })
    recipeListTitle.innerText = `More ${meal.meals[0]['strArea']} recipes:`
})

randomMealButton.addEventListener('click', () => {
    fetch(randomMeal)
    .then(res => res.json())
    .then(meal => {
    renderCenter(meal)

    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=` + `${meal.meals[0]['strArea']}`)
    .then(res => res.json())
    .then(meals => {
        renderSideBar(meals)
    })
    recipeListTitle.innerText = `More ${meal.meals[0]['strArea']} recipes:`
  })
})

searchBarIcon.addEventListener('click', (e) => {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=` + `${searchBar.value}`)
    .then(res => res.json())
    .then(meal => {
        renderCenter(meal)
        renderSideBar(meal)
    })
    recipeListTitle.innerText = `More "${searchBar.value}" recipes:`
    form.reset()
})

form.addEventListener('submit', (e) => {
    e.preventDefault()
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=` + `${searchBar.value}`)
    .then(res => res.json())
    .then(meal => {
        renderCenter(meal)
        renderSideBar(meal)
    })
    recipeListTitle.innerText = `More "${searchBar.value}" recipes:`
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
        const checkbox = document.createElement('input')
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
    })
}

function renderSideBar(meals) {
    const selectedMealsArray = meals.meals
    const sideBarUl = document.getElementById('recipe-list')

    while(sideBarUl.firstChild) {
        sideBarUl.removeChild(sideBarUl.firstChild)
    }

    selectedMealsArray.forEach(meal => {
        const currentRecipesLi = document.createElement('li')
        currentRecipesLi.setAttribute('class', "recipes-list")
        currentRecipesLi.innerText = meal.strMeal

        currentRecipesLi.addEventListener('click', (e) => {
            fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=` + `${e.target.innerText}`)
            .then(res => res.json())
            .then(meal => {
                renderCenter(meal)
            })

        })
        sideBarUl.appendChild(currentRecipesLi)
    })
}