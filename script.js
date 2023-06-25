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


  let col = document.createElement("div")
  
  col.classList.add('col-12')
  // col.classList.add('offset-4')
  col.classList.add('col-md-6')
  col.classList.add('col-lg-4')
  col.classList.add('col-xxl-3')

  
  let card = document.createElement("div")
  card.classList.add('card')
  card.classList.add('border-success')
  card.classList.add('mb-5')
  card.style.maxWidth = '18rem'


  let img = document.createElement("img")
  img.setAttribute('src', `${character.image}`)
  img.classList.add("card-img-top")


  let divText = document.createElement("div")
  divText.classList.add("card-body")
  
 
  let title = document.createElement("h5")
  title.classList.add("card-title")
  title.innerHTML = `${character.name}`
  

  if (character.status == 'Alive') {
    
    divText.appendChild(add(`<span class="vivo card-text"></span>${character.status} - ${character.species}`))
  }

  if (character.status == 'Dead') {

    divText.appendChild(add(`<span class="morto card-text"></span>${character.status} - ${character.species}`))
  }

  if (character.status == 'unknown') {
  
    divText.appendChild(add(`<span class="desconhecido card-text"></span>${character.status} - ${character.species}`))
  }

  
  
  divText.appendChild(add(`<span class="textGrey"> Última localização conhecida: </span> <br>${character.location.name}`))
  divText.appendChild(add(`<span class="textGrey"> Visto pela última vez em: </span> <br>${episodeo.name}`))
  

  divText.appendChild(add(`<button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal">
  Mais informações
</button>
`))

let modal = document.createElement("div")
modal.classList.add("modal","fade")
modal.setAttribute("id","exampleModal")
modal.setAttribute("tabindex","-1")
modal.setAttribute("aria-labelledby","exampleModalLabel")
modal.setAttribute("aria-hidden","true")


let modalDialog = document.createElement("div")
modalDialog.classList.add("modal-dialog")
// modal.appendChild(modalDialog)


let modalContent = document.createElement("div")
modalContent.classList.add("modal-content")
// modal.appendChild(modalContent)

let modalHeader = document.createElement("div")
modalHeader.classList.add("modal-header")
// modalContent.appendChild(modalHeader)
  
let modalTitle = document.createElement("h1")
modalTitle.classList.add("modal-title", "fs-5")
modalTitle.setAttribute("id", "")
modalTitle.textContent = `${character.name}`
// modalHeader.appendChild(modalTitle)

let buttonClose = document.createElement("button")
buttonClose.classList.add("btn-close")
buttonClose.setAttribute("type", "button" )
buttonClose.setAttribute("data-bs-dismiss", "modal")
buttonClose.setAttribute("aria-label", "Close")
// modalHeader.appendChild(buttonClose)

let modalBody = document.createElement("div")
modalBody.classList.add("modal-body")
// modalContent.appendChild(modalBody)



  col.appendChild(card)
  card.appendChild(img)
  card.appendChild(title)
  card.appendChild(divText)
  divText.appendChild(modal)
 
  

  cards.appendChild(col)

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

