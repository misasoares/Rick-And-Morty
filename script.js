const api = axios.create({
    baseURL: 'https://rickandmortyapi.com/api',
  });




async function search(event){
event.preventDefault();
    const id =  document.getElementById("inputSearch").value
    api
   .get(`/character/${id}`)
   .then((res)=>{
    const character = res.data

    const cards = document.getElementById("cards")

    const ep = character.episode
    const lastEp = ep.slice(ep.length-1)

    const toString = JSON.stringify(lastEp)

    const toId = toString.substring(42,44)

    const toNumber = parseInt(toId)

    api
    .get(`/episode/${toNumber}`)
    .then((res)=>{
      const nameEp = res.data.name
      

      cards.innerHTML += `<div id="card"><p>Nome: ${character.name} <br> ${character.status} - ${character.species} <br> Última localização: <br> ${character.location.name} <br> Visto a última vez em: <br> Episódio ${toNumber}: ${nameEp}</p><img src="${character.image}" alt="" id="img"></div>`

   
    })
  })
}