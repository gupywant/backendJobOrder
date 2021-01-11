let database = {
    url:'mongodb://127.0.0.1:27017',
    options:{
        ha: true,
        dbName: 'RestApi',
        useFindAndModify: false,
        //autoReconnect:true,
        useUnifiedTopology: true,
        useNewUrlParser:true
    }
};

module.exports =  database;