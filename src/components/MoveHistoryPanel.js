import React from "react";

export default function MoveHistoryPanel(props) {
    // alert(props.game.fen())
    // let rows = [];
    // for (let i = 1; i <= props.game.history().length; i += 2) {
    //     let inner = [<span>{props.game.history()[i - 1].ply}</span>, <span>{props.game.history()[i - 1].san}</span>];
    //     if (i + 1 <= props.game.history().length) {
    //         inner.push(<span>{props.game.history()[i].san}</span>);
    //     }
    //     rows.push(<div className="flex flex-1 justify-around">{inner}</div>);
    // }
    return (
        <div className="flex bg-slate-600 rounded flex-col">
            {props.fen}
            {props.pgn}
        </div>
    );
}