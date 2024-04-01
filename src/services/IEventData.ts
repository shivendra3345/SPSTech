export interface IEventData {
    Id?: number;
    ID?: number;
    title: string;
    Description?: any;
    location?: string;
    EventDate: string;
    EndDate: string;
    color?: string;
    ownerInitial?: string;
    ownerPhoto?: string;
    ownerEmail?: string;
    ownerName?: string;
    fAllDayEvent?: boolean;
    attendes?: number[];
    geolocation?: { Longitude: number, Latitude: number };
    Category?: string;
    Duration?: number;
    RecurrenceData?: string;
    fRecurrence?: string | boolean;
    EventType?: string;
    UID?: string;
    RecurrenceID?: Date;
    MasterSeriesItemID?: string;
    siteUrl?:string;
    siteName?:string;
    listId?:string;
    BannerUrl?:string
  }

  export interface ITokenComment {
    ActionDescription:string;
    TokenIdId:number;
    Sender:string;
    TaggedUser?:string;
  }