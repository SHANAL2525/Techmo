export interface ServiceDivision {
  id: string;
  sectionId: string;
  code: string;
  bayCode: string;
  eyebrow: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  capabilities: string[];
  applications: string[];
  blueprintType: "portal-frame" | "roof-truss" | "a-frame";
  specTag: string;
}

export interface EngineeringPhase {
  step: string;
  title: string;
  description: string;
}

export const serviceDivisions: ServiceDivision[] = [
  {
    id: "industrial-steel-buildings",
    sectionId: "steel-buildings",
    code: "DIV-01",
    bayCode: "BAY-A // PEB-STRUCTURAL",
    eyebrow: "Heavy Structural Engineering",
    title: "Industrial Steel Buildings",
    shortDescription:
      "Clear-span warehouses, factories, logistics hubs and multi-bay structural steel buildings engineered for Sri Lankan industrial operations.",
    fullDescription:
      "TECHMO designs, fabricates and erects primary and secondary structural steel framing systems. From high-clearance portal frame warehouses to heavy-duty crane-ready factory structures, every frame is engineered for structural integrity, efficient load transfer and rapid on-site assembly.",
    capabilities: [
      "Pre-Engineered Steel Buildings (PEB) & clear-span portal frames",
      "Multi-bay industrial warehouses, factories & logistics terminals",
      "Structural steel mezzanine floors & heavy equipment support platforms",
      "Overhead gantry crane runway beams & industrial column systems",
      "Bolted moment connections & corrosion-protected structural steelwork",
    ],
    applications: [
      "Manufacturing Plants",
      "Logistics & Cold Storage",
      "Commercial Showrooms",
      "Agricultural Processing Units",
    ],
    blueprintType: "portal-frame",
    specTag: "CLEAR-SPAN PORTAL FRAME SYSTEM",
  },
  {
    id: "roofing-and-fabrication",
    sectionId: "roofing-fabrication",
    code: "DIV-02",
    bayCode: "BAY-B // ROOF-FAB",
    eyebrow: "Precision Envelope & Metalwork",
    title: "Roofing & Fabrication",
    shortDescription:
      "Weather-resilient industrial roofing, architectural wall cladding, custom steel trusses and precision structural fabrication.",
    fullDescription:
      "Built to withstand tropical monsoon downpours, coastal humidity and high thermal loads in Sri Lanka, TECHMO delivers complete building envelope roofing systems alongside bespoke workshop steel fabrication for commercial and industrial projects.",
    capabilities: [
      "Industrial metal roofing sheets, standing-seam profiles & wall cladding",
      "Long-span tubular & angle steel roof trusses and purlin systems",
      "Thermal insulation layers, ridge ventilators & skylight integration",
      "High-capacity industrial box gutters, flashings & rainwater downpipes",
      "Custom structural steel fabrication, canopies, walkways & staircases",
    ],
    applications: [
      "Factory Roof Retrofits",
      "Cantilever Loading Canopies",
      "Architectural Cladding",
      "Custom Structural Metalwork",
    ],
    blueprintType: "roof-truss",
    specTag: "LONG-SPAN TRUSS & CLADDING ENVELOPE",
  },
  {
    id: "modern-residential-aframe",
    sectionId: "residential-aframe",
    code: "DIV-03",
    bayCode: "BAY-C // RES-AFRAME",
    eyebrow: "Architectural Steel Living",
    title: "Modern Residential & A-Frame Solutions",
    shortDescription:
      "Contemporary steel-frame homes, signature A-Frame cabanas, hillside villas and hybrid steel-and-glass architectural structures.",
    fullDescription:
      "Combining industrial steel precision with modern architectural aesthetics, TECHMO engineers lightweight, high-strength residential steel frames and iconic A-Frame structures suited for scenic hillside, coastal and urban plots across Sri Lanka.",
    capabilities: [
      "Engineered steel A-Frame cabanas, eco-resorts & holiday chalets",
      "Modern residential structural steel framing & cantilevered decks",
      "Elevated steel foundations for sloping or challenging terrain",
      "Full-height glazed gable framing & weather-sealed insulated roofing",
      "Rapid-assembly modular steel living and studio structures",
    ],
    applications: [
      "A-Frame Holiday Cabanas",
      "Boutique Eco-Resort Villas",
      "Contemporary Steel Homes",
      "Hillside & Elevated Builds",
    ],
    blueprintType: "a-frame",
    specTag: "TRIANGULATED A-FRAME STRUCTURAL RIG",
  },
];

export const engineeringWorkflow: EngineeringPhase[] = [
  {
    step: "01",
    title: "Structural Consultation & Detailing",
    description:
      "Site evaluation, span analysis, architectural layout coordination and detailed structural framing drawings tailored to operational loads.",
  },
  {
    step: "02",
    title: "Precision Steel Fabrication",
    description:
      "Controlled cutting, drilling, welding and surface preparation of structural members, trusses and connection plates.",
  },
  {
    step: "03",
    title: "Rigging & On-Site Erection",
    description:
      "Sequenced delivery, crane lifting, bolted frame assembly and plumb alignment executed with strict site safety protocols.",
  },
  {
    step: "04",
    title: "Roofing, Cladding & Handover",
    description:
      "Installation of weatherproof roofing sheets, insulation, flashings and rainwater systems for a complete structural envelope.",
  },
];
