class EventEmiiter {
    private _handlers: {
        [key:string]: Array<(...args: unknown[]) => void>
    };

    constructor () {
        this._handlers = {};
    }

    on<T>(eventName: string, listener: (...args: T[]) => void): void {
        if (!this._handlers[eventName]) {
            this._handlers[eventName] = [];
        }

        const typedListener = listener as (...args: unknown[]) => void;
        
        if (!this._handlers[eventName].includes(typedListener)) {
            this._handlers[eventName].push(typedListener);
        }
    }

    emit<T>(eventName: string, ...args: T[]): void {
        if (this._handlers[eventName]) {
            this._handlers[eventName].forEach(item => item(...args));
        }
    }

    off<T>(eventName: string, listener: (...args: T[]) => void): void {
        if (this._handlers[eventName]) {
            this._handlers[eventName] = this._handlers[eventName].filter(item => item !== listener)
        }
    }
}


const emmiter = new EventEmiiter();

const logData = (data: string) => console.log("log " + data);
const logData2 = (data: string) => console.log("2 log " + data);

const logData3 = (data: string) => console.log("3 log " + data);
const logData4 = (data: string) => console.log("4 log " + data);

emmiter.on("data", logData)
emmiter.on("data", logData2)

emmiter.on("dataAlert", logData3)
emmiter.on("dataAlert", logData4)

emmiter.emit("data", "logData")

emmiter.emit("dataAlert", "alertData")

emmiter.off("data", logData)
emmiter.off("data", logData2)

emmiter.off("dataAlert", logData3)
emmiter.off("dataAlert", logData4)

emmiter.emit("dataAlert", "не должно сработать")
emmiter.emit("data", "не должно сработать")