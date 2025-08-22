export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    muted: string;
    border: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

export interface CulturalSymbol {
  name: string;
  meaning: string;
  svgPath: string;
  color?: string;
}

export interface StoryElement {
  id: string;
  title: string;
  description: string;
  culturalSignificance: string;
  visualRepresentation?: string;
}