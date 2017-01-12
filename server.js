var express=require('express');
var bodyParser=require('body-parser');
var cors=require('cors');

var app=new express();
app.use(bodyParser.json());
app.use(cors());

var router=express.Router();

router.get('/', function(req,res){
   res.json({message:'welcome to our api!'}) ;
});
app.use('/api',router);

var nodeadmin=require('nodeadmin');
app.use(nodeadmin(app));

var Sequelize=require("sequelize");

//init sequelize connexion
var sequelize = new Sequelize('associations1db', 'rautaclaudia', null, {
    dialect: 'mysql',
    host: '127.0.0.1',
    port:3306
});

//define entity-associations
  var Association=sequelize.define('associations',{
    nr_apt: {
        type: Sequelize.INTEGER,
        field: 'nr_apt'
    },
    name: {
        type: Sequelize.STRING,
        field: 'name'
    },
    surname: {
        type: Sequelize.STRING,
        field: 'surname'
    },
    number_of_people: {
        type: Sequelize.INTEGER,
        field: 'number_of_people'
    }
}, {
    timestamps: false
});


//create an association
app.post('/associations', function(request,response) {
   Association.create(request.body).then(function(association){
       Association.findById(association.id).then(function(association){
           response.status(201).send(association);
       });
   });
});

//read all
app.get('/associations', function(request,response){
    Association.findAll().then(function(associations){
        response.status(200).send(associations);
    });
});

//read one by id
app.get('/associations/:id', function(request,response){
   Association.findById(request.params.id).then(function(association){
       if(association){
           response.status(200).send(association);
       } else {
           response.status(404).send();
       }
   }) ;
});

//update one by id
app.put('/associations/:id',function(request,response){
   Association
        .findById(request.params.id)
        .then(function(association){
            if(association){
                association
                    .updateAttributes(request.body)
                    .then(function(){
                        response.status(200).send('updated');
                    })
                    .catch(function(error){
                        console.warn(error);
                        response.status(500).send('server error');
                    });
            } else {
                response.status(404).send();
            }
        });
});

//delete a list by id
app.delete('/associations/:id',function(request,response){
    Association
        .findById(request.params.id)
        .then(function(association) {
            if(association){
                association
                    .destroy()
                    .then(function(){
                        response.status(204).send();
                    })
                    .catch(function(error){
                        console.warn((error));
                        response.status(500).send('server error');
                    });
            } else {
                response.status(404).send();
            }
        });
});



// include static files in the admin folder
app.use('/admin', express.static('admin'));
app.listen(process.env.PORT);

