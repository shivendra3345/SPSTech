export interface IFeedState {
    Title: string;
    ID: number;   
    items: Array<IFeedItemObj>;
    carouselRef: any;
    isLoading: boolean;
    isHovered: boolean;
}


export interface IFeedItemObj {
    name: string;
    id?:string;    
    email?: string;              
    jobtitle?: string;    
}