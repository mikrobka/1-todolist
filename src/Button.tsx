import React, {memo} from "react";
import {Button} from "@mui/material";


type ButtonType = {
    title:string
    color:'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
    variant : 'text'| 'outlined' | 'contained'
    onClick:()=>void
}
export const ButtonWithMemo = memo((props:ButtonType) => {
    return (
        <Button variant={props.variant}
                onClick={props.onClick}
                color={props.color}>{props.title}
        </Button>
    )
})