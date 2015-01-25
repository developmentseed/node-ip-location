'use strict';

var expect = require('Chai').expect;
var request = require('request');
var sinon = require('sinon');
require('should');

var getLocation = require('../app');

var s; // Holder for sinon mocks
describe('Application', function() {
  describe('#getLocation()', function() {
    before(function(done) {
      s = sinon
        .stub(request, 'get')
        .yields(null, null, null);    
        done();
    });

    after(function(done) {
      request.get.restore();
      done();
    });

    it('should fail if not given an ip', function (done) {
      getLocation('', function(err, json) {
        expect(err).to.exist();
        expect(json).to.not.exist();
        request.get.called.should.be.equal(false);
        done();
      });
    });

     it('should pass along an error from the api', function (done) {
      s.yields('error', null, null);
      getLocation('1', function(err, json) {
        expect(err).to.exist();
        expect(json).to.not.exist();
        request.get.called.should.be.equal(true);
        done();
      });
    }); 

    it('should return data accurately from api', function (done) {
      var data = '[["Washington","District Of Columbia","United States","Comcast Cable Communications Inc.","38.895110","-77.036370","US",""]]';
      s.yields(null, null, data);
      getLocation('1', function(err, json) {
        expect(err).to.not.exist();
        expect(json).to.exist();
        request.get.called.should.be.equal(true);
        expect(json).to.equal(data);
        done();
      });    
    });
  });

  // These endpoint tests rely on the fact that we can mock the request.get
  // method like above, but can test the endpoints locally with just a plain
  // request(). Hopefully this stays true or the tests will break.
  describe('endpoints', function() {
    before(function(done) {
      s = sinon
        .stub(request, 'get')
        .yields(null, null, null);    
        done();
    });

    after(function(done) {
      request.get.restore();
      done();
    });

    it('should return nothing for root request', function (done) {
      request('http://localhost:5000', function (err, res, body) {
        expect(err).to.not.exist();
        expect(body).to.equal('nothing to see here\n');
        request.get.called.should.be.equal(false);
        done();
      });
    });

    it('should gracefully handle bad json from server', function (done) {
      s.yields(null, null, '<html>d</html>');
      request('http://localhost:5000/location', function (err, res, body) {
        expect(err).to.not.exist();
        expect(body).to.equal('{ error: "Error parsing Address server data." }');
        request.get.called.should.be.equal(true);
        done();
      });
    });

    it('should return message when max limits reached', function (done) {
      s.yields(null, null, JSON.stringify('MSG: MAX CONNECTIONS REACHED'));
      request('http://localhost:5000/location', function (err, res, body) {
        expect(err).to.not.exist();
        expect(body).to.equal('{ error: "Ruh roh, over API limit." }');
        request.get.called.should.be.equal(true);
        done();
      });
    });

    it('should return nice data when the api gives it to us', function (done) {
      var data = [['Washington','District Of Columbia','United States',
                   'Comcast Cable Communications Inc.','38.8','-77.0','US','']];
      s.yields(null, null, JSON.stringify(data));
      request('http://localhost:5000/location', function (err, res, body) {
        expect(err).to.not.exist();
        expect(body).to.equal('{"location":{"lat":"38.8","lon":"-77.0"}}');
        request.get.called.should.be.equal(true);
        done();
      });
    });  
  });
});