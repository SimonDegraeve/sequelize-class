/**
 * Relationships
 */
export associate from './associate';

export belongsTo from './decorators/belongsTo';
export belongsToMany from './decorators/belongsToMany';
export hasOne from './decorators/hasOne';
export hasMany from './decorators/hasMany';


/**
 * Model definitions
 */
export model from './decorators/model';


/**
 * Sequelize shortcuts
 */
export Sequelize from 'sequelize';
export DataTypes from 'sequelize/lib/data-types';
