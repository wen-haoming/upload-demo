
import { ChangeEvent, memo, useEffect, useState } from 'react'
import { Row, Col, Input, Button, message } from 'antd'
import { request } from './utils'

function allowUpload(file: File) {
    let type = file.type
    let isValidFileTypes = ["image/jpeg", "image/png", "image/gif", "video/mp4"].includes(type)
    if (!isValidFileTypes) {
        message.error('不支持此类')
    }

    const isLessThan2G = file.size < 1024 * 1024 * 1024 * 2

    if (!isLessThan2G) {
        message.error('上传文件不能大于2G')
    }
    return isValidFileTypes && isLessThan2G
}

const Upload = () => {

    const [currentFile, setCurrentFile] = useState<File>()
    const [objectURL, setObjectURL] = useState<string>('')

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        let file: File = event.target.files![0]
        setCurrentFile(file)
    }

    useEffect(() => {
        if (!currentFile) return
        let reader = new FileReader()
        reader.onload = ()=>{ setObjectURL(reader.result as string) }
        reader.readAsDataURL(currentFile)
    }, [currentFile])


    const handleUpload = async () => {
        if (!currentFile) {
            return message.error('您尚未选择文件')
        }
        if (!allowUpload(currentFile)) {
            return message.error('暂不支持此类文件上传')
        }

        const formData = new FormData();
        formData.append('chunk', currentFile)
        formData.append('filename', currentFile.name)
      try{
        let result =  await request({
            url: '/upload',
            method: 'POST',
            data: formData
        })
        console.log(result)
        message.success('上传成功')
      }catch(e){
        message.error('上传失败')
      }
    }

    return <Row>
        <Col span={12}>
            <Input type="file" style={{ width: 300 }} onChange={handleChange} />
            <Button type="primary" onClick={handleUpload}>上传</Button>
        </Col>
        <Col span={12}>
            {
                objectURL && <img src={objectURL} width={300} />
            }
        </Col>
    </Row>
}

export default  memo(Upload)