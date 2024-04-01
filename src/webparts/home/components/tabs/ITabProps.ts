import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ITabProps {
    title: string;
    slidesCount:number;
    context?: WebPartContext;
   
  }
  