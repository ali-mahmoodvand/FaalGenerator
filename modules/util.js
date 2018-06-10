/**
 * Created by ali on 6/5/18.
 */
module.exports={
    uploader:(filepath,url,cb)=>{
        var r = request.post(url, function optionalCallback (err, httpResponse, body) {
            cb(err,body)

        })
        var form = r.form()
        form.append('newapk', fs.createReadStream(filepath))
    }
}