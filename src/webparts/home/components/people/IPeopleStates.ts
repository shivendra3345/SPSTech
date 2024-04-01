export interface IPeopleState {
    Title: string;
    ID: number;   
    items: Array<IPeopleItemObj>;
    carouselRef: any;
    isLoading: boolean;
    isHovered: boolean;
}


export interface IPeopleItemObj {
    name: string;
    id?:string;    
    email?: string;              
    jobtitle?: string;    
}