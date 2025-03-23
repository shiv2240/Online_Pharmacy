import GenericPage from "../components/GenericPage";

const PrivacyPolicy = () => {
  return (
    <GenericPage
      title="Privacy Policy"
      content={[
        "Your privacy is important to us. We collect and store only necessary information to process your orders.",
        "We do not share your personal data with third parties except as required by law.",
        "By using our services, you consent to our data collection and usage policies.",
      ]}
    />
  );
};

export default PrivacyPolicy;
