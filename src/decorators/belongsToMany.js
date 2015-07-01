export default function belongsToMany(target, options = {}) {

  // Return decorated Model
  return (Model) => {

    // Store relationships in Model
    Model.relationships = [
      ...Model.relationships || [],
      {relationship: 'belongsToMany', target, options}
    ];

    return Model;
  };
}
