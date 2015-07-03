/* eslint-disable max-nested-callbacks */

/**
 * Import dependencies
 */
import {expect} from 'code';
import {script} from 'lab';
import * as SequelizeClass from '../src';


/**
 * Test helpers
 */
const lab = script();
const {describe, it, before, beforeEach, after, afterEach} = lab;
export {lab};


/**
 * Tests
 */
describe('Model definition', () => {

});


describe('Package', () => {

  it('Export methods', (done) => {
    done();
  });

  it('Export decorators', (done) => {
    done();
  });

  it('Export Sequelize shortcuts', (done) => {
    expect(SequelizeClass.Sequelize).to.be.function();
    expect(SequelizeClass.DataTypes).to.be.object();
    done();
  });

  it('Export extras', (done) => {
    done();
  });
});
