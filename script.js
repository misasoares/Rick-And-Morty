const api2 = axios.create({
  baseURL:""
})

const api = axios.create({
  baseURL: 'https://rickandmortyapi.com/api',
});


let next = ""
let prev = ""

window.onload = () => {
  api
  .get("/character")
  .then((res)=>{
    const characters = res.data.results
    next = res.data.info.next
    prev = res.data.info.prev

    populate(characters)
    console.log(`next: ${next}, prev: ${prev}`)
    start()
}) 
}


async function search(event){
  event.preventDefault()

  const name =  document.getElementById("inputSearch").value
  api.get(`/character/?name=${name}`)
  .then((res)=>{

    next = res.data.info.next
    prev = res.data.info.prev

    const characters = res.data.results;  //array de personagens que contém o nome pesquisado

    populate(characters)

  })
}

function populate(characters){
  let cards = document.getElementById("cards")

  cards.innerHTML = ``

  characters.forEach(character => { 
    const episodeos = character.episode //array de episodeos (urls)
    
    const i = episodeos.length - 1;  //indice do ultimo episodeo
    const lastEp = episodeos[i];  //endpoint para o ultimo episodeo

    api.get(lastEp)  //faz a requisição para o episodeo
    .then((res)=>{
      const episodeo = res.data;

      addCard(character, episodeo)  //adiciona o card

      // cards.innerHTML += `<div id="card"><p>Nome: ${character.name} <br> 
      // ${character.status} - ${character.species} <br> 
      // Última localização: 
      // <br> ${character.location.name} 
      // <br> Visto a última vez em: 
      // <br> Episódio ${episodeo.id}: ${episodeo.name}</p>
      // <img src="${character.image}" alt="" id="img"></div>`
    })
  });
}

function start(){
  const btnNext = document.getElementById("btnNext")
  const btnPrev = document.getElementById("btnPrev")

  btnNext.addEventListener('click', () => {
    if (!next) return console.log("não há paginas anteriores a essa!"); 
    nextPage(next)
  })
  btnPrev.addEventListener('click', () => {
    if (!prev) return console.log("não há paginas subsequentes a essa!"); ; 
    prevPage(prev)
  })
}

function nextPage(url){
  api2
  .get(url)
  .then((res)=>{
    next = res.data.info.next;
    prev = res.data.info.prev;

    let characters = res.data.results

    console.log(`next: ${next}, prev: ${prev}`)

    populate(characters)
   
    window.scrollTo(0,0);
  })
}

function prevPage(url){
  api2
  .get(url)
  .then((res)=>{
    next = res.data.info.next;
    prev = res.data.info.prev;

    let characters = res.data.results

    console.log(`next: ${next}, prev: ${prev}`)

    populate(characters)

    window.scrollTo(0,0);
  })
}

function addCard(character, episodeo){
  let cards = document.getElementById("cards")

  function add(string) {
    p = document.createElement("p")
    p.innerHTML = string;
    return p;
  }

  let card = document.createElement("div")
  card.classList.add('card')

  let img = document.createElement("img")
  img.setAttribute('src', `${character.image}`)

  let divText = document.createElement("div")
  
  divText.appendChild(add(`Nome: ${character.name}`))
  divText.appendChild(add(`Status: ${character.status}`))
  divText.appendChild(add(`Espécie: ${character.species}`))
  divText.appendChild(add(`Ultima localização: ${character.location.name}`))
  divText.appendChild(add(`Visto pela ultima vez: episódeo ${episodeo.id} (${episodeo.name})`))

  card.appendChild(img)
  card.appendChild(divText)

  const paragrafo = divText.children[1];

  if (character.status == 'Alive') paragrafo.classList.add("vivo")
  if (character.status == 'Dead') paragrafo.classList.add("morto")

  
  cards.appendChild(card)
}