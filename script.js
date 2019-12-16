const side = 4
const total = side**2

let empty
let count

/*******************
Chip generating block
********************/
const neighbours = index => {
  let neighbours = [];
  if (index % side) neighbours.push(index - 1) //left
  if ((index + 1) % side) neighbours.push(index + 1) //right
  if (index >= side ) neighbours.push(index - side) //top
  if (index < total - side) neighbours.push(index + side) //bottom
    
  return neighbours
}

class Chip {
  constructor(index, clickHandler) {
    this.index = index
    this.meClicked = () => clickHandler(index)
    this.neighbours = neighbours(index)
    
    this.chipDiv = document.createElement("div")
    this.chipDiv.classList.add("chip")    
    this.p = document.createElement("p")
    this.chipDiv.appendChild(this.p)    
   }
  
  get HTMLel() {
    return this.chipDiv
  }
  
  get value() {
    return this.p.innerText
  }
  
  get inPlace(){
    return this.value == (this.index + 1) % total
  }
  
  setValue(value) {
    this.p.innerText = value
    value ? this.chipDiv.classList.remove("invisible") : 
              this.chipDiv.classList.add("invisible")
  }
  
  setActive() {
    this.chipDiv.classList.add("active")
    this.chipDiv.addEventListener('click', this.meClicked )
  }
  
  setInactive() {
    this.chipDiv.classList.remove("active")
    this.chipDiv.removeEventListener('click', this.meClicked )
  }  
}


/*************************
Random array permutation and 
check for solvability block 
**************************/

//http://mathworld.wolfram.com/15Puzzle.html
 const isSolvable = rArray => {
   let indexOfEmpty = rArray.indexOf(0) 
   let testArray = Array.from(rArray)
   testArray.splice(indexOfEmpty, 1)
   let test = Math.floor(indexOfEmpty/side) // row index of empty, starting from 0!
   
   for (var i=0; i<testArray.length-1; i++){
     test += testArray.slice(i+1).filter(el => el < testArray[i]).length
   }
   return test % 2 
 }

const randomArray = length => {
  let tryArray = Array.from(Array(length), (e,i) =>({index:i, ran:Math.random()}))
    .sort((a,b) => a.ran - b.ran)
    .map(e => e.index)
  return isSolvable(tryArray) ? tryArray : randomArray (length)
}

/******************
Gamefield block 
******************/

const allChips = Array.from(Array(total), (_, index) => new Chip(index, move))

const createGameField = () => {
  let gameField = document.getElementById("gameField")
  allChips.forEach(el => gameField.appendChild(el.HTMLel))
  restart()
}

const restart = () => {
  randomArray(total).forEach((value, index) => {
    let active = allChips[index].setValue(value)
    if (!value) setEmpty(index)
  })
  count = 0
  gameCount(true)
}

/****************
Game action block
****************/
function move (clicked) {
  count++
  allChips[empty].setValue(allChips[clicked].value)
  setEmpty(clicked)
  gameCount()
}

function setEmpty(newEmpty){
  empty = newEmpty
  allChips[empty].setValue(0)
  
  let neighboursOfEmpty = allChips[empty].neighbours
  allChips.forEach(chip => neighboursOfEmpty.includes(chip.index) 
                   ? chip.setActive() : chip.setInactive())
 }


function gameCount(){
  const indicator = document.getElementById("indicator")
  
  let solved = allChips.every(chip => chip.inPlace)
  indicator.innerHTML = `${solved ? '<b>Amazing!</b><br><br>' :''} Number of moves: ${count}`
}
/***********************/

document.body.onload = createGameField