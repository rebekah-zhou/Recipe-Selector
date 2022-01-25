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