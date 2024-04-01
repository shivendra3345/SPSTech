import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IEventCarouselProps {
  // description: string;
  // isDarkTheme: boolean;
  // environmentMessage: string;
  // hasTeamsContext: boolean;
  // userDisplayName: string;
  title:string;
  eventStartDate?:Date;
  eventEndDate?:Date;
  listDetails?:string[];
  slidesCount:number;
  context?:WebPartContext;
  websiteurl?:string;
 
  
}
