export default function associate(models = {}) {

  // Iterate over models
  Object.keys(models).forEach((source) => {
    const {relationships = []} = models[source].options;

    // Create model relationships
    relationships.forEach(({relationship, target, options}) =>
      models[source][relationship](models[target], options)
    );
  });
}
