export default function PersonaDescription({ userData }) {
  // This can be expanded with more detailed, generated text
  const description = {
    Thinker: "You thrive on kinetic creativity—building through motion and curiosity. You can’t sit still with ideas; your instinct is to make, test, and improve. When paired with Empaths, your energy finds direction. When with Builders, you add spark.",
    default: "You bring a unique and valuable perspective to the cohort, blending different ways of thinking to achieve innovative outcomes. Your approach reminds the cohort that breakthroughs happen at the intersection of diverse skills."
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Your Innovator Pattern</h2>
      <p className="text-gray-600 leading-relaxed">
        {description[userData.Primary_Archetype] || description.default}
      </p>
    </div>
  );
}