import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface INewsProps {
    title: string;
    context?: WebPartContext;
   
  }

  
export interface INewsItem {
  Title: string;
  Description: string;
  ImageUrl: string;
  Url: string;
  EventDate?:any;
  SiteName?:string;
  SiteUrl?:string;
  Author?:string;
  
}
  