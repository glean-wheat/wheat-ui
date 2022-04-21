export class ProxySandBox{
    proxyWindow;
    isRunning = false;
    active(){
        this.isRunning = true;
    }
    inactive(){
        this.isRunning = false;
    }
    // 更多请参考 https://github.com/kuitos/import-html-entry/blob/09cc30adb60317556ac35b2d58e08a8398d75007/src/index.js#L54
    bindCode(code) {
        window.proxyWindow = this.proxyWindow
        // TODO 通过 strictGlobal 方式切换 with 闭包，待 with 方式坑趟平后再合并
        return `;(function(window){with(window){${code}}}).bind(window.proxyWindow)(window.proxyWindow, window.proxyWindow, window.proxyWindow);`
    }
    constructor(){
        const microAppWidow = Object.create(null);
        this.proxyWindow = new Proxy(microAppWidow,{
            set:(target, prop, value)=>{
                if(this.isRunning){
                    target[prop] = value;
                    Object.assign(microAppWidow, {[prop]: value})
                }
                return value;
            },
            get:(target, prop)=>{
                return  prop in target ? microAppWidow[prop] : window[prop];
            }
        });
    }
}