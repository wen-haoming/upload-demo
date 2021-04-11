import express,{Request,Response,NextFunction} from 'express'
import logger from 'morgan'
import createError from 'http-errors'
import cors from 'cors'
import path from 'path'
import fs from 'fs-extra'
import multiparty from 'multiparty' // 文件上传
import StatusCodes from 'http-status-codes'
// StatusCodes.LENGTH_REQUIRED 500

const PUBLIC_DIR = path.resolve(__dirname,'../public')

let app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())
app.use(express.static(path.resolve(__dirname,'public')))

app.post('/upload', async (req,res,next)=>{
    let form = new multiparty.Form();
    form.parse(req,async(err,fileds,files)=>{
        if(err){
          return  next(err)
        }
        console.log(fileds);
        // server: { filename: [ '截屏2021-02-11 下午6.55.41.png' ] }
        console.log(files);
        // server: {
        // server:   chunk: [
        // server:     {
        // server:       fieldName: 'chunk',
        // server:       originalFilename: '截屏2021-02-11 下午6.55.41.png',
        // server:       path: '/var/folders/57/h6dvz9mj6jd57tgncbn1w4fw0000gn/T/XKK0_VJzhkONhcoekVP51Vt-.png',
        // server:       headers: [Object],
        // server:       size: 483862
        // server:     }
        // server:   ]
        // server: }
        let filename:string = fileds.filename[0]
        let chunk = files.chunk[0]

      try{
        await fs.move(chunk.path,path.resolve(PUBLIC_DIR,filename))
      }catch{
        return next('失败')
      }
        res.json({success:true})

    })
})

app.use((_req,_res,next)=>{
    next(createError(404))
})

app.use((error:any,_req:Request,res:Response,_next:NextFunction)=>{
    res.status(error.status ||StatusCodes.LENGTH_REQUIRED)
    res.json({
        success:false,
        error
    })
})

export default app;