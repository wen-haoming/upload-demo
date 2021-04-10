interface Options{
    method:string
    url:string
    headers?:any
    data:any
}

export const request = (options: Options):Promise<any> => {
    let defaultOptions = {
        method: 'GET',
        baseURL: 'http://localhost:8000',
        headers: {},
        data: {}
    }
     options = {...defaultOptions,...options,headers:{...defaultOptions.headers,...options.headers}}
     return new Promise((resolve,reject)=>{
         let xhr = new XMLHttpRequest()
         xhr.open(options.method,options.url)
         for(let key in options.headers){
            xhr.setRequestHeader(key,options.headers[key])
         }
         xhr.responseType = 'json'

         xhr.onreadystatechange = ()=>{
             if(xhr.readyState === 4 && xhr.status === 200){
                resolve(xhr.response)
             }else if(xhr.readyState === 4 && xhr.status !== 200){
                reject(xhr.response)
             }
         }
     })
}