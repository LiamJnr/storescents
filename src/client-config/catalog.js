export const catalogConfig = {
  categories: [
    { id: "all", label: "All Perfumes", slug: "all" },
    { id: "women", label: "Women", slug: "women" },
    { id: "men", label: "Men", slug: "men" },
    { id: "unisex", label: "Unisex", slug: "unisex" }
  ],
  
  olfactoryFamilies: [
    "Floral",
    "Woody",
    "Amber / Oriental",
    "Citrus / Fresh",
    "Gourmand",
    "Chypre",
    "Aquatic"
  ],

  products: [
    {
      id: "heures-d-absence",
      slug: "heures-d-absence",
      name: "Heures d'Absence",
      subtitle: "An ode to blooming florals and timeless elegance",
      category: "women",
      genderLabel: "Women",
      olfactoryFamily: "Floral",
      concentration: "Eau de Parfum",
      status: "active",
      isPreorder: false,
      isFeatured: true,
      priceMinor: 20000, // GH₵ 200.00
      compareAtPriceMinor: 25000,
      badge: "Bestseller",
      images: {
        primary: "/images/products/heures-d-absence-1.webp",
        secondary: "/images/products/heures-d-absence-1.webp",
        gallery: ["/images/products/heures-d-absence-1.webp"]
      },
      options: {
        sizes: [
          { id: "50ml", label: "50ml", priceMinor: 20000 },
          { id: "100ml", label: "100ml", priceMinor: 32000 }
        ]
      },
      description: "A luminous celebration of free-spirited flowers. Grasse Jasmine and May Rose take center stage, underpinned by powdery mimosa and warm sandalwood.",
      pyramid: {
        top: ["Sambac Jasmine", "May Rose", "Mandarin"],
        heart: ["Mimosa", "Pittosporum", "Raspberry"],
        base: ["Vanilla", "Sandalwood", "Musk"]
      },
      metrics: {
        longevity: "8 - 10 Hours",
        sillage: "Moderate to Heavy",
        season: "Spring / Summer / Evening"
      }
    },
    {
      id: "spell-on-you",
      slug: "spell-on-you",
      name: "Spell on You",
      subtitle: "Hypnotic iris and intoxicating romanticism",
      category: "women",
      genderLabel: "Women",
      olfactoryFamily: "Floral",
      concentration: "Eau de Parfum",
      status: "active",
      isPreorder: false,
      isFeatured: true,
      priceMinor: 20000, // GH₵ 200.00
      compareAtPriceMinor: null,
      badge: "Popular",
      images: {
        primary: "/images/products/spell-on-you-1.webp",
        secondary: "/images/products/spell-on-you-1.webp",
        gallery: ["/images/products/spell-on-you-1.webp"]
      },
      options: {
        sizes: [
          { id: "50ml", label: "50ml", priceMinor: 20000 },
          { id: "100ml", label: "100ml", priceMinor: 32000 }
        ]
      },
      description: "An irresistible attraction woven around noble Florentine Iris Pallida and sensual Grasse Rose, ending in a warm embrace of white musk.",
      pyramid: {
        top: ["Violet", "Green Accord", "Tuscan Iris"],
        heart: ["Rose de Mai", "Florentine Iris", "Chinese Jasmine"],
        base: ["White Musk", "Acacia", "Peach"]
      },
      metrics: {
        longevity: "7 - 9 Hours",
        sillage: "Intimate to Moderate",
        season: "All Season / Signature"
      }
    },
    {
      id: "ombre-nomade",
      slug: "ombre-nomade",
      name: "Ombre Nomade",
      subtitle: "Masterpiece of rare Oud and burning desert amber",
      category: "unisex",
      genderLabel: "Unisex",
      olfactoryFamily: "Amber / Oriental",
      concentration: "Extrait de Parfum",
      status: "active",
      isPreorder: false,
      isFeatured: true,
      priceMinor: 28000, // GH₵ 280.00
      compareAtPriceMinor: 34000,
      badge: "Signature",
      images: {
        primary: "/images/products/ombre-nomade-1.webp",
        secondary: "/images/products/ombre-nomade-1.webp",
        gallery: ["/images/products/ombre-nomade-1.webp"]
      },
      options: {
        sizes: [
          { id: "50ml", label: "50ml", priceMinor: 28000 },
          { id: "100ml", label: "100ml", priceMinor: 45000 }
        ]
      },
      description: "Designed for lovers of rare essences, Ombre Nomade concentrates that sensation of infinity into one of the most mythical ingredients in perfumery: oud wood.",
      pyramid: {
        top: ["Raspberry", "Incense", "Saffron"],
        heart: ["Rose", "Birch Tar", "Geranium"],
        base: ["Assam Oud Wood", "Amberwood", "Benzoin Tears"]
      },
      metrics: {
        longevity: "12+ Hours (Beast Mode)",
        sillage: "Intense Enveloping",
        season: "Autumn / Winter / Special Occasion"
      }
    },
    {
      id: "afternoon-swim",
      slug: "afternoon-swim",
      name: "Afternoon Swim",
      subtitle: "A revitalizing plunge into pure mandarin joy",
      category: "unisex",
      genderLabel: "Unisex",
      olfactoryFamily: "Citrus / Fresh",
      concentration: "Eau de Parfum",
      status: "active",
      isPreorder: false,
      isFeatured: false,
      priceMinor: 20000, // GH₵ 200.00
      compareAtPriceMinor: null,
      badge: null,
      images: {
        primary: "/images/products/afternoon-swim-1.webp",
        secondary: "/images/products/afternoon-swim-1.webp",
        gallery: ["/images/products/afternoon-swim-1.webp"]
      },
      options: {
        sizes: [
          { id: "50ml", label: "50ml", priceMinor: 20000 },
          { id: "100ml", label: "100ml", priceMinor: 30000 }
        ]
      },
      description: "A shot of sunshine and optimism. Rare Sicilian Mandarin with bursts of Bergamot and Ginger evoke crystal Mediterranean waters.",
      pyramid: {
        top: ["Sicilian Mandarin", "Calabrian Bergamot"],
        heart: ["Sweet Orange", "Ginger"],
        base: ["Ambergris", "Virginia Cedar"]
      },
      metrics: {
        longevity: "6 - 8 Hours",
        sillage: "Moderate Radiant",
        season: "Daytime / Summer / Tropical Heat"
      }
    },
    {
      id: "limmensite",
      slug: "limmensite",
      name: "L'Immensité",
      subtitle: "Crisp ginger, grapefruit, and raw mineral amber",
      category: "men",
      genderLabel: "Men",
      olfactoryFamily: "Citrus / Fresh",
      concentration: "Eau de Parfum",
      status: "active",
      isPreorder: false,
      isFeatured: true,
      priceMinor: 22000, // GH₵ 220.00
      compareAtPriceMinor: null,
      badge: "Top Pick",
      images: {
        primary: "/images/products/limmensite-1.webp",
        secondary: "/images/products/limmensite-1.webp",
        gallery: ["/images/products/limmensite-1.webp"]
      },
      options: {
        sizes: [
          { id: "50ml", label: "50ml", priceMinor: 22000 },
          { id: "100ml", label: "100ml", priceMinor: 34000 }
        ]
      },
      description: "A journey of horizons. Crisp ginger sparks over grapefruit and crisp sage, anchored by labdanum and ambroxan.",
      pyramid: {
        top: ["Grapefruit", "Fresh Ginger", "Bergamot"],
        heart: ["Water Notes", "Sage", "Rosemary", "Geranium"],
        base: ["Ambroxan", "Labdanum", "Amber"]
      },
      metrics: {
        longevity: "9 - 11 Hours",
        sillage: "Strong Seductive",
        season: "All Season / Signature Executive"
      }
    },
    {
      id: "california-dream",
      slug: "california-dream",
      name: "California Dream",
      subtitle: "The magical pink and blue hues of dusk",
      category: "unisex",
      genderLabel: "Unisex",
      olfactoryFamily: "Citrus / Fresh",
      concentration: "Eau de Parfum",
      status: "active",
      isPreorder: false,
      isFeatured: false,
      priceMinor: 20000, // GH₵ 200.00
      compareAtPriceMinor: null,
      badge: null,
      images: {
        primary: "/images/products/california-dream-1.webp",
        secondary: "/images/products/california-dream-1.webp",
        gallery: ["/images/products/california-dream-1.webp"]
      },
      options: {
        sizes: [
          { id: "50ml", label: "50ml", priceMinor: 20000 },
          { id: "100ml", label: "100ml", priceMinor: 32000 }
        ]
      },
      description: "Capturing the golden hour: sparkling mandarin layered over warm ambrette and benzoin vanilla.",
      pyramid: {
        top: ["Mandarin Orange", "Pear"],
        heart: ["Ambrette (Musk Mallow)", "Petals"],
        base: ["Benzoin", "Musk"]
      },
      metrics: {
        longevity: "7 - 8 Hours",
        sillage: "Moderate",
        season: "Sunset / Warm Evenings"
      }
    },
    {
      id: "symphony",
      slug: "symphony",
      name: "Symphony",
      subtitle: "Pure radiant light and sweet velvety ginger",
      category: "unisex",
      genderLabel: "Unisex",
      olfactoryFamily: "Chypre",
      concentration: "Extrait de Parfum",
      status: "preorder",
      isPreorder: true,
      preorderNote: "Pre-order now — Estimated batch dispatch in 7-10 business days",
      isFeatured: true,
      priceMinor: 30000, // GH₵ 300.00
      compareAtPriceMinor: 36000,
      badge: "Pre-Order",
      images: {
        primary: "/images/products/symphony-1.webp",
        secondary: "/images/products/symphony-1.webp",
        gallery: ["/images/products/symphony-1.webp"]
      },
      options: {
        sizes: [
          { id: "50ml", label: "50ml", priceMinor: 30000 },
          { id: "100ml", label: "100ml", priceMinor: 48000 }
        ]
      },
      description: "An extraordinary sensory elevation. Candied ginger zest meets sparkling grapefruit in a whirlwind of celestial musk.",
      pyramid: {
        top: ["Ginger Zest", "Grapefruit", "Bergamot"],
        heart: ["Solar Notes", "Cardamom"],
        base: ["Velvety Musks", "Precious Woods"]
      },
      metrics: {
        longevity: "10 - 12 Hours",
        sillage: "Radiant & Expansive",
        season: "High Luxury Occasions"
      }
    },
    {
      id: "matiere-noire",
      slug: "matiere-noire",
      name: "Matière Noire",
      subtitle: "Mysterious dark wood and blackcurrant nectar",
      category: "women",
      genderLabel: "Women",
      olfactoryFamily: "Woody",
      concentration: "Eau de Parfum",
      status: "active",
      isPreorder: false,
      isFeatured: false,
      priceMinor: 22000, // GH₵ 220.00
      compareAtPriceMinor: null,
      badge: null,
      images: {
        primary: "/images/products/matiere-noire-1.webp",
        secondary: "/images/products/matiere-noire-1.webp",
        gallery: ["/images/products/matiere-noire-1.webp"]
      },
      options: {
        sizes: [
          { id: "50ml", label: "50ml", priceMinor: 22000 },
          { id: "100ml", label: "100ml", priceMinor: 34000 }
        ]
      },
      description: "Plunging into intangible depths. Laos Agarwood contrasts with blackcurrant syrup and blooming narcissus.",
      pyramid: {
        top: ["Blackcurrant Syrup", "Watery Notes"],
        heart: ["Cyclamen", "Narcissus", "Jasmine Sambac", "Rose"],
        base: ["Agarwood (Oud)", "Patchouli", "Incense", "Benzoin"]
      },
      metrics: {
        longevity: "9 - 11 Hours",
        sillage: "Deep & Mysterious",
        season: "Evening / Winter"
      }
    },
    {
      id: "attrape-reves",
      slug: "attrape-reves",
      name: "Attrape-Rêves",
      subtitle: "A cocoa-dusted shower of shooting stars and peonies",
      category: "women",
      genderLabel: "Women",
      olfactoryFamily: "Gourmand",
      concentration: "Eau de Parfum",
      status: "active",
      isPreorder: false,
      isFeatured: false,
      priceMinor: 21000, // GH₵ 210.00
      compareAtPriceMinor: null,
      badge: null,
      images: {
        primary: "/images/products/attrape-reves-1.webp",
        secondary: "/images/products/attrape-reves-1.webp",
        gallery: ["/images/products/attrape-reves-1.webp"]
      },
      options: {
        sizes: [
          { id: "50ml", label: "50ml", priceMinor: 21000 },
          { id: "100ml", label: "100ml", priceMinor: 33000 }
        ]
      },
      description: "An intoxicating dialogue of precious raw cocoa powder paired with fresh peony flowers and patchouli heart.",
      pyramid: {
        top: ["Lychee", "Ginger", "Bergamot"],
        heart: ["Peony", "Cocoa Powder", "Turkish Rose"],
        base: ["Patchouli Heart", "Vanilla", "Musk"]
      },
      metrics: {
        longevity: "8 - 10 Hours",
        sillage: "Captivating & Sweet",
        season: "Autumn / Spring / Romantic Date"
      }
    },
    {
      id: "sur-la-route",
      slug: "sur-la-route",
      name: "Sur la Route",
      subtitle: "Cedar, Peruvian balsam, and fresh green citrus",
      category: "men",
      genderLabel: "Men",
      olfactoryFamily: "Woody",
      concentration: "Eau de Parfum",
      status: "active",
      isPreorder: false,
      isFeatured: false,
      priceMinor: 20000, // GH₵ 200.00
      compareAtPriceMinor: null,
      badge: null,
      images: {
        primary: "/images/products/sur-la-route-1.webp",
        secondary: "/images/products/sur-la-route-1.webp",
        gallery: ["/images/products/sur-la-route-1.webp"]
      },
      options: {
        sizes: [
          { id: "50ml", label: "50ml", priceMinor: 20000 },
          { id: "100ml", label: "100ml", priceMinor: 31000 }
        ]
      },
      description: "A metaphor for the journey of life. Calabrian citrus cuts through crushing cedarwood and balsamic leather.",
      pyramid: {
        top: ["Calabrian Bergamot", "Citron", "Pink Pepper"],
        heart: ["Nutmeg", "Cardamom", "Grass Accord"],
        base: ["Peruvian Balsam", "Cedar", "Leather", "Patchouli"]
      },
      metrics: {
        longevity: "8 - 9 Hours",
        sillage: "Masculine / Refined",
        season: "Daily Signature / Business"
      }
    },
    {
      id: "rose-des-vents",
      slug: "rose-des-vents",
      name: "Rose des Vents",
      subtitle: "A breeze through the rose fields of Grasse",
      category: "women",
      genderLabel: "Women",
      olfactoryFamily: "Floral",
      concentration: "Eau de Parfum",
      status: "active",
      isPreorder: false,
      isFeatured: false,
      priceMinor: 20000, // GH₵ 200.00
      compareAtPriceMinor: null,
      badge: null,
      images: {
        primary: "/images/products/rose-des-vents-1.webp",
        secondary: "/images/products/rose-des-vents-1.webp",
        gallery: ["/images/products/rose-des-vents-1.webp"]
      },
      options: {
        sizes: [
          { id: "50ml", label: "50ml", priceMinor: 20000 },
          { id: "100ml", label: "100ml", priceMinor: 32000 }
        ]
      },
      description: "A whisper of petals. A trio of roses (Centifolia, Turkish, Bulgarian) spiced with saffron and iris.",
      pyramid: {
        top: ["Peach", "Green Notes", "Blackcurrant"],
        heart: ["May Rose", "Turkish Rose", "Bulgarian Rose", "Iris"],
        base: ["Cedar", "Orris Root", "Pepper", "White Musk"]
      },
      metrics: {
        longevity: "7 - 8 Hours",
        sillage: "Soft Romantic",
        season: "Daytime / Spring"
      }
    },
    {
      id: "nouveau-monde",
      slug: "nouveau-monde",
      name: "Nouveau Monde",
      subtitle: "Raw cocoa bean infused into majestic oud wood",
      category: "men",
      genderLabel: "Men",
      olfactoryFamily: "Amber / Oriental",
      concentration: "Eau de Parfum",
      status: "active",
      isPreorder: false,
      isFeatured: false,
      priceMinor: 23000, // GH₵ 230.00
      compareAtPriceMinor: null,
      badge: null,
      images: {
        primary: "/images/products/nouveau-monde-1.webp",
        secondary: "/images/products/nouveau-monde-1.webp",
        gallery: ["/images/products/nouveau-monde-1.webp"]
      },
      options: {
        sizes: [
          { id: "50ml", label: "50ml", priceMinor: 23000 },
          { id: "100ml", label: "100ml", priceMinor: 35000 }
        ]
      },
      description: "Paying homage to explorer spirits. Deep roasted cocoa blends effortlessly with rare assam agarwood and saffron.",
      pyramid: {
        top: ["Saffron", "Rose"],
        heart: ["Ivory Coast Cocoa", "Incense", "Cardamom"],
        base: ["Assam Oud", "Leather", "Caramelized Amber"]
      },
      metrics: {
        longevity: "10 - 12 Hours",
        sillage: "Commanding & Rich",
        season: "Night / Formal / Cool Weather"
      }
    },
    {
      id: "orage",
      slug: "orage",
      name: "Orage",
      subtitle: "The electrical charge and damp earth of a storm",
      category: "men",
      genderLabel: "Men",
      olfactoryFamily: "Woody",
      concentration: "Eau de Parfum",
      status: "preorder",
      isPreorder: true,
      preorderNote: "Pre-order — Limited artisanal bottling shipping next week",
      isFeatured: false,
      priceMinor: 22000, // GH₵ 220.00
      compareAtPriceMinor: null,
      badge: "Pre-Order",
      images: {
        primary: "/images/products/orage-1.webp",
        secondary: "/images/products/orage-1.webp",
        gallery: ["/images/products/orage-1.webp"]
      },
      options: {
        sizes: [
          { id: "50ml", label: "50ml", priceMinor: 22000 },
          { id: "100ml", label: "100ml", priceMinor: 34000 }
        ]
      },
      description: "Nature in turbulent majesty. Patchouli heart flashes against bergamot, iris, and Java vetiver.",
      pyramid: {
        top: ["Bergamot", "Grapefruit"],
        heart: ["Iris", "Hedione", "Pepper"],
        base: ["Patchouli", "Java Vetiver", "Iso E Super", "White Musk"]
      },
      metrics: {
        longevity: "8 - 10 Hours",
        sillage: "Crisp & Atmospheric",
        season: "Rainy Season / All Year"
      }
    },
    {
      id: "les-sables-roses",
      slug: "les-sables-roses",
      name: "Les Sables Roses",
      subtitle: "A trail of roses and oud in infinite desert dunes",
      category: "unisex",
      genderLabel: "Unisex",
      olfactoryFamily: "Amber / Oriental",
      concentration: "Eau de Parfum",
      status: "active",
      isPreorder: false,
      isFeatured: true,
      priceMinor: 26000, // GH₵ 260.00
      compareAtPriceMinor: 30000,
      badge: "Popular",
      images: {
        primary: "/images/products/les-sables-roses-1.webp",
        secondary: "/images/products/les-sables-roses-1.webp",
        gallery: ["/images/products/les-sables-roses-1.webp"]
      },
      options: {
        sizes: [
          { id: "50ml", label: "50ml", priceMinor: 26000 },
          { id: "100ml", label: "100ml", priceMinor: 40000 }
        ]
      },
      description: "A hot and cold vortex. Centifolia rose and Bulgarian rose embrace spicy ambergris and smoky oud wood.",
      pyramid: {
        top: ["Black Pepper", "Saffron"],
        heart: ["Rose Centifolia", "Bulgarian Rose"],
        base: ["Ambergris", "Oud Wood", "Birch"]
      },
      metrics: {
        longevity: "11+ Hours",
        sillage: "Opulent & Trail-leaving",
        season: "Evening / Celebrations"
      }
    },
    {
      id: "fleur-du-desert",
      slug: "fleur-du-desert",
      name: "Fleur du Désert",
      subtitle: "Jasmine, orange blossom, and rose in honeyed amber",
      category: "unisex",
      genderLabel: "Unisex",
      olfactoryFamily: "Amber / Oriental",
      concentration: "Eau de Parfum",
      status: "active",
      isPreorder: false,
      isFeatured: false,
      priceMinor: 25000, // GH₵ 250.00
      compareAtPriceMinor: null,
      badge: null,
      images: {
        primary: "/images/products/fleur-du-desert-1.webp",
        secondary: "/images/products/fleur-du-desert-1.webp",
        gallery: ["/images/products/fleur-du-desert-1.webp"]
      },
      options: {
        sizes: [
          { id: "50ml", label: "50ml", priceMinor: 25000 },
          { id: "100ml", label: "100ml", priceMinor: 38000 }
        ]
      },
      description: "An oasis of flowers in golden sunlight. Orange blossom and jasmine absolute soaked in rich cinnamon and honey.",
      pyramid: {
        top: ["Honey", "Cinnamon"],
        heart: ["Jasmine Grandiflorum", "Orange Blossom", "Rose"],
        base: ["Assam Oud", "Ambrette", "Cedar"]
      },
      metrics: {
        longevity: "9 - 11 Hours",
        sillage: "Warm & Seductive",
        season: "Fall / Winter / Evening"
      }
    }
  ]
};
