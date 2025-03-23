import GenericPage from "../components/GenericPage";

const About = () => {
  return (
    <GenericPage
      title="About Us"
      content={[
        "Welcome to our Online Pharmacy. We aim to provide quality medicines at affordable prices.",
        "Our mission is to make healthcare accessible to everyone through a seamless online experience.",
        "With a wide range of medicines, we ensure timely delivery and quality assurance.",
      ]}
    />
  );
};

export default About;
