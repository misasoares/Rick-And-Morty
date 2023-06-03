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
  img.classList.add("imgCard")

  let divText = document.createElement("div")
  divText.classList.add("infoCharacter")
  
  divText.appendChild(add(`${character.name}`))

  if (character.status == 'Alive') {
    
    divText.appendChild(add(`<span class="vivo"></span>${character.status} - ${character.species}`))
  }

  if (character.status == 'Dead') {

    divText.appendChild(add(`<span class="morto"></span>${character.status} - ${character.species}`))
  }

  if (character.status == 'unknown') {
  
    divText.appendChild(add(`<span class="desconhecido"></span>${character.status} - ${character.species}`))
  }
  
  divText.appendChild(add(`<span class="textGrey"> Última localização conhecida: </span> <br>${character.location.name}`))
  divText.appendChild(add(`<span class="textGrey"> Visto pela última vez em: </span> <br>${episodeo.name}`))

  card.appendChild(img)
  card.appendChild(divText)

  let name = divText.children[0];
  if (character.name) name.classList.add("name")

  let status = divText.children[1]
  if (character.status) status.classList.add("status")
  
  
  
  
  let location = divText.children[2]
  if (character.location.name) location.classList.add("location")
  
  let ep = divText.children[3]
  if (episodeo.name) ep.classList.add("episodeo")
  
  

  cards.appendChild(card)

}

infoFooter()

function infoFooter(){
  api
  .get(`/character`)
  .then((res)=>{
    const qtdPersonagensData = res.data.info.count
    document.getElementById("qtdPersonagens").innerHTML = `PERSONAGENS: ${qtdPersonagensData}`
  })

  api.get(`/location`)
  .then((res)=>{
    const qtdLocalizacoesData = res.data.info.count
    document.getElementById("qtdLocalizacoes").innerHTML = `LOCALIZAÇÕES: ${qtdLocalizacoesData}`
  })

  api
  .get(`/episode`)
  .then((res)=>{
    const qtdEpisodiosData = res.data.info.count
    document.getElementById("qtdEpisodios").innerHTML = `EPISÓDIOS: ${qtdEpisodiosData}`
  })
}