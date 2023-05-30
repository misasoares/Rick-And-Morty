const api = axios.create({
  baseURL: 'https://rickandmortyapi.com/api',
});


const cards = document.getElementById("cards")

window.onload = function random(){
  api
  .get("/character")
  .then((res)=>{
    const characters = res.data.results
    characters.forEach(character => { 
      const random = document.getElementById("random")
      const episodeos = character.episode //array de episodeos (urls)
      
      const i = episodeos.length - 1;  //indice do ultimo episodeo
      const lastEp = episodeos[i];  //endpoint para o ultimo episodeo

      api.get(lastEp)  //faz a requisição para o episodeo
      .then((res)=>{
        const episodeo = res.data;
      
        random.innerHTML += `<div id="container"><div id="card"><p>Nome: ${character.name} <br> ${character.status} - ${character.species} <br> Última localização: <br> ${character.location.name} <br> Visto a última vez em: <br> Episódio ${episodeo.id}: ${episodeo.name}</p><img src="${character.image}" alt="" id="img"></div></div>`
      })
    });  
}) 
}

let page = 1
let next = ""
let prev = ""

async function search(event){
  event.preventDefault()
  document.getElementById("random").style.display="none"

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
    cards.innerHTML = ""
    characters.forEach(character => { 
    const episodeos = character.episode //array de episodeos (urls)
    
    const i = episodeos.length - 1;  //indice do ultimo episodeo
    const lastEp = episodeos[i];  //endpoint para o ultimo episodeo

    api.get(lastEp)  //faz a requisição para o episodeo
    .then((res)=>{
      const episodeo = res.data;
    
      cards.innerHTML += `<div id="card"><p>Nome: ${character.name} <br> ${character.status} - ${character.species} <br> Última localização: <br> ${character.location.name} <br> Visto a última vez em: <br> Episódio ${episodeo.id}: ${episodeo.name}</p><img src="${character.image}" alt="" id="img"></div>`
    })
  });
}


function nextPage(next){

  api
  .get(next)
  .then((res)=>{
    let characters = res.data.results
    populate(characters)
   
  })
}