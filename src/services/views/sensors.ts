import http from '../http';

export interface SensorsViewModel {
    sensors: SensorView[];
}

export interface SensorView {
    name: string;
    description: string;
    type: string;
    spec: any;
}

export interface SensorsViewAPI {
    get(): Promise<SensorsViewModel>
}

async function get(): Promise<SensorsViewModel> {
    const res = await http.get('/q/sensors')
    return res.data as SensorsViewModel
}

export const API = {
    get,
};
