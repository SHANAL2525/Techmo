export interface ProjectPlaceholder {
  id: string;
  code: string;
  category: "Steel Buildings" | "Roofing & Fabrication" | "Residential & A-Frame";
  title: string;
  structuralSystem: string;
  summary: string;
  placeholderNotice: string;
  diagramVariant:
    | "warehouse-portal"
    | "multi-bay-factory"
    | "standing-seam-roof"
    | "cantilever-canopy"
    | "aframe-chalet"
    | "steel-residence";
}

export const projectPlaceholders: ProjectPlaceholder[] = [
  {
    id: "clear-span-logistics-warehouse",
    code: "PRJ-PROTO-01",
    category: "Steel Buildings",
    title: "Clear-Span Industrial Warehouse Concept",
    structuralSystem: "Tapered Portal Frame // High-Bay Steel Envelope",
    summary:
      "Structural steel warehouse layout featuring unobstructed internal floor area, ridge ventilation and heavy-vehicle loading bays.",
    placeholderNotice: "PROTOTYPE BLUEPRINT — SITE PHOTOGRAPHY PENDING",
    diagramVariant: "warehouse-portal",
  },
  {
    id: "multi-bay-manufacturing-facility",
    code: "PRJ-PROTO-02",
    category: "Steel Buildings",
    title: "Multi-Bay Production & Mezzanine Structure",
    structuralSystem: "Two-Span Portal Frame // Composite Steel Mezzanine",
    summary:
      "Engineered factory structure incorporating elevated structural steel mezzanine office decks and crane-ready column corbels.",
    placeholderNotice: "PROTOTYPE BLUEPRINT — SITE PHOTOGRAPHY PENDING",
    diagramVariant: "multi-bay-factory",
  },
  {
    id: "industrial-truss-roofing-system",
    code: "PRJ-PROTO-03",
    category: "Roofing & Fabrication",
    title: "Long-Span Truss & Insulated Cladding System",
    structuralSystem: "Tubular Steel Lattice Truss // Monsoon Drainage Profile",
    summary:
      "High-capacity industrial roof framing with thermal foil insulation, translucent daylight panels and concealed box gutters.",
    placeholderNotice: "PROTOTYPE BLUEPRINT — SITE PHOTOGRAPHY PENDING",
    diagramVariant: "standing-seam-roof",
  },
  {
    id: "heavy-cantilever-loading-canopy",
    code: "PRJ-PROTO-04",
    category: "Roofing & Fabrication",
    title: "Custom Fabricated Cantilever Dispatch Canopy",
    structuralSystem: "Welded Box-Section Cantilever // Weather-Sealed Soffit",
    summary:
      "Column-free projecting steel canopy engineered for all-weather cargo loading and commercial logistics operations.",
    placeholderNotice: "PROTOTYPE BLUEPRINT — SITE PHOTOGRAPHY PENDING",
    diagramVariant: "cantilever-canopy",
  },
  {
    id: "signature-aframe-mountain-cabana",
    code: "PRJ-PROTO-05",
    category: "Residential & A-Frame",
    title: "Signature Steel A-Frame Eco-Cabana",
    structuralSystem: "60° Triangulated Steel A-Frame // Elevated Deck Rig",
    summary:
      "Architectural A-Frame holiday structure with loft sleeping mezzanine, full-height glazed gable wall and insulated metal roofing.",
    placeholderNotice: "PROTOTYPE BLUEPRINT — SITE PHOTOGRAPHY PENDING",
    diagramVariant: "aframe-chalet",
  },
  {
    id: "contemporary-steel-frame-residence",
    code: "PRJ-PROTO-06",
    category: "Residential & A-Frame",
    title: "Modern Cantilevered Steel-Frame Residence",
    structuralSystem: "Wide-Flange H-Beam Grid // Hybrid Architectural Envelope",
    summary:
      "Contemporary two-level residential steel structure designed for sloping terrain with open-plan living spans and deep roof overhangs.",
    placeholderNotice: "PROTOTYPE BLUEPRINT — SITE PHOTOGRAPHY PENDING",
    diagramVariant: "steel-residence",
  },
];
