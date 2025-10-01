export type Product = {
  id_product: number;
  name_product: string;
  description_product: string;
  price_product: number;
  image_product?: string;
  stock_product: number;
  isAvailable_product: boolean;
  id_category_product: number;
  status_product: number;
  id_tag_product: string[];
  hasOffer_product: boolean;
  offerPrice_product: number;
  date_created_product: Date;
  date_updated_product: Date;
};

export type Category = {
  id_category: number;
  name_category: string;
  description_category: string;
  date_created_category: Date;
  date_updated_category: Date;
};

export type Tag = {
  id_tag: number;
  name_tag: string;
  color_tag?: string;
  date_created_tag: Date;
  date_updated_tag: Date;
};

export type UploadFile = {
  id_file: number;
  id_temp?: string;
  name_file: string;
  name_folder_file: string;
  extension_file: string;
  type_file: string;
  size_file: number;
  url_file: string;
  id_mailchimp?: number;
  date_created_file?: Date;
  date_updated_file: Date;

  size_file_display?: string;
  __originalName?: string;
  preview?: string;
  selected?: boolean;
  __originalFile?: File;
};

export interface Watermark {
  enabled: boolean;
  text: string;
  color: string;
  opacity: number;
  size: number;
  rotation: number;
}

export type OrientationType = 'portrait' | 'landscape';

export interface Setting {
  id_setting: number;
  logo_url_setting: string;
  title_setting: string;
  description_setting: string;
  category_bg_setting: string;
  orientation_setting: string;
  template_setting: string;
  watermark_setting: Watermark;
  date_created_setting: Date;
  date_updated_setting: Date;
};