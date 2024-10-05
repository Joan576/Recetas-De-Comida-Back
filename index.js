//crear cosntante app que sera requerida y la ruta 

const app = require('./src/app');

//inicializar nuestro servirdo 

app.listen(app.get('port'), ()=> {

    console.log("servidor escuchando en el puerto", app.get('port'));

});