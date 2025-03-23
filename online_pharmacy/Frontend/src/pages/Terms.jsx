import GenericPage from "../components/GenericPage";

const Terms = () => {
  return (
    <GenericPage
      title="Terms & Conditions"
      content={[
        "Welcome to our pharmacy. By using our website, you agree to the following terms and conditions.",
        "You must be at least 18 years old to purchase medicines from our website.",
        "All products and services are provided on an 'as is' basis without warranties of any kind.",
        "We reserve the right to update our terms at any time without prior notice.",
      ]}
    />
  );
};

export default Terms;
