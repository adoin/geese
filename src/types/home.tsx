import { TagType } from './tag';

export interface HomeItems {
  success: boolean;
  page: number;
  data: HomeItem[];
  tags: TagType[];
  has_more: boolean;
}

export interface ItemProps {
  item: HomeItem;
}

export interface HomeItem {
  item_id: string;
  author: string;
  author_avatar: string;
  title: string;
  name: string;
  description: string;
  summary: string;
  primary_lang: string;
  lang_color: string;
  is_hot: boolean;
  is_claimed: boolean;
  clicks_total: number;
  comment_total: number;
  updated_at: string;
}

export interface Stats {
  repo_total: number;
  user_total: number;
}

export interface RecommendItem {
  rid: string;
  name: string;
  full_name: string;
  author_avatar: string;
  description: string;
  primary_lang: string;
  lang_color: string;
  stars: number;
  stars_str: string;
}

export interface RecommendItems {
  success: boolean;
  total: number;
  data: RecommendItem[];
}

export interface AdvertItem {
  aid: string;
  url: string;
  image_url: string;
  is_ad: boolean;
  is_reward: boolean;
  year?: number;
  day?: number;
  percent: number;
}

export interface AdvertItems {
  success: boolean;
  data: AdvertItem[];
}

export interface CreateFeedbackRes {
  message: string;
  success: boolean;
}
