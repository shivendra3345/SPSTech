export interface ITickerState {
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
    banner?:any;
    link?:any;
}


export interface IPeopleItemObj {
    name: string;
    id?:string;    
    email?: string;              
    jobtitle?: string;    
}

export interface INavItemObj {
    title: string;
    id:string;    
    parent?: string;              
    link?: string; 
    order?:number   
}