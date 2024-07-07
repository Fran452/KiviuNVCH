window.addEventListener("load", function(){
    let tipo = document.querySelector("#tipoVisualizacion");
    let tarjeta = document.querySelector(".tarjeta");
    tarjeta.style.display = "none"

    tipo.addEventListener("change", function(){
        console.log(tipo.value);
        let tabla = document.querySelector(".tabla");
        let tarjeta = document.querySelector(".tarjeta");
        if(tipo.value == "tabla"){
            tabla.style.display = "block"
            tarjeta.style.display = "none"
        }else{
            tabla.style.display = "none" 
            tarjeta.style.display = "block"
        }
    })
    
    let nombre = document.querySelector("#nombre");
    let nombreview = document.querySelectorAll(".nombreView");

    nombre.addEventListener("change", function(){

        nombreview.forEach(elemento => elemento.classList.toggle("apagado"));
        
    })

    let prioridad = document.querySelector("#prioridad");
    let prioridadView = document.querySelectorAll(".prioridadView");


    prioridad.addEventListener("change", function(){

        prioridadView.forEach(elemento => elemento.classList.toggle("apagado"));
        
    })

    let estado = document.querySelector("#estado");
    let estadoView = document.querySelectorAll(".estadoView");


    estado.addEventListener("change", function(){

        estadoView.forEach(elemento => elemento.classList.toggle("apagado"));
        
    })

    let fecha = document.querySelector("#fecha");
    let fechaView = document.querySelectorAll(".fechaView");

    fecha.addEventListener("change", function(){

        fechaView.forEach(elemento => elemento.classList.toggle("apagado"));
        
    })

    let fechaFin = document.querySelector("#fechaFin");
    let fechaFinView = document.querySelectorAll(".fechaFinView");

    fechaFin.addEventListener("change", function(){
        
        fechaFinView.forEach(elemento => elemento.classList.toggle("apagado"));
        
    })

    let notas = document.querySelector("#notas");
    let notasView = document.querySelectorAll(".notasView");

    notas.addEventListener("change", function(){

        notasView.forEach(elemento => elemento.classList.toggle("apagado"));
        
    })
    
    let encargado = document.querySelector("#encargado");
    let encargadoView = document.querySelectorAll(".encargadoView");

    encargado.addEventListener("change", function(){

        encargadoView.forEach(elemento => elemento.classList.toggle("apagado"));

        
    })


})