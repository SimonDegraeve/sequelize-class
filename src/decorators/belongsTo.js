export default function belongsTo(target, options = {}) {

  // Return decorated Model
  return (Model) => {

    // Store relationships in Model
    Model.relationships = [
      ...Model.relationships || [],
      {relationship: 'belongsTo', target, options}
    ];

    return Model;
  };
}
