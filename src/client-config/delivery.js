export const deliveryConfig = {
  currency: "GHS",
  freeDeliveryThresholdMinor: 60000, // Free shipping on orders GH₵ 600+
  dispatchOrigin: "Kumasi, Ashanti Region, Ghana",

  zones: [
    {
      id: "ashanti-intra",
      name: "Kumasi & Ashanti Region (Local Courier)",
      description: "Direct doorstep delivery across Kumasi and surrounding Ashanti areas.",
      feeMinor: 2500, // GH₵ 25.00
      estimatedTransit: "Same-day / Next-day (24 Hours)",
      regionsCovered: ["Ashanti Region (Kumasi, Obuasi, Ejisu, etc.)"]
    },
    {
      id: "accra-express",
      name: "Greater Accra Express (Accra, Tema, Kasoa)",
      description: "Reliable insured regional dispatch to Accra & Tema metropolitan areas.",
      feeMinor: 4000, // GH₵ 40.00
      estimatedTransit: "1 – 2 Business Days",
      regionsCovered: ["Greater Accra"]
    },
    {
      id: "western-central",
      name: "Western & Central Regions (Takoradi, Cape Coast)",
      description: "Insured courier delivery to Western and Central regional hubs.",
      feeMinor: 4500, // GH₵ 45.00
      estimatedTransit: "2 – 3 Business Days",
      regionsCovered: ["Western Region", "Central Region", "Western North"]
    },
    {
      id: "eastern-volta",
      name: "Eastern & Volta Regions (Koforidua, Ho)",
      description: "Regional courier transit to Eastern and Volta regional capitals & towns.",
      feeMinor: 4500, // GH₵ 45.00
      estimatedTransit: "2 – 3 Business Days",
      regionsCovered: ["Eastern Region", "Volta Region", "Oti Region"]
    },
    {
      id: "northern-zones",
      name: "Northern, Bono & Upper Regions (Tamale, Sunyani, Wa, Bolga)",
      description: "Expedited regional transit to Northern and Bono belts.",
      feeMinor: 5500, // GH₵ 55.00
      estimatedTransit: "2 – 4 Business Days",
      regionsCovered: ["Northern", "Bono", "Bono East", "Ahafo", "Savannah", "North East", "Upper East", "Upper West"]
    },
    {
      id: "kumasi-pickup",
      name: "Kumasi Self Pickup (Concierge Station)",
      description: "Collect your packaged order directly from our Kumasi collection hub.",
      feeMinor: 0, // Free
      estimatedTransit: "Ready within 4 hours (Notification sent via WhatsApp/SMS)",
      regionsCovered: ["Kumasi Pickup Hub"]
    }
  ],

  preorderPolicy: {
    notice: "Pre-order items are specially secured from artisanal batches. Orders containing pre-order fragrances will be dispatched in full as soon as the batch is received (typically 7–10 business days).",
    depositRequired: "100% upfront via Paystack checkout"
  }
};
