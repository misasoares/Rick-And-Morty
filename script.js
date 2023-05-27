  window.onload = (event)=>{
    previewCharacters()
    
  }


const api = axios.create({
    baseURL: "https://rickandmortyapi.com/api"
})

let page = 1;
let totalPages = 1;

function previewCharacters(){
    api
    .get(`/character/1`)
    .then((res)=>{
        const character = res.data
        console.log(character)
        
    
    })

}

function showCharacters(character){
    const cards = document.getElementById("cards");
    cards.innerHTML = "";

    characters.forEach((character) => {
        const card = document.createElement("div")
        card.classList.add("card")

        const img = document.createElement("img");
        img.src = character.image;
        img.alt = character.name;
        card.appendChild(img)

        api
        .get("/character/avatar/1.jpeg")
        .then((res)=>{
            const img = res.data
            img.innerHTML = `oi`
        })
    });

}
