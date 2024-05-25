const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize('Lab19PSCP', 'student', 'fitfit', {
  host: 'localhost',
  dialect: 'mssql',
})

const User = sequelize.define(
  'users',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(16),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING(5),
      allowNull: false,
      validate: {
        isIn: [['user', 'admin']],
      },
    },
  },
  { timestamps: false }
)

const Repo = sequelize.define(
  'repos',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { timestamps: false }
)

const Commit = sequelize.define(
  'commits',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    repoId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    message: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
    },
  },
  { timestamps: false }
)

User.hasMany(Repo, {
  foreignKey: 'authorId',
  onDelete: 'CASCADE',
})
Repo.belongsTo(User, {
  foreignKey: 'authorId',
})

Repo.hasMany(Commit, {
  foreignKey: 'repoId',
  onDelete: 'CASCADE',
})
Commit.belongsTo(Repo, {
  foreignKey: 'repoId',
})

module.exports = { User, Repo, Commit, sequelize }
