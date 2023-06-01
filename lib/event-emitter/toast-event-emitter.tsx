import EventEmitter from 'events';

export const toastEventEmitter = new EventEmitter();

export interface PayloadToastEventEmitter {
    message: string;
    type: "success" | "danger" | "warning";
    duration?: number;
}