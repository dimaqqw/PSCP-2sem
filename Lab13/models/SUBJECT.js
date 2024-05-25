module.exports = (sequelize, DataTypes) => {
  const SUBJECT = sequelize.define(
    'SUBJECT',
    {
      SUBJECT: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      SUBJECT_NAME: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      PULPIT: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'SUBJECT',
      freezeTableName: true,
      timestamps: false,
      createdAt: false,
      updatedAt: false,
    }
  )
  return SUBJECT
}
