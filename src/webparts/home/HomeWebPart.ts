import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'HomeWebPartStrings';
import Home from './components/Home';
import { IHomeProps } from './components/IHomeProps';

import 'office-ui-fabric-react/dist/css/fabric.css';


export interface IHomeWebPartProps {
  description: string;
  slidesCount:number;
  eventStartDate: string;
  eventEndDate: string;
  listDetails: string[];
  calendarWptitle: string;
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

export default class HomeWebPart extends BaseClientSideWebPart<IHomeWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    const element: React.ReactElement<IHomeProps> = React.createElement(
      Home,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        context: this.context,
        slidesCount:this.properties.slidesCount,
        eventStartDate: new Date(this.properties.eventStartDate),
        eventEndDate: new Date(this.properties.eventEndDate),
        listDetails:this.properties.listDetails,
        calendarWptitle: this.properties.calendarWptitle,
        showAnnouncement: this.properties.showAnnouncement,
        peopleWptitle: this.properties.peopleWptitle,
        yammerlink:this.properties.yammerlink,
        showTabs:this.properties.showTabs,
        showHeroBanner:this.properties.showHeroBanner,
        showMenuBar:this.properties.showMenuBar,
        showNews:this.properties.showNews,
        showEvents:this.properties.showEvents,
        showLeftPanel:this.properties.showLeftPanel
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    this._environmentMessage = this._getEnvironmentMessage();

    return super.onInit();
  }

  private _getEnvironmentMessage(): string {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams
      return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
    }

    return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment;
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    const currentDate = new Date();
    const sevenDaysAgo = new Date(currentDate.toString());
    sevenDaysAgo.setDate(currentDate.getDate() - 30);
    let formattedDate = sevenDaysAgo.toISOString().slice(0, 10);
    formattedDate = formattedDate+'T00:00:00z';

    const thirtyDaysFromNow = new Date(currentDate.toString());
    thirtyDaysFromNow.setDate(currentDate.getDate() + 90);
    let formattedEndDate = thirtyDaysFromNow.toISOString().slice(0, 10);
    formattedEndDate = formattedEndDate+'T00:00:00z';
    
   let listDetails :any = [
    {
        siteUrl: 'https://terraengineering.sharepoint.com/sites/SPVendorTest/',
        listId: 'B43D5500-6326-4E83-99D4-1C070F5A22C2',
        siteName:'SPVendorTest',
        eventStartDate: formattedDate,
        eventEndDate:formattedEndDate
    }];
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('calendarWptitle', {
                  label: 'Calendar Carousel Title',
                  value: 'Important Dates'
                }),
                PropertyPaneTextField('peopleWptitle', {
                  label: 'People Webpart Title',
                  value: 'Welcome To TE'
                }),
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneTextField('slidesCount', {
                  label: 'Tabs To Show',
                  value: '5'
                }),
                PropertyPaneTextField('listDetails', {
                  label:'JSON List Detail',
                  multiline:true,
                  value: JSON.stringify(listDetails )                  
            
                }),
                PropertyPaneTextField('showAnnouncement', {
                  label:'Show Announcement',                  
                  value: 'no'              
            
                }),
                PropertyPaneTextField('showHrobanner', {
                  label:'Show Hero Banner',                  
                  value: 'no'              
            
                }),
                PropertyPaneTextField('showTabs', {
                  label:'Show Tabs',                  
                  value: 'no'              
            
                }),
                PropertyPaneTextField('showMenuBar', {
                  label:'Show Menu bar',                  
                  value: 'yes'              
            
                }),
                PropertyPaneTextField('showNews', {
                  label:'Show News',                  
                  value: 'no'              
            
                }),
                PropertyPaneTextField('showEvents', {
                  label:'Show Events',                  
                  value: 'no'              
            
                }),
                PropertyPaneTextField('showLeftPanel', {
                  label:'Show Left Panel',                  
                  value: 'no'              
            
                }),
                PropertyPaneTextField('yammerlink', {
                  label:'Yammer/Engage Link',                  
                  value: 'https://web.yammer.com/embed/groups/eyJfdHlwZSI6Ikdyb3VwIiwiaWQiOiI0OTk2NzQzOTg3MiJ9'              
            
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
