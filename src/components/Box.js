import React from 'react'


export default function Box(props){
    const styles = {
        pointerEvents: (props.box.isAlreadyPressed || props.foundWinner) && "none",
        backgroundColor: props.box.winnerBox && "red"

    }

    const imageSource = props.box.value !== "" && (props.box.value === "X"  ? "https://cdn-icons-png.flaticon.com/512/109/109602.png" : "http://cdn.onlinewebfonts.com/svg/img_155295.png")
    
    return (
        <div style={styles} className='box' onClick={props.getPressed}>
            
            <img src={imageSource} width="100px"  alt=""/>

        </div>
    )
}