export type FormFields = {
  inputType: string;
  name: string;
  id: string;
  placeholder?: string;
  label?: string;
  type?: string;
}

export interface HeaderAttrs {
  icon: string;
  icon_preview: string;
  ar: {
    title: string;
    desc: string;
    slug: string;
    name: string;

  },
  en: {
    title: string;
    desc: string;
    slug: string;
    name: string;
  }
}


export interface Header1 extends HeaderAttrs {
  video: string;
  preview: string;
}
export interface Header2 extends HeaderAttrs {
  video: string;
  preview: string;
  image: string;
  image_preview: string;
}
export interface Header3 extends Omit<HeaderAttrs, 'ar' | 'en'> {
  image: string;
  image_preview: string;
  ar: HeaderAttrs['ar'] & {
    sub_title: string;
    sub_desc: string;
  };
  en: HeaderAttrs['en'] & {
    sub_title: string;
    sub_desc: string;
  };
}
export interface Section1 {
  image: string;
  image_preview: string;
  ar: {
    title: string;
    desc: string;


  },
  en: {
    title: string;
    desc: string;

  },
  features: {
    ar: {
      title: string
    }
    en: {
      title: string
    }
    id: string
  }[]

}
export interface Contact1 {
  background: string;
  background_preview: string;
  ar: {
    title: string;
  },
  en: {
    title: string;

  },
}
export interface Feature1 {
  image: string;
  image_preview: string;
  ar: {
    title: string;
    desc: string;
  },
  en: {
    title: string;
    desc: string;
  },
  features: {
    icon: '',
    icon_preview: '',
    ar: {
      title: string;
      desc: string;
    }
    en: {
      title: string;
      desc: string;
    }
    id?: string
  }[]

}

export type Values = Header1 | Header2 | Header3 | HeaderAttrs | Section1 | Feature1 | Contact1
