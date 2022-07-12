const token = window.localStorage.getItem("token")
const logout = document.querySelector(".logout")

let elForm = document.querySelector(".form")
let searchInput = document.querySelector(".search-input")

let elList = document.querySelector(".list")
let resultNumber = document.querySelector(".result-number")
let showingNumber = document.querySelector(".showing-number")

let bookmarkList = document.querySelector(".bookmark-list")



const sortBtn = document.querySelector(".sort-btn")


if (!token) {
    window.location.replace("index.html")
}

logout.addEventListener("click", function (e) {
    window.localStorage.removeItem("token")

    window.location.replace("index.html")

})



sortBtn.addEventListener("click", function (e) {
    orderBy = "newest"

    getBooks()
})


elForm.addEventListener("submit", function (e) {
    e.preventDefault()

    let searchInputValue = searchInput.value

    searchInput.value = null

    search = searchInputValue

    getBooks()

})





let search = "js"
let page = 1;
let maxResult = 10;
let orderBy = "relevance"

let getBooks = async function () {

    let request = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${search}&maxResults=${maxResult}&startIndex=${page}&orderBy=${orderBy}`)

    let data = await request.json()

    findBookmark(data.items)


    datasetbtn(data.items)


    elList.innerHTML = null

    resultNumber.textContent = data.totalItems
    showingNumber.textContent = data.items.length

    if (data.items && data.items.length > 0) {
        renderMovies(data.items, elList)
    }
     else {
        renderNotMovies(elList)
    }


}

getBooks()

let renderMovies = function (arr, htmlElement) {



    arr.forEach(book => {

        let listItem = document.createElement("li")
        let imgBox = document.createElement("div")
        let img = document.createElement("img")
        let title = document.createElement("h4")
        let authors = document.createElement("span")
        let date = document.createElement("p")
        let buttons = document.createElement("div")
        let bookmarkBtn = document.createElement("button")
        let infoBtn = document.createElement("button")
        let readBtn = document.createElement("button")
        let br = document.createElement("br")

        title.textContent = book.volumeInfo.title
        authors.textContent = book.volumeInfo.authors
        date.textContent = book.volumeInfo.publishedDate
        bookmarkBtn.textContent = "bookmark"
        infoBtn.textContent = "More Info"
        readBtn.textContent = "Read"
        img.setAttribute("src", book.volumeInfo.imageLinks.thumbnail)

        listItem.setAttribute("class", "list-item")
        imgBox.setAttribute("class", "img-box")
        img.setAttribute("width", "200")
        img.setAttribute("height", "250")
        title.setAttribute("class", "title")
        authors.setAttribute("class", "authors")
        date.setAttribute("class", "date")
        bookmarkBtn.setAttribute("class", "bookmark-btn")
        infoBtn.setAttribute("class", "info-btn")
        readBtn.setAttribute("class", "read-btn")


        bookmarkBtn.dataset.bookmarkBtnId = book.id


        htmlElement.appendChild(listItem)
        listItem.appendChild(imgBox)
        imgBox.appendChild(img)
        listItem.appendChild(title)
        listItem.appendChild(authors)
        listItem.appendChild(date)
        listItem.appendChild(buttons)
        buttons.appendChild(bookmarkBtn)
        buttons.appendChild(infoBtn)
        buttons.appendChild(br)
        buttons.appendChild(readBtn)

        console.log(book);

    });


}


let renderNotMovies = function (htmlElement) {

    let newItem = document.createElement("li")

    let newTitle = document.createElement("h1")

    newTitle.textContent = "Bunday kitob topilmadi"

    newTitle.style.color = "red"

    newItem.setAttribute("class", "list-item")

    htmlElement.appendChild(newItem)
    newItem.appendChild(newTitle)
}

let bookmarkArr = []

let findBookmark = function (arr) {

    elList.addEventListener("click", function (e) {

        if (e.target.matches(".bookmark-btn")) {

            let bookmarkId = e.target.dataset.bookmarkBtnId

            let foundBookmark = arr.find(item => item.id === bookmarkId)

            if (!bookmarkArr.includes(foundBookmark)) {
                bookmarkArr.push(foundBookmark)
            }

            bookmarkList.innerHTML = null


            console.log(foundBookmark);

            renderBookmark(bookmarkArr, bookmarkList)

            
        }
    })

}


let renderBookmark = function (arr, htmlElement) {

    arr.forEach(bookmark => {

        let newList = document.createElement("li")
        let newBox = document.createElement("div")
        let newTitle = document.createElement("h3")
        let newAuthor = document.createElement("p")
        let newIcons = document.createElement("div")

        let openBtn = document.createElement("a")
        let openImg = document.createElement("img")
        let deletBtn = document.createElement("button")
        let deletImg = document.createElement("img")

        newAuthor.textContent = bookmark.volumeInfo.authors
        newTitle.textContent = bookmark.volumeInfo.title

        openImg.setAttribute("src", "./images/book-open1.png")
        deletImg.setAttribute("src", "./images/delete1.png")

        openImg.setAttribute("class", "open-img")
        deletImg.setAttribute("class", "delete-img")

        deletBtn.setAttribute("class", "delete-btn")
        openBtn.setAttribute("class", "open-btn")

        newIcons.setAttribute("class", "icons")

        openBtn.style.display = "block"
        newList.style.listStyleType = "none"
        newList.style.backgroundColor = "#F8FAFD"
        newList.style.display = "flex"
        newList.style.width = "280px"
        newList.style.padding = "5px"
        newList.style.marginLeft = "-15px"
        newList.style.marginBottom = "20px"
        newTitle.style.fontSize = "16px"
        newAuthor.style.fontSize = "13px"
        newAuthor.style.color = "#757881"
        newAuthor.style.fontFamily = "Noto Sans"
        deletBtn.style.border = "none"

        deletBtn.dataset.deletBtnId = bookmark.id
        deletImg.dataset.deletBtnId = bookmark.id

        htmlElement.appendChild(newList)
        newList.appendChild(newBox)
        newBox.appendChild(newTitle)
        newBox.appendChild(newAuthor)
        newList.appendChild(newIcons)
        newIcons.appendChild(openBtn)
        openBtn.appendChild(openImg)
        newIcons.appendChild(deletBtn)
        deletBtn.appendChild(deletImg)


        htmlElement.addEventListener("click" , function(e){
            if (e.target.matches(".open-img") || e.target.matches(".open-btn")) {
        
                openBtn.setAttribute("href" , bookmark.volumeInfo.previewLink)
        
            }
          })

    });
}

let datasetbtn = function (arr) {

    bookmarkList.addEventListener("click", function (e) {

        if (e.target.matches(".delete-btn") || e.target.matches(".delete-img")) {
            let deletId = e.target.dataset.deletBtnId

            let foundDelete = arr.findIndex(item => item.id = deletId)

            bookmarkArr.splice(foundDelete, 1)

            bookmarkList.innerHTML = null

            renderBookmark(bookmarkArr, bookmarkList)

        }


    })
}