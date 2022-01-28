
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
    // const categoriesUrl = 'https://rebekah-zhou.github.io/Data/render-recipes.json/categories'
    getFetch(categoriesUrl)
    .then(categories => {
        categories.forEach(categoryObj => {
            const {strCategory, strCategoryThumb, strCategoryDescription} = categoryObj
            createThumbnailElements("categories", strCategory, strCategoryThumb, strCategoryDescription)
        })
        makeMenuEventListener("categories", "c")
    })
}

function loadMainIngredientsMenu() {
    const mainIngredientUrl = 'http://localhost:3000/meals'
    // const mainIngredientUrl = 'https://rebekah-zhou.github.io/Data/render-recipes.json/meals'
    getFetch(mainIngredientUrl)
    .then(mainIngredient => {
        mainIngredient.forEach(ingredientObj => {
            const {strIngredient, strDescription} = ingredientObj
            createThumbnailElements("mainingredient", strIngredient, `https://www.themealdb.com/images/ingredients/${strIngredient}.png`, strDescription)
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

function createThumbnailElements(filter, name, image, description) {
    const filterDiv = document.querySelector(`#${filter}`)
    const div = document.createElement('div')
    const spanName = document.createElement('span')
    const img = document.createElement('img')
    const spanDesc = document.createElement('span')
    spanName.textContent = name
    spanDesc.textContent = description
    spanDesc.className = "tooltip-text"
    img.src = image
    img.alt = name
    img.setAttribute("class", `${filter}-img`)
    spanName.setAttribute('class', 'tooltip')
    div.className = 'filter-div'
    
    div.append(spanName, img)
    filterDiv.append(div)
   // showDescriptionOnMouseover(div, description)
}

// function showDescriptionOnMouseover (div, description) {
//     const hiddenDescriptionDiv = document.querySelector('.hidden-description')
//     div.addEventListener('mouseover', e => {
//         const q = document.querySelector('q')
//         q.textContent = description
//         hiddenDescriptionDiv.style.display = 'flex'
//     })
//     div.addEventListener('mouseout', () => {
//         hiddenDescriptionDiv.style.display = 'none'
//     })
// }

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
    for (const filter in hideMenuObj) {
        const filterContainer = document.querySelector(`#${filter}`)
        if (!hideMenuObj[filter]) {
            filterContainer.style.display = "flex"
        } else {
            filterContainer.style.display = "none"
        }
    }
}

function makeRegionMenuEventListener(meal) {
    const filterDivs = document.querySelectorAll(`#region .filter-div`)
        filterDivs[filterDivs.length - 1].addEventListener('click', e => {
            
            renderSideBar(meal)
            const firstMealId = meal.meals[0].idMeal
            getFetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${firstMealId}`)
            .then(mealObj => renderCenter(mealObj))
            
            fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${meal.meals[0]['strMeal']}`)
            .then(res => res.json())
            .then(data => {
            recipeListTitle.innerText = `More ${data.meals[0]['strArea']} Recipes:`
          })
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
                recipeListTitle.innerText = `More ${div.innerText} Recipes:`
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
const selectedIngedients1 = document.getElementById('ingredients-list-1')
const selectedIngedients2 = document.getElementById('ingredients-list-2')
const selectedIngedients3 = document.getElementById('ingredients-list-3')
const modal = document.getElementById('myModal')
const shoppingCartIcon = document.getElementById('shopping-list')
const addToList = document.getElementById('add-to-list')
const span = document.getElementsByClassName("close")[0];
const confirmation = document.getElementById('confirmation')
const edit = document.getElementById('edit-btn')
const deleteBtn = document.getElementsByClassName('delete-button')


fetch(randomMeal)
.then (res => res.json())
.then(meal => {
    renderCenter(meal)
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=` + `${meal.meals[0]['strArea']}`)
    .then(res => res.json())
    .then(meals => {
        renderSideBar(meals)
    })
    recipeListTitle.innerText = `More ${meal.meals[0]['strArea']} Recipes:`
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
    recipeListTitle.innerText = `More ${meal.meals[0]['strArea']} Recipes:`
  })
})
let newValue = true;
searchBarIcon.addEventListener('click', (e) => {
    
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=` + `${searchBar.value}`)
    .then(res => res.json())
    .then(meal => {
        try {
        renderCenter(meal)
        renderSideBar(meal)
        newValue = true;
      } catch {
        console.log('why did you type stupid shit?')
        newValue = false;
      }
      if(newValue === true && meal.meals.length === 1) {
        recipeListTitle.innerText = `Found ${searchBar.value}!`
        } else if (newValue === true) { 
            recipeListTitle.innerText = `More "${searchBar.value}" Recipes:`
        } else {
            recipeListTitle.innerText = `"${searchBar.value}" is not a valid recipe name`
            newValue = true
        }
        form.reset()
    })
    
    
})
console.log(newValue)

form.addEventListener('submit', (e) => {
    e.preventDefault()
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=` + `${searchBar.value}`)
    .then(res => res.json())
    .then(meal => {
        try {
        renderCenter(meal)
        renderSideBar(meal)
        newValue = true;
      } catch {
        console.log('why did you type stupid shit?')
        newValue = false;
      }
      if(newValue === true && meal.meals.length === 1) {
        recipeListTitle.innerText = `Found ${searchBar.value}!`
        } else if (newValue === true) { 
            recipeListTitle.innerText = `More "${searchBar.value}" Recipes:`
        } else {
            recipeListTitle.innerText = `"${searchBar.value}" is not a valid recipe name`
            newValue = true
        }
        form.reset()
    })
})


shoppingCartIcon.addEventListener('click', () => {
    modal.style.display = "block"
})


addToList.addEventListener('click', () => {
    const ingredients = document.getElementsByClassName('ingredients')
    const p = document.createElement('p')
    p.innerText = "***"
    const recipeList = document.getElementById('ingedients-shopping-list')
    for(const ingredient in ingredients) {
        const recipeListLi = document.createElement('li')
        const span = document.createElement('span')
        const check = document.createElement('input')
        const deleteBtn = document.createElement('button')
        deleteBtn.setAttribute('class', 'delete-button')
        deleteBtn.innerText = 'x'
        check.setAttribute('class', 'check-box')
        check.setAttribute('type', 'checkbox')
        recipeListLi.setAttribute('class', 'list-items')
        recipeListLi.append(span, check, deleteBtn)
        span.innerText = ingredients[ingredient].innerText
        if(span.innerText !== 'undefined') {
        recipeList.appendChild(recipeListLi)
        }
        recipeList.appendChild(p)
        confirmation.style.display = "block"
        addToList.style.display = "none"
        setTimeout(() => {
            confirmation.style.display = "none"
            addToList.style.display = "block"
        }, 1200)
        console.log(ingredients[ingredient].innerText)
    }
})

span.addEventListener('click', () => {
    modal.style.display = "none"
})

window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

  shoppingCartIcon.addEventListener('mouseover', (e) => {
      shoppingCartIcon.style.fontSize = "2.2rem"
      shoppingCartIcon.style.cursor = "pointer"
  })

  shoppingCartIcon.addEventListener('mouseout', (e) => {
    shoppingCartIcon.style.fontSize = "2rem"
    shoppingCartIcon.style.cursor = "none"
})
  


function renderCenter(meal) {
    const mealObject = meal.meals[0]
    const selectedName = document.getElementById('recipe-name')
    const selectedImage = document.getElementById('selected-img')
    const selectedIngedients1 = document.getElementById('ingredients-list-1')
    const selectedIngedients2 = document.getElementById('ingredients-list-2')
    const selectedIngedients3 = document.getElementById('ingredients-list-3')
    const instructions = document.getElementById('instructions')
    const measuresArry = [];
    const ingredientsArry = [];

    selectedName.innerText = mealObject.strMeal
    selectedImage.setAttribute('src', mealObject.strMealThumb)
    instructions.innerText = mealObject.strInstructions
    
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
        ingredientLi.setAttribute('class', 'ingredients')
        ingredientLi.setAttribute('id', idCounter ++)
        let isTrue = true;
        ingredientLi.addEventListener('click', (e) => {
            if(isTrue === true){
            ingredientLi.setAttribute('class', '')
            e.target.style.filter = "opacity(20%)"
            isTrue = false
            } else if(isTrue === false) {
                ingredientLi.setAttribute('class', 'ingredients')
                e.target.style.filter = "opacity(100%)"
                isTrue = true
            }
            console.log(isTrue)
        })
        if(ingredientLi.getAttribute('id') % 3 === 0) {
            selectedIngedients3.appendChild(ingredientLi)
        } else if(ingredientLi.getAttribute('id') % 2 === 0) {
            selectedIngedients1.appendChild(ingredientLi)
        } else {
            selectedIngedients2.appendChild(ingredientLi)
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
        const capitalizedNameArr = meal.strMeal.split(' ')
        const newCapitalizedNameArr = capitalizedNameArr.map(word => {
            if (word !== 'and' && word !== 'with'  && word !== '') {
                if(word[0] === "(" || word[0] === ")") {
                    word = word[0] + word[1].toUpperCase() + word.slice(2)
                } else {
                    word = word[0].toUpperCase() + word.slice(1)
                }
                return word
            } else {return word}
        })
        const capitalizedName = newCapitalizedNameArr.join(' ')
        currentRecipesLi.innerText = capitalizedName

        currentRecipesLi.addEventListener('click', (e) => {
                meals.meals.forEach(item => {
                    if (e.target.textContent.toLowerCase() === item.strMeal.toLowerCase()) {
                        getFetch(`https:/www.themealdb.com/api/json/v1/1/lookup.php?i=${item.idMeal}`)
                        .then(renderCenter)
                    }
                })
        })
        sideBarUl.appendChild(currentRecipesLi)
    })
}
