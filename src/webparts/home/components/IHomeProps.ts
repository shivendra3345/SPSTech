import { WebPartContext  } from "@microsoft/sp-webpart-base";

export interface IHomeProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  context:WebPartContext;
  slidesCount:number;
  eventStartDate?:Date;
  eventEndDate?:Date;
  listDetails?:string[];
  calendarWptitle?:string;
  showAnnouncement:string;
  peopleWptitle:string;
  yammerlink:string;
  showTabs:string;
  showHeroBanner:string;
  showMenuBar:string;
  showNews:string;
  showEvents:string;
  showLeftPanel:string;
}
