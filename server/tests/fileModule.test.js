const chai = require('chai');
const expect = chai.expect;
const fs = require('fs');
const fileModule = require('../controllers/fileModule');

describe('Write File', () => {
    it('Calls writeFileSync with the passed text', () => {
        const writeFileSyncStub = sinon.stub(fs, 'writeFileSync');

        writeFileSyncStub.callsFake((firstArg) => {
            console.log('My first arg is: ' + firstArg);
        });
        fileModule.writeToFile('Lorem ipsum');

        expect(writeFileSyncStub.calledWith('Lorem ipsum')).to.be.true;
    });
});