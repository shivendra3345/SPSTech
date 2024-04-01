import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'EventCarouselWebPartStrings';
import EventCarousel from './components/EventCarousel';
import { IEventCarouselProps } from './components/IEventCarouselProps';
 

export interface IEventCarouselWebPartProps {
  title: string;
  eventStartDate: string;
  eventEndDate: string;
  listDetails: string[];
  slidesCount: number;
}

export default class EventCarouselWebPart extends BaseClientSideWebPart<IEventCarouselWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    const element: React.ReactElement<IEventCarouselProps> = React.createElement(
      EventCarousel,
      {
        
        title:this.properties.title,
        eventStartDate: new Date(this.properties.eventStartDate),
        eventEndDate: new Date(this.properties.eventEndDate),
        listDetails:this.properties.listDetails,
        slidesCount:this.properties.slidesCount,
        context:this.context
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
    const sevenDaysAgo = new Date(currentDate.toDateString());
    sevenDaysAgo.setDate(currentDate.getDate() - 30);
    let formattedDate = sevenDaysAgo.toISOString().slice(0, 10);
    formattedDate = formattedDate+'T00:00:00z';

    const thirtyDaysFromNow = new Date(currentDate.toDateString());
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
    } 
   ];
    return {
      pages: [
        {
          header: {
            description: 'Configure Event Carousel Webpart'
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('title', {
                  label:'Title',
                  value:'Residential New Hire Dates'
                }),
                PropertyPaneTextField('eventStartDate', {
                  label:'Start Date',
                  value:formattedDate
                }),
                PropertyPaneTextField('eventEndDate', {
                  label:'End Date',
                  value:formattedEndDate
                }),
                PropertyPaneTextField('listDetails', {
                  label:'JSON List Detail',
                  multiline:true,
                  value: JSON.stringify(listDetails )                  
            
                }),
                PropertyPaneTextField('slidesCount', {
                  label:'Slides To Show',
                  value:'3'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
