import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import { RouteComponentProps } from "react-router-dom";
import DoneIcon from '@material-ui/icons/Done';
import UndoIcon from '@material-ui/icons/Undo';
import { Table, RowMenuItem } from './../../components/table';
import { Fab } from './../../components/fab';
import { Task as TaskComponent } from './../../components/task/task';
import { FullScreenDialog } from './../../components/fullscreen-dialog';
import { ProjectAPI } from './../../services/project'
import { Task, TaskAPI } from './../../services/tasks'
import { List, ListAPI } from './../../services/list'
import { ProjectViewAPI, ProjectView } from './../../services/views/project'
import { Progress } from './progress';

const useStyles = makeStyles({
  root: {
    display: 'flex',
  },
  content: {
    width: '100%'
  },
  media: {
    height: 320,
    width: 320
  },
});


interface IProps extends RouteComponentProps {
  id?: string;
  ProjectAPI: ProjectAPI;
  ProjectViewAPI: ProjectViewAPI;
  TaskAPI: TaskAPI;
  ListAPI: ListAPI;
}

export function ProjectPage(props: IProps) {
  const classes = useStyles();
  const projectId = (props.match.params as any)['id'];
  const [lists, updateLists] = useState<List[]>([])
  const [state, setState] = useState({
    project: {
      metadata: {
        name: '',
        id: '',
        description: '',
      },
      spec: {
        tasks: [],
        color: '',
        imageUrl: '',
      }
    },
    tasks:[],
  } as ProjectView);
  useEffect(() => {
    const fetch = async () => {
      const prj = await props.ProjectViewAPI.get(projectId)
      console.log(prj)
      setState(prj)
      const l = await props.ListAPI.list()
      updateLists(l);
    }
    fetch();

  }, [props.ProjectAPI, projectId]);

  return (
    <Card className={classes.root} >
      <CardContent className={classes.content}>
        <CardHeader component={() => (<Chip style={{ width: '70px', backgroundColor: state.project.spec.color }} />)} />
        <Typography gutterBottom variant="h3" component="h2">
          {state.project.metadata.name}
        </Typography>
        <Typography variant="body1" color="textSecondary" component="p">
          {state.project.metadata.description} {calculateCompleted(state.tasks)} / {state.project.spec.tasks.length}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          <Progress value={calculateProgress(state.tasks)} />
          <Table
            columns={[{ title: 'Name' }, { title: 'Description' }, { title: 'Status' }]}
            data={
              state.tasks.map(t => ({
                data: [
                  { content: t.metadata.name },
                  { content: t.metadata.description },
                  { content: t.spec.completed ? 'Completed' : '' },
                ],
                menu: [
                  makeTaskCompletionButton(t, async (index: number, action: string) => {
                    if (action === 'Reopen') {
                      await props.TaskAPI.reopen(t.metadata.id);
                    }

                    if (action === 'Complete') {
                      await props.TaskAPI.complete(t.metadata.id);
                    }
                    const view = await props.ProjectViewAPI.get(projectId);
                    setState(view);
                  })
                ],
              }))
            }
          />
        </Typography>
      </CardContent>
      {state.project.spec.imageUrl !== '' && <CardMedia
        className={classes.media}
        image={state.project.spec.imageUrl}
        title="Contemplative Reptile"
      />}
      <Fab
        includeFade={false}
        modal={
          <FullScreenDialog
            onClose={() => console.log('closed')}
            component={
              <TaskComponent
                onChange={async () => {
                  const view = await props.ProjectViewAPI.get(projectId);
                  setState(view);
                }}
                defaultProject={{ name: state.project.metadata.name, id: state.project.metadata.id }}
                projects={[
                  { name: state.project.metadata.name, id: state.project.metadata.id }
                ]}
                lists={lists.map(l => ({ name: l.metadata.name, id: l.metadata.id }))}
                new={true}
                task={{ metadata: { id: '', name: '', description: '' }, spec: { completed: false }}}
                TaskAPI={props.TaskAPI}
                ListAPI={props.ListAPI}
                ProjectAPI={props.ProjectAPI}
              />
            }
          />
        }
      />
    </Card>
  );
}

function calculateProgress(tasks: Task[]): number {
  const completed = calculateCompleted(tasks);
  const total = tasks.length;
  return (completed / total) * 100
}

function calculateCompleted(tasks: Task[]): number {
  return tasks.reduce((acc, curr) => {
    if (curr.spec.completed) {
      return acc + 1
    }
    return acc;
  }, 0)
}

function makeTaskCompletionButton(task: Task, onClick: (index: number, action: string) => void): RowMenuItem {
  const icon = task.spec.completed ? UndoIcon : DoneIcon;
  const action = !task.spec.completed ? 'Complete' : 'Reopen';
  return {
    title: action,
    icon: icon,
    onClick: (index: number) => onClick(index, action),
  };
}  
