export type FormFields = {
  inputType: string;
  name: string;
  id: string;
  placeholder?: string;
  label?: string;
  type?: string;
}





export interface MainDataType {
  image: string;
  image_preview: string;
  about_media: string;
  about_media_preview: string;
  about_media_type: string;
  downloads: number;
  rating: number;
  founded_in: number | null;
  tools: string[];
  ar: {
    name: string;
    slug: string;
    desc: string;
    location: string;
    platform: string;
    about_title: string;
    about_desc: string;
  };
  en: {
    name: string;
    desc: string;
    slug: string;
    location: string;
    platform: string;
    about_title: string;
    about_desc: string;
  };
}
export interface MainFeatureType {
  images: string[];
  images_preview: { image: string; id: number | null }[];
  main_features: {
    icon: string;
    icon_preview: string;
    id: number | null;
    ar: {
      name: string;
    };
    en: {
      name: string;
    };
  }[];
  ar: {
    title: string;
    desc: string;
  };
  en: {
    title: string;
    desc: string;
  };
}
export interface FeatureType {


  features: {
    icon: string;
    icon_preview: string;
    id: number | null
    ar: {
      name: string
    }
    en: {
      name: string
    }
  }[],
  ar: {
    title: string;
    desc: string;
  };
  en: {
    title: string;
    desc: string;
  };
}


