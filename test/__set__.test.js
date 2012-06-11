"use strict"; // run code in ES5 strict mode

var expect = require("expect.js"),
    __set__ = require("../lib/__set__.js"),
    vm = require("vm"),

    expectReferenceError = expectError(ReferenceError),
    expectTypeError = expectError(TypeError);

function expectError(ErrConstructor) {
    return function expectReferenceError(err) {
        expect(err.constructor.name).to.be(ErrConstructor.name);
    };
}

describe("__set__", function () {
    var moduleFake;

    beforeEach(function () {
        moduleFake = {
            myNumber: 0,    // copy by value
            myObj: {}       // copy by reference
        };

        vm.runInNewContext(
            "__set__ = " + __set__.toString() + "; " +
            "getNumber = function () { return myNumber; }; " +
            "getObj = function () { return myObj; }; ",
            moduleFake
        );
    });
    it("should set the new number when calling with varName, varValue", function () {
        expect(moduleFake.getNumber()).to.be(0);
        moduleFake.__set__("myNumber", 2);
        expect(moduleFake.getNumber()).to.be(2);
    });
    it("should set the new object when calling with varName, varValue", function () {
        var newObj = { hello: "hello" };

        expect(moduleFake.getObj()).to.eql({});
        moduleFake.__set__("myObj", newObj);
        expect(moduleFake.getObj()).to.be(newObj);
    });
    it("should set the new number and the new obj when calling with an env-obj", function () {
        var newObj = { hello: "hello" };

        expect(moduleFake.getNumber()).to.be(0);
        expect(moduleFake.getObj()).to.eql({});
        moduleFake.__set__({
            myNumber: 2,
            myObj: newObj
        });
        expect(moduleFake.getNumber()).to.be(2);
        expect(moduleFake.getObj()).to.be(newObj);
    });
    it("should return undefined", function () {
        expect(moduleFake.__set__("myNumber", 4)).to.be(undefined);
    });
    it("should throw a ReferenceError when trying to set non-existing vars", function () {
        expect(function () {
            moduleFake.__set__("notExisting", 3);
        }).to.throwException();
        expect(function () {
            moduleFake.__set__({
                notExisting: "bla",
                notExistingAsWell: "blabla"
            });
        }).to.throwException(expectReferenceError);
    });
    it("should throw a TypeError when passing misfitting params", function () {
        expect(function () {
            moduleFake.__set__();
        }).to.throwException(expectTypeError);
        expect(function () {
            moduleFake.__set__(undefined);
        }).to.throwException(expectTypeError);
        expect(function () {
            moduleFake.__set__(null);
        }).to.throwException(expectTypeError);
        expect(function () {
            moduleFake.__set__(true);
        }).to.throwException(expectTypeError);
        expect(function () {
            moduleFake.__set__(2);
        }).to.throwException(expectTypeError);
        expect(function () {
            moduleFake.__set__("");
        }).to.throwException(expectTypeError);
        expect(function () {
            moduleFake.__set__(function () {});
        }).to.throwException(expectTypeError);
    });
});