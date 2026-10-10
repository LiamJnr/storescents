export const promotionsConfig = [
  {
    code: "WELCOME10",
    label: "10% Welcome Gift",
    type: "percentage",
    value: 10,
    minOrderMinor: 20000, // GH₵ 200 min
    maxDiscountMinor: 5000, // Max GH₵ 50 off
    description: "Enjoy 10% off your introductory fragrance purchase."
  },
  {
    code: "KUMASI",
    label: "Ashanti Launch Special",
    type: "fixed",
    valueMinor: 2500, // GH₵ 25.00 off (covers Kumasi delivery)
    minOrderMinor: 20000,
    maxDiscountMinor: 2500,
    description: "Complimentary Kumasi delivery fee discount on qualifying orders."
  }
];
