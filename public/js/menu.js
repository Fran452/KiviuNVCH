window.addEventListener("load", function(){
    let menuBoton = document.querySelector(".lineas-menu");
    let menu = document.querySelector("menu");
    let main = document.querySelector("main");

    console.log(menuBoton);

    menuBoton.addEventListener("click",function(){
        menu.classList.toggle("menu_active");
        main.classList.toggle("menu_active_main")
        
    })
    
    
})