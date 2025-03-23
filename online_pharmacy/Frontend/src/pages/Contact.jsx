import GenericPage from "../components/GenericPage";

const Contact = () => {
  return (
    <GenericPage
      title="Contact Us"
      content={[
        "For any inquiries, feel free to reach out to us:",
        "📧 Email: support@pharmacy.com",
        "📞 Phone: +91 98765 43210",
        "🏢 Address: 123, Medical Street, New Delhi, India",
      ]}
    />
  );
};

export default Contact;
