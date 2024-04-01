export interface IQuickLinksState {
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
    category?: string;              
    description?: string;
}