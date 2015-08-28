var gutil = require("gulp-util"),
    should = require("should"),
    Tpl = require("../index"),
    fs = require("fs"),
    vm = require("vm");

describe('Tplize', function() {

    describe('Building html', function() {

        it('should build proper html for tag with selector, attributes and contentFn defined', function(done) {
            var tpl = new Tpl(function(_) {
                _.div('#div-id.div-class1.div-class2', {
                    'data-name': 'DIV'
                }, function() {});
            });
            String(tpl.toHtml()).should.equal('<div id="div-id" class="div-class1 div-class2" data-name="DIV"></div>');
            done();
        });

        it('should build proper html for tag with selector, attributes but no contentFn defined', function(done) {
            var tpl = new Tpl(function(_) {
                _.div('#div-id.div-class1.div-class2', {
                    'data-name': 'DIV'
                });
            });
            String(tpl.toHtml()).should.equal('<div id="div-id" class="div-class1 div-class2" data-name="DIV"></div>');
            done();
        });

        it('should build proper html for tag with selector and contentFn but no attributes defined', function(done) {
            var tpl = new Tpl(function(_) {
                _.div('#div-id.div-class1.div-class2', function() {});
            });
            String(tpl.toHtml()).should.equal('<div id="div-id" class="div-class1 div-class2"></div>');
            done();
        });

        it('should build proper html for tag with only attributes and contentFn defined', function(done) {
            var tpl = new Tpl(function(_) {
                _.div({
                    'data-name': 'DIV'
                }, function() {});
            });
            String(tpl.toHtml()).should.equal('<div data-name="DIV"></div>');
            done();
        });

        it('should build proper html for tag with string instead of contentFn defined', function(done) {
            var tpl = new Tpl(function(_) {
                _.div('#div-id.div-class1.div-class2', {
                    'data-name': 'DIV'
                }, 'This is text');
            });
            String(tpl.toHtml()).should.equal(
                '<div id="div-id" class="div-class1 div-class2" data-name="DIV">This is text</div>');
            done();
        });

        it('should build proper html for tag with only selector defined', function(done) {
            var tpl = new Tpl(function(_) {
                _.div('#div-id.div-class1.div-class2');
            });
            String(tpl.toHtml()).should.equal('<div id="div-id" class="div-class1 div-class2"></div>');
            done();
        });

        it('should build proper html for tag with only contentFn defined', function(done) {
            var tpl = new Tpl(function(_) {
                _.div(function() {});
            });
            String(tpl.toHtml()).should.equal('<div></div>');
            done();
        });

        it('should build proper html for tag with only attributes defined', function(done) {
            var tpl = new Tpl(function(_) {
                _.div({
                    'data-name': 'DIV'
                });
            });
            String(tpl.toHtml()).should.equal(
                '<div data-name="DIV"></div>');
            done();
        });

        it('should build proper html for tag with multiple child nodes', function(done) {
            var tpl = new Tpl(function(_) {
                _.div('#div-id.div-class1.div-class2', {
                    'data-name': 'DIV'
                }, function() {
                    _.span('#span-id.span-class', {
                        'title': 'span title'
                    }, 'Span inner text');
                });
            });
            String(tpl.toHtml()).should.equal(
                '<div id="div-id" class="div-class1 div-class2" data-name="DIV">' +
                '<span id="span-id" class="span-class" title="span title">Span inner text</span>' +
                '</div>');
            done();
        });

        it('should build proper html for txt call', function(done) {
            var tpl = new Tpl(function(_) {
                _.div('#div-id.div-class1.div-class2', {
                    'data-name': 'DIV'
                }, function() {
                    _.txt(
                        'A div with some text, that ',
                        'contains placeholders like %that% ',
                        'that allows you to pass some %params% into', {
                            'that': 'THIS',
                            'params': 'DATA'
                        });
                });
            });
            String(tpl.toHtml()).should.equal(
                '<div id="div-id" class="div-class1 div-class2" data-name="DIV">' +
                'A div with some text, that contains placeholders like THIS that allows you to pass some DATA into' +
                '</div>');
            done();
        });
    });

});
