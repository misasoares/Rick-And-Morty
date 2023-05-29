const api = axios.create({
    baseURL: 'https://rickandmortyapi.com/api',
  });



async function showCharacter(event){
event.preventDefault();
    const id =  document.getElementById("inputSearch").value
    api
   .get(`/character/${id}`)
   .then((res)=>{
    const character = res.data

    const image = document.getElementById("img")
    const cards = document.getElementById("cards")
    
    cards.innerHTML = `${JSON.stringify(character.name)}`
    image.src = `${character.image}`


   console.log(character.image)
   })
}