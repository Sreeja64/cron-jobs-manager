const statusCodes = require('../status_code')

const success = async(res,code,data)=>{
    try{
        const status = statusCodes[code]
        let res_obj = {status:status}
        if(data){
            res_obj.data = data;
        }
        return res.json(res_obj).status(status.code)
    }catch(ex){
        console.log(ex);
    }
   
};

const error = async(res,code)=>{
    try{
        const status = statusCodes[code]
        const res_obj = {status}
        return res.json(res_obj).status(status.code)
    }
    catch(ex){
        console.log(ex);
    }
};

module.exports = {
    success,
    error
}