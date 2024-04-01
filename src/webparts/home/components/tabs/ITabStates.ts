export interface ITabState {
    Title: string;
    ID: number;   
    items: Array<IItemObj>;
    carouselRef: any;
    isLoading: boolean;
    isHovered: boolean;
}

export interface IItemObj {
    title: string;
    id?:string;    
    banner?: string;              
    description?: string;
    link?:string;
}