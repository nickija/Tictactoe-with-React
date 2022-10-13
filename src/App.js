import React from "react";
import Box from "./components/Box"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  const [boxes, setBoxes] = React.useState(newBoxes())
  const [boxesLeft, setBoxesLeft]= React.useState([1, 2, 3, 4, 5, 6, 7, 8, 9])
  const [playerTurn, setPlayerTurn] = React.useState(true)

  const [lineScores, setLineScores] = React.useState([0, 0, 0, 0, 0, 0, 0, 0])
  const [foundWinner, setFoundWinner] = React.useState(false)
  const [winner, setWinner] = React.useState()
  const [score, setScore] = React.useState(JSON.parse(localStorage.getItem("score")) || [0, 0])


  const boxArray = boxes.map(item => <Box key={item.id} box={item} getPressed={() => getPressed(item.id)} foundWinner={foundWinner} />)

  function newBoxes(){    //INITIALIZES OR RESETS BOXES STATE
    const tempBoxArray = []
    for (let i = 1; i < 10; i++){ 
      tempBoxArray.push({id: i, value: "", isAlreadyPressed: false, winnerBox: false})
                                //o = http://cdn.onlinewebfonts.com/svg/img_155295.png
    }                           //x = https://cdn-icons-png.flaticon.com/512/109/109602.png
    
    return tempBoxArray
  }

  function getPressed(id){     //CALLED EVERY TIME USER CLICKS A BOX OR WHEN IT IS COMPUTER'S TURN FROM USEEFFECT
    updateLineScores(id)
    const icon = playerTurn ? "O" : 
    "X"
    const tempBoxes = boxes.map(box => (box.id === id ? {...box, value: icon, isAlreadyPressed: true} : box))
    setBoxes(prevState => tempBoxes)
    setBoxesLeft((prevState) => {return boxesLeft.filter(num => num !== id)})
    setPlayerTurn(prevTurn => !prevTurn)

    if (!boxesLeft.length && !foundWinner){
      toast.info("IT'S A DRAW", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });
      
    }
    
    
  }
  
  React.useEffect(() => { //when turn changes, check if pc should play
    checkIfWon()

    if(!foundWinner && !playerTurn){
      const pcMoveBoxId = getPcMove()
      getPressed(pcMoveBoxId)
    } 
  }, [playerTurn])

  function checkIfWon() {   //CHECKS IF THERE IS LINE WITH 3 PAIRS, IF YES->COLOURS THE WINNING LINE RED
    
    for (let i = 0; i<3; i++){
      if (boxes[i*3].value !=="" && boxes[i*3].value=== boxes[i*3+1].value && boxes[i*3].value === boxes[i*3 + 2].value){
        console.log("found winner HORIZONTAL")
        setFoundWinner(true)
        setWinner(!playerTurn)
        if(i===0){
          setBoxes(prevBoxes => prevBoxes.map(box => (((box.id === 1) || (box.id === 2) || (box.id === 3)) ? {...box, winnerBox: true} : box)))
        }else if(i===1){
          setBoxes(prevBoxes => prevBoxes.map(box => (((box.id === 4) || (box.id === 5) || (box.id === 6)) ? {...box, winnerBox: true} : box)))
        }else{
          setBoxes(prevBoxes => prevBoxes.map(box => (((box.id === 7) || (box.id === 8) || (box.id === 9)) ? {...box, winnerBox: true} : box)))
        }
        return
      }
      if (boxes[i].value !=="" && boxes[i].value === boxes[i + 3].value && boxes[i].value === boxes[i + 6].value){
        console.log("found winner VERTICAL")
        setFoundWinner(true)
        setWinner(!playerTurn)
        if(i===0){
          setBoxes(prevBoxes => prevBoxes.map(box => (((box.id === 1) || (box.id === 4) || (box.id === 7)) ? {...box, winnerBox: true} : box)))
        }else if(i===1){
          setBoxes(prevBoxes => prevBoxes.map(box => (((box.id === 2) || (box.id === 5) || (box.id === 8)) ? {...box, winnerBox: true} : box)))
        }else{
          setBoxes(prevBoxes => prevBoxes.map(box => (((box.id === 3) || (box.id === 6) || (box.id === 9)) ? {...box, winnerBox: true} : box)))
        }
        return
      }
    }

    if(boxes[0].value !=="" && boxes[0].value === boxes[4].value && boxes[0].value === boxes[8].value){
      console.log("found winner DIAGONAL")
      setFoundWinner(true)
      setWinner(!playerTurn)
      setBoxes(prevBoxes => prevBoxes.map(box => (((box.id === 1) || (box.id === 5) || (box.id === 9)) ? {...box, winnerBox: true} : box)))
      return
      
    }else if(boxes[2].value !=="" && boxes[2].value === boxes[4].value && boxes[2].value === boxes[6].value){
    
      console.log("found winner DIAGONAL")
      setFoundWinner(true)
      setWinner(!playerTurn)
      setBoxes(prevBoxes => prevBoxes.map(box => (((box.id === 3) || (box.id === 5) || (box.id === 7)) ? {...box, winnerBox: true} : box)))
      return
    }
    
    
  }
 
  function getPcMove(){    //DETECTS WHICH LINE SHOULD BE A PRIORITY FOR COMPUTER TO PRESS A BOX IN THAT LINE
    if (boxesLeft.includes(5)){
      return 5
    }else{
      let pcMoveId = boxesLeft[Math.floor(Math.random()*boxesLeft.length)] //random initializer move
      let lineFinderSpot = 0;
      if(lineScores.includes(2)){
        lineFinderSpot = lineScores.findIndex(num => num === 2)
      }else if(lineScores.includes(-2)){
        lineFinderSpot = lineScores.findIndex(num => num === -2)
      }else if(lineScores.includes(1)){
        lineFinderSpot = lineScores.findIndex(num => num === 1)
      }
      if(lineFinderSpot >=0){
        
        pcMoveId = getPossibleIds(lineFinderSpot)
      }
      
      return pcMoveId
    }

  }

  function updateLineScores(id){  //CALLED EVERY TIME A MOVE IS MADE BY ANYONE. UPDATES LINESCORES FOR CUMPUTER USE
    let tempLineScores = lineScores
    if(id===1){
      if(playerTurn){
        tempLineScores[0]--
        tempLineScores[3]--
        tempLineScores[6]--
      }
      else{
        tempLineScores[0]++
        tempLineScores[3]++
        tempLineScores[6]++
      }
    }else if(id===2){
      if(playerTurn){
        tempLineScores[0]--
        tempLineScores[4]--
      }
      else{
        tempLineScores[0]++
        tempLineScores[4]++
      }
    }else if(id===3){
      if(playerTurn){
        tempLineScores[0]--
        tempLineScores[5]--
        tempLineScores[7]--
      }
      else{
        tempLineScores[0]++
        tempLineScores[5]++
        tempLineScores[7]++
      }
    }else if(id===4){
      if(playerTurn){
        tempLineScores[1]--
        tempLineScores[3]--
      }
      else{
        tempLineScores[1]++
        tempLineScores[3]++
      }
    }else if(id===5){
      if(playerTurn){
        tempLineScores[1]--
        tempLineScores[4]--
        tempLineScores[6]--
        tempLineScores[7]--
      }
      else{
        tempLineScores[1]++
        tempLineScores[4]++
        tempLineScores[6]++
        tempLineScores[7]++
      }
    }else if(id===6){
      if(playerTurn){
        tempLineScores[1]--
        tempLineScores[5]--
      }
      else{
        tempLineScores[1]++
        tempLineScores[5]++
      }
    }else if(id===7){
      if(playerTurn){
        tempLineScores[2]--
        tempLineScores[3]--
        tempLineScores[7]--
      }
      else{
        tempLineScores[2]++
        tempLineScores[3]++
        tempLineScores[7]++
      }
    }else if(id===8){
      if(playerTurn){
        tempLineScores[2]--
        tempLineScores[4]--
      }
      else{
        tempLineScores[2]++
        tempLineScores[4]++
      }
    }else{//(id===9)
      if(playerTurn){
        tempLineScores[2]--
        tempLineScores[5]--
        tempLineScores[6]--
      }
      else{
        tempLineScores[2]++
        tempLineScores[5]++
        tempLineScores[6]++
      }
    }
    setLineScores(tempLineScores)

  }

  function getPossibleIds(lineSpot){  //CALLED FROM GETPCMOVE TO CHECK WHAT BOX MUST BE PRESSED IN A LINE. RETURNS ID OF A BOX
    if(lineSpot === 0 ){
      if(boxesLeft.includes(1)) return 1
      else if(boxesLeft.includes(2)) return 2
      else if(boxesLeft.includes(3)) return 3
      else
        return boxesLeft[Math.floor(Math.random()*boxesLeft.length)]
    }else if(lineSpot === 1 ){
      if(boxesLeft.includes(4)) return 4
      else if(boxesLeft.includes(5))return 5
      else if(boxesLeft.includes(6)) return 6
      else
        return boxesLeft[Math.floor(Math.random()*boxesLeft.length)]
    }else if(lineSpot === 2 ){
      if(boxesLeft.includes(7)) return 7
      else if(boxesLeft.includes(8)) return 8
      else if(boxesLeft.includes(9)) return 9
      else
        return boxesLeft[Math.floor(Math.random()*boxesLeft.length)]
    }else if(lineSpot === 3 ){
      if(boxesLeft.includes(1)) return 1
      else if(boxesLeft.includes(4)) return 4
      else if(boxesLeft.includes(7)) return 7
      else
        return boxesLeft[Math.floor(Math.random()*boxesLeft.length)]
    }else if(lineSpot === 4 ){
      if(boxesLeft.includes(2)) return 2
      else if(boxesLeft.includes(5)) return 5
      else if(boxesLeft.includes(8)) return 8
      else
        return boxesLeft[Math.floor(Math.random()*boxesLeft.length)]
    }else if(lineSpot === 5 ){
      if(boxesLeft.includes(3)) return 3
      else if(boxesLeft.includes(6)) return 6
      else if(boxesLeft.includes(9)) return 9
      else
        return boxesLeft[Math.floor(Math.random()*boxesLeft.length)]
    }else if(lineSpot === 6 ){
      if(boxesLeft.includes(1)) return 1
      else if(boxesLeft.includes(5)) return 5
      else if(boxesLeft.includes(9)) return 9
      else
        return boxesLeft[Math.floor(Math.random()*boxesLeft.length)]
    }else if(lineSpot === 7 ){
      if(boxesLeft.includes(3)) return 3
      else if(boxesLeft.includes(5)) return 5
      else if(boxesLeft.includes(7)) return 7
      else
        return boxesLeft[Math.floor(Math.random()*boxesLeft.length)]
    }

  }

  function resetBoard(){  //CALLED WHEN RESET BUTTON PRESSED, SETS EVERYTHING TO ORIGINAL VALUES
    setBoxes(newBoxes())
    setBoxesLeft([1, 2, 3, 4, 5, 6, 7, 8, 9])
    setFoundWinner(false)
    setLineScores([0, 0, 0, 0, 0, 0, 0, 0])
    setPlayerTurn(true)
    setWinner(false)
  }

  React.useEffect(() => { //DO THIS WHEN A WINNER IS FOUND
    if (!foundWinner) return

    if(winner){
      setScore(prevScore => [prevScore[0]++, prevScore[1]])
      toast.success('YOU WON!', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });
    }else{
      setScore(prevScore => [prevScore[0], prevScore[1]++])
      toast.error('YOU LOST', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });
    }
  }, [foundWinner])

  React.useEffect(() => {  //when score state updates, update score in localstorage
    if (score === [] || score === [null, null]){
      setScore([0, 0])
    }
    localStorage.setItem("score", JSON.stringify(score))//localstorage score
    console.log(score)
  }, [score])


  return (
    <div className="big-container">
      <div className="container">
        
        <h1 className="title">Play tic tac toe</h1>
        
        <div className="scores">
          <h2 className="score">YOU: {score[0]}</h2>
          <h2 className="score">COMPUTER: {score[1]}</h2>   
        </div>
        <div className="box-container">
          {boxArray}
        </div>
        <div className="button-container">
          <button className="reset-button" onClick={resetBoard}>Reset board</button>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}

export default App;
