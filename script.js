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

function populateModal(id) {
  let modalTitle = document.getElementById('exampleModalLabel')
  let modalBody = document.getElementById('modal-body')

  let tilsca = api.get(`/character/${id}`).then((res) => {
    let personagem = res.data
    modalTitle.textContent = `${personagem.name}`
    console.log(personagem.name)
    modalBody.innerHTML = `<p>Status: ${personagem.status}</p>
    <p>Species: ${personagem.species}</p>
    <p>Gender: ${personagem.gender}</p>
    <p>Origin: ${personagem.origin.name}</p>
    <p>Location: ${personagem.location.name}</p>
    <p>Was seen in: ${personagem.episode.length} episodes</p>`

    // let dados = Object.entries(personagem)
    // for ([key, value] of dados) {
    //   let p = document.createElement("p")
    //   p.innerHTML = `${key}:< ${value}`
    //   modalBody.appendChild(p)
    // }
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
  col.style.width = '11rem'
  col.style.height = '370px'
  

  
  let card = document.createElement("div")
  card.classList.add('card')
  card.classList.add('border-success')
  card.classList.add('mb-5')
  


  let img = document.createElement("img")
  img.setAttribute('src', `${character.image}`)
  img.classList.add("card-img-top")


  let divText = document.createElement("div")
  divText.classList.add("card-body")
  divText.classList.add("d-flex")
  divText.classList.add("flex-column")
  divText.classList.add("justify-content-between")
  divText.classList.add("align-items-center")

 
  let title = document.createElement("h5")
  title.classList.add("card-title")
  title.classList.add("fw-bolder")
  title.classList.add("d-flex")
  title.classList.add("align-items-center")
  title.classList.add("text-center")
  title.classList.add("titleCard")
  title.innerHTML = `${character.name}`
  

  if (character.status == 'Alive') {
    
    divText.appendChild(add(`<span class="vivo card-text "></span>${character.status} - ${character.species}`))
  }

  if (character.status == 'Dead') {

    divText.appendChild(add(`<span class="morto card-text"></span>${character.status} - ${character.species}`))
  }

  if (character.status == 'unknown') {
  
    divText.appendChild(add(`<span class="desconhecido card-text"></span>${character.status} - ${character.species}`))
  }

  
  
  // divText.appendChild(add(`<span class="textGrey"> Última localização conhecida: </span> <br>${character.location.name}`))
  // divText.appendChild(add(`<span class="textGrey"> Visto pela última vez em: </span> <br>${episodeo.name}`))
  
  function tilscaa() {
    console.log("tilsca")
  }

  let btnModal = document.createElement("button")
  btnModal.classList.add("btn", "btn-success", "btnModal")
  btnModal.setAttribute("type", "button")
  btnModal.setAttribute("data-bs-toggle", "modal")
  btnModal.setAttribute("data-bs-target", "#exampleModal")
  btnModal.innerHTML = "Mais informações"
  btnModal.setAttribute("onclick", `populateModal(${character.id});`)
  
  divText.appendChild(btnModal)

  







  col.appendChild(card)
  card.appendChild(img)
  card.appendChild(title)
  card.appendChild(divText)

  

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


