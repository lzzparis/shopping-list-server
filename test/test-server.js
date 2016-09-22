var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');

var should = chai.should();
var app = server.app;
var storage = server.storage;

chai.use(chaiHttp);

debugger
describe('Shopping List', function() {
    it('should list items on get',function(done){
			chai.request(app)
				.get('/items')
				.end(function(err, res){
					res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.should.have.length(3);
          res.body[0].should.be.a('object');
          res.body[0].should.have.property('id');
          res.body[0].should.have.property('name');
          res.body[0].id.should.be.a('number');
          res.body[0].name.should.be.a('string');
          res.body[0].name.should.equal('Broad beans');
          res.body[1].name.should.equal('Tomatoes');
          res.body[2].name.should.equal('Peppers');
					done();
	
				});
		});
    it('should add an item on post when id exists', function(done){
      chai.request(app)
        .post('/items')
        .send({'name': 'Kale'})
        .end(function(err, res) {
          should.equal(err, null);
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('name');
          res.body.should.have.property('id');
          res.body.name.should.be.a('string');
          res.body.id.should.be.a('number');
          res.body.name.should.equal('Kale');
          storage.items.should.be.a('array');
          storage.items.should.have.length(4);
          storage.items[3].should.be.a('object');
          storage.items[3].should.have.property('id');
          storage.items[3].should.have.property('name');
          storage.items[3].id.should.be.a('number');
          storage.items[3].name.should.be.a('string');
          storage.items[3].name.should.equal('Kale');
          done();
        });
		});

		it('should fail gracefully for invalid body during post', function(done){
			chai.request(app)
			.post('/items')
			.send({'height':'60in'})
			.end(function(err, res){
				res.should.have.status(400);
				res.text.should.equal("Bad Request");
				storage.items[2].name.should.equal("Peppers");
				storage.items[2].id.should.equal(2);
				done();
			});
		});

    it('should edit an item on put',function(done){
			chai.request(app)
			.put('/items/3')
			.send({'name':'potatoes','id':3})
			.end(function(err, res){
				should.equal(err,null);
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('name');
				res.body.should.have.property('id');
				res.body.name.should.be.a('string');
				res.body.id.should.be.a('number');
				res.body.name.should.equal('potatoes');
				storage.items.should.be.a('array');
				storage.items.should.have.length(4);
				storage.items[3].name.should.equal('potatoes');
				storage.items[3].id.should.equal(3);
				done();
			});	
		});
		it('should fail gracefully for put with no id');
		it('should use the body ID when it differs from the endpoint id',function(done){
			chai.request(app)
			.put('/items/3')
			.send({'name':'bananas','id':2})
			.end(function(err, res){
				should.equal(err, null);
				res.should.have.status(200);
				res.body.name.should.equal('bananas');
				res.body.id.should.equal(2);
				storage.items[2].name.should.equal('bananas');
				storage.items[2].id.should.equal(2);
				storage.items[3].name.should.equal('potatoes');
				storage.items[3].id.should.equal(3);
				done();	
			});
		});
		it('should create a new item when ID doesn\'t exist in put',function(done){
			chai.request(app)
			.put('/items/75')
			.send({'name':'kiwi','id':75})
			.end(function(err, res){
				should.equal(err, null);
				res.should.have.status(200);
				res.body.name.should.equal('kiwi');	
				res.body.id.should.equal(75);	
				storage.items.should.have.length(5);
				storage.items[4].name.should.equal('kiwi');	
				storage.items[4].id.should.equal(75);	
				done();
			});
		});
		it('should fail gracefully for bad JSON during a put');

		it('should fail gracefully for invalid body during put');
    it('should delete an item on delete',function(done){
			chai.request(app)
			.delete('/items/3')
			.end(function(err, res){
				should.equal(err, null);
				res.should.have.status(200);
				storage.items.should.have.length(4);
				storage.items[0].name.should.equal("Broad beans");
				storage.items[0].id.should.equal(0);
				storage.items[1].name.should.equal("Tomatoes");
				storage.items[1].id.should.equal(1);
				storage.items[2].name.should.equal("bananas");
				storage.items[2].id.should.equal(2);
				storage.items[3].name.should.equal("kiwi");
				storage.items[3].id.should.equal(75);
				done();
			});
		});
		it('should fail gracefully on delete with no ID',function(done){
			chai.request(app)
			.delete('/items/')
			.end(function(err, res){
				res.should.have.status(404);
				res.text.should.equal("Not Found");
        storage.items.should.have.length(4);
        storage.items[0].name.should.equal("Broad beans");
        storage.items[0].id.should.equal(0);
        storage.items[1].name.should.equal("Tomatoes");
        storage.items[1].id.should.equal(1);
        storage.items[2].name.should.equal("bananas");
        storage.items[2].id.should.equal(2);
        storage.items[3].name.should.equal("kiwi");
        storage.items[3].id.should.equal(75);
				done();
			});
		});
		
		it('should fail gracefully on delete with nonexistent ID', function(done){
			chai.request(app)
			.delete('/items/-1')
			.end(function(err, res){
        res.should.have.status(404);
        res.body.status.should.equal("ERROR");
        storage.items.should.have.length(4);
        storage.items[0].name.should.equal("Broad beans");
        storage.items[0].id.should.equal(0);
        storage.items[1].name.should.equal("Tomatoes");
        storage.items[1].id.should.equal(1);
        storage.items[2].name.should.equal("bananas");
        storage.items[2].id.should.equal(2);
        storage.items[3].name.should.equal("kiwi");
        storage.items[3].id.should.equal(75);
        done();


			});
		});
});
