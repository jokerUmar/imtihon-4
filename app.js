const token = window.localStorage.getItem("token")
const logout = document.querySelector(".logout")
let elForm = document.querySelector(".form")
let searchInput = document.querySelector(".search-input")
let elList = document.querySelector(".list")
let resultNumber = document.querySelector(".result-number")
let showingNumber = document.querySelector(".showing-number")
let pages = document.querySelector(".pages")
let bookmarkList = document.querySelector(".bookmark-list")
const sortBtn = document.querySelector(".sort-btn")
let modal = document.querySelector(".modal")
let overlay = document.querySelector(".overlay")
let array = []

let prevBtn = document.querySelector(".prev")
let nextBtn = document.querySelector(".next")


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

    page = 1

    getBooks()
})

let search = "php"
let page = 1;
let maxResult = 10;
let orderBy = "relevance"

let getBooks = async function () {

    let request = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${search}&maxResults=${maxResult}&startIndex=${page}&orderBy=${orderBy}`)
    let data = await request.json()
    array = data.items
    elList.innerHTML = null

    resultNumber.textContent = data.totalItems
    showingNumber.textContent = data.items.length

    numberPages(data)
    
    if (data.items && data.items.length > 0) {
        renderMovies(data.items, elList)
    } else {
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
        let readBtn = document.createElement("a")
        let br = document.createElement("br")

        title.textContent = book?.volumeInfo.title
        authors.textContent = book?.volumeInfo.authors
        date.textContent = book?.volumeInfo.publishedDate
        bookmarkBtn.textContent = "bookmark"
        infoBtn.textContent = "More Info"
        readBtn.textContent = "Read"
        img.setAttribute("src", book?.volumeInfo.imageLinks.thumbnail)

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
        infoBtn.dataset.infoBtnId = book.id 

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
        readBtn.style.display = "inline-block"
        readBtn.style.textDecoration = "none"

        htmlElement.addEventListener("click", function (e) {

            if (e.target.matches(".read-btn")) {
                readBtn.setAttribute("href", book.volumeInfo.previewLink)
            }

            else if (e.target.matches(".info-btn")) {

                
                let infoId = e.target.dataset.infoBtnId
                
                let foundInfo = arr.find((e) => e.id === infoId)
               
                modal.innerHTML = null
                 
                overlay.style.display = "block"

                renderMoreInfo(arr , modal )
            }

        })
    });
}


overlay.addEventListener("click" , function(e){
    overlay.style.display = "none"
})

let renderNotMovies = function (htmlElement) {

    let newItem = document.createElement("li")

    let newTitle = document.createElement("h1")

    newTitle.textContent = "Bunday kitob topilmadi"

    newTitle.style.color = "red"

    newItem.setAttribute("class", "list-item")

    htmlElement.appendChild(newItem)
    newItem.appendChild(newTitle)
}

let localData = JSON.parse(window.localStorage.getItem("bookmarkArr"))
let local = JSON.parse(window.localStorage.getItem("render"))

let bookmarkArr = localData || [] ; 

elList.addEventListener("click", function (e) {

    if (e.target.matches(".bookmark-btn")) {
        let bookmarkId = e.target.dataset.bookmarkBtnId
        let foundBookmark = array.find((e) => e.id === bookmarkId)

        if (!bookmarkArr.includes(foundBookmark)) {
            bookmarkArr.push(foundBookmark)
            window.localStorage.setItem("bookmarkArr" , JSON.stringify(bookmarkArr))
        }

        
        bookmarkList.innerHTML = null
        
        renderBookmark(bookmarkArr, bookmarkList)
    }
   

})

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

        window.localStorage.setItem('bookmarks',JSON.stringify(bookmarkArr));

    });


    htmlElement.addEventListener("click", function (e) {
        if (e.target.matches(".open-img") || e.target.matches(".open-btn")) {

            openBtn.setAttribute("href", bookmark.volumeInfo.previewLink)

        }
    })
}


bookmarkList.addEventListener("click", function (e) {

    if (e.target.matches(".delete-btn") || e.target.matches(".delete-img")) {
        let deletId = e.target.dataset.deletBtnId

        let foundDelete = bookmarkArr.findIndex(item => item.id = deletId)

        bookmarkArr.splice(foundDelete, 1)

        window.localStorage.setItem('bookmarkArr',JSON.stringify(bookmarkArr));

        
        if (bookmarkArr.length === 0) {
            window.localStorage.removeItem("bookmarkArr")
        }
        
        bookmarkList.innerHTML = null
        
        renderBookmark(bookmarkArr, bookmarkList)
    }
})


prevBtn.addEventListener("click" , function(e){

   if (page>10) {
    page-=10
     console.log(page);

   }else{
    prevBtn.disabled = true
   }

})

nextBtn.addEventListener("click" , function(e){

   if (page>10) {
    page+=10
     console.log(page);
   }

})

let numberPages = function (arr) {
    
    for (let i = 1; i <= Math.ceil(arr.totalItems/10) ; i++) {
        let pageBtn = document.createElement("button")
        pageBtn.textContent = i
        pages.appendChild(pageBtn)
        pageBtn.addEventListener("click" , function(){
           
            page = (i*10)+1

            if (arr.items.length>0) {
                page = (i*10)+1
            }else{
                alert("bunday bolim yo'q")
            }

            getBooks()
       
        })
    }
}

let renderMoreInfo = function(arr , htmlElement){
 
    arr.forEach(element => {
 
        modalheader = document.createElement("div")
        modaltitle = document.createElement("p")
        modalXmark = document.createElement("i")
        modalimg = document.createElement("img")
        modaldesc = document.createElement("p")
        m = document.createElement("div")
        article = document.createElement("article")
        span1 = document.createElement("span")
        author = document.createElement("p")
        span2 = document.createElement("span")
        p2 = document.createElement("p")
        publish = document.createElement("p")
        span3 = document.createElement("span")
        p3 = document.createElement("p")
        category = document.createElement("p")
        span4 = document.createElement("span")
        p4 = document.createElement("span")
        pagecount = document.createElement("span")
        br = document.createElement("br")
        

        modalheader.setAttribute("class", "modal-header")
        modaltitle.setAttribute("class", "modal__title")
        modalXmark.setAttribute("class", "fa-solid fa-xmark")
        modalimg.setAttribute("class", "modal-img")
        modaldesc.setAttribute("class", "modal-desc")
        m.setAttribute("class", "m")
        author.setAttribute("class", "author modal-data")
        span2.setAttribute("class", "m")
        publish.setAttribute("class", "publish  modal-data")
        category.setAttribute("class", "category  modal-data")
        pagecount.setAttribute("class", "page-count  modal-data")
        modalimg.setAttribute("src" , element.volumeInfo.imageLinks.thumbnail)

        span3.style.display = "flex"
        span3.style.marginTop = "5px"
        span2.style.display = "flex"
        span2.style.marginTop = "5px"

        modaltitle.textContent = element.volumeInfo.title || "undefined"
        modaldesc.textContent = element.volumeInfo.description || "undefined"
        span1.textContent = "Author :"
        author.textContent = element.volumeInfo.authors || "undefined"
        p2.textContent = "Publishers:"
        publish.textContent = element.volumeInfo.publishedDate || "undefined"
        p3.textContent = "Categories:"
        category.textContent = element.volumeInfo.categories || "undefined"
        p4.textContent = "Pages Count:"
        pagecount.textContent = element.volumeInfo.pageCount || "undefined"
        

        htmlElement.appendChild(modalheader)
        modalheader.appendChild(modaltitle)
        modalheader.appendChild(modalXmark)
        htmlElement.appendChild(modalimg)
        htmlElement.appendChild(modaldesc)
        htmlElement.appendChild(m)
        htmlElement.appendChild(article)
        article.appendChild(span1)
        article.appendChild(author)
        htmlElement.appendChild(span2)
        span2.appendChild(p2)
        span2.appendChild(publish)
        htmlElement.appendChild(span3)
        span3.appendChild(p3)
        span3.appendChild(category)
        htmlElement.appendChild(br)
        htmlElement.appendChild(span4)
        span4.appendChild(p4)
        span4.appendChild(pagecount)

        console.log(element);
    });
}



