fetch('http://164.92.77.143:3030/apis/plan-accion',{
    method:'POST',
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({user:{id: 4,nombre: 'Francisco Lema',area: 1,puesto: 2,mail: 'franciscolemacr@gmail.com'}})
})
.then(api => {
    return api.json();
})
.then(api => {
    console.log(api)
})
