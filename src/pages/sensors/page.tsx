import React, { useEffect, useState } from 'react'
import { Table as TableComponent } from '../../components/table';
import DeleteIcon from '@material-ui/icons/Delete';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import { SensorsViewAPI, SensorView } from '../../services/views/sensors';

interface IProps {
    data: string;
    SensorsViewAPI: SensorsViewAPI;
}

interface RowItem extends SensorView {};

export function SensorsPage(props: IProps) {
    const [rows, updateRows] = useState<RowItem[]>([]);
    useEffect(() => {
        const fetch = async () => {
          const res = await props.SensorsViewAPI.get()
          updateRows(res.sensors)
        };
        fetch();
      }, []);
    return ( <TableComponent
        columns={[
          { title: "Name" },
          { title: "Description" },
          { title: "Type" },
          { title: "Spec" },
        ]}
        data={rows.map(r => {
          return {
            data: [
              {
                content: r.name,
              },
              {
                content: r.description,
              },
              {
                content: r.type,
              },
              {
                content: r.spec,
              },
            ],
            menu: [
                {
                    icon: PlayCircleFilledIcon,
                    onClick: (i: number) => {},
                    title: 'Run Manually'
                },
                {
                icon: DeleteIcon,
                onClick: (i: number) => {},
                title: 'Delete'
                },
            ],
          }
        })}
      /> )
}