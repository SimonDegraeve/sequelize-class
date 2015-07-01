export default function hasMany(target, options = {}) {

  // Return decorated Model
  return (Model) => {

    // Store relationships in Model
    Model.relationships = [
      ...Model.relationships || [],
      {relationship: 'hasMany', target, options}
    ];

    return Model;
  };
}
