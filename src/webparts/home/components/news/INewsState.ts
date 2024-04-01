import { INewsProps,INewsItem } from './INewsProps';
export interface INewsState {
    Title: string;
    ID: number;   
    items: Array<INewsItem>;
    carouselRef: any;
    isLoading: boolean;
    isHovered: boolean;
    newsCarouselActive:boolean;
    newsCardActive:boolean;
}

export interface IItemObj {
    title: string;
    id?:string;    
    category?: string;              
    description?: string;
}