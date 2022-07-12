    let formLogin = document.querySelector(".login-form")
let userInput = document.querySelector(".username-input")
let passwordInput = document.querySelector(".password-input")



formLogin.addEventListener("submit"  ,function(e){
    e.preventDefault()

    let userValue = userInput.value
    let passwordValue = passwordInput.value


    fetch("https://reqres.in/api/login" , {
        method:"POST",
        headers:{
            'Content-type' : "application/json",
        },
        
        body: JSON.stringify({
            email: userValue,
            password: passwordValue
        }),
        
    }).then((res) => res.json()).then((data) =>{
        if (data.token) {
            window.localStorage.setItem("token" , data.token)

            window.location.replace("main.html")
        }else{
            alert("parol yoki username xato")
        }
    })
})
