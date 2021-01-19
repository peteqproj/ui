import React, { useState } from 'react';
import CardHeader from '@material-ui/core/CardHeader';
import TextField from '@material-ui/core/TextField';


interface IProps {
    title: string;
    new?: boolean;
    onUpdate(title: string): void;
}

export function TaskTitle(props: IProps) {
    const [editMode, setEditMode] = useState(props.new);
    const [taskTitle, setTaskTitle] = useState(props.title);
    if (editMode) {
        return (<CardHeader component={(rprops) => (
            <TextField 
            {...rprops}
            autoFocus
            placeholder="Name"
            onChange={(ev: any) => setTaskTitle(ev.target.value)}
            onBlur={() => {
                setEditMode(false)
                props.onUpdate(taskTitle)
            }}
            onKeyDown={(e: any) => {
                if(e.keyCode !== 13){ // 13 is enter
                    return;
                }
                setEditMode(false)
                props.onUpdate(taskTitle)
            }}
            value={taskTitle}
            fullWidth/>
        )} />)
    }
    return (<CardHeader title={taskTitle || 'Add task name'} onClick={() => setEditMode(true)}/>)
}