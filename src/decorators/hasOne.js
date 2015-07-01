export default function hasOne(target, options = {}) {

  // Return decorated Model
  return (Model) => {

    // Store relationships in Model
    Model.relationships = [
      ...Model.relationships || [],
      {relationship: 'hasOne', target, options}
    ];

    return Model;
  };
}
