import { defineContract } from '@prisma/orm-postgres/contract-builder';

export const contract = defineContract({}, ({ field, model, rel }) => {
  // Define User model representing application users
  const User = model('User', {
    fields: {
      id: field.id.uuidv7String(),
      email: field.text().unique(),
      password_hash: field.text(),
      name: field.text().optional(),
      created_at: field.temporal.createdAtString(),
    },
  });

  // Define Task model representing individual tasks
  const Task = model('Task', {
    fields: {
      id: field.id.uuidv7String(),
      title: field.text(),
      completed: field.boolean(),
      description: field.text().optional(),
      user_id: field.uuidString(), 
    },
  });

  // Return defined models and establish their relationships
  return {
    models: {
      User: User.relations({
        tasks: rel.hasMany(Task, { by: 'user_id' }), 
      }),
      Task: Task.relations({
        user: rel.belongsTo(User, { from: 'user_id', to: 'id' }), 
      }),
    },
  };
});