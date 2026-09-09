import React from "react";
import { testimonials } from "../../assets/data/mockData";
import Testimonials from "../reusable/Testimonials";

const CustomerTestimonial: React.FC = () => {
  return <Testimonials workTest={testimonials} />;
};

export default CustomerTestimonial;
