export interface VolumePageProps {
  volume: VolumeType;
}

export interface VolumeType {
  page_total: number;
  total: number;
  current_num: number;
  data: VolumeCategory[];
}

export interface VolumeCategory {
  category_id: number;
  category_name: string;
  items: PeriodicalItem[];
}

export interface VolumeNum {
  num: number;
}

export interface PeriodicalItem {
  rid: string;
  name: string;
  description: string;
  github_url: string;
  stars: number;
  forks: number;
  watch: number;
  image_url: string | null;
  vote_total: number;
  publish_at: string;
}

export interface PeriodicalItemProps {
  index: number;
  item: PeriodicalItem;
}

export interface Volume {
  success: boolean;
  page_total: number;
  total: number;
  current_num: number;
  data: PeriodicalItem[];
}

export type VolumeAll = {
  success: boolean;
  total: number;
  data: any[];
};

export interface CategoryPageProps {
  category: Category;
}

export interface Category {
  success: boolean;
  category_name: string;
  page_total: number;
  total: number;
  current_page: number;
  data: PeriodicalItem[];
}

export interface CategroyName {
  name: string;
}

export type AllItems = {
  success: boolean;
  repo_total: number;
  categories: CategroyName[];
  volumes: VolumeNum[];
};
