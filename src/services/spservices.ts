import { ClipboardEvent } from 'react';



import { spfi, SPFI, SPFx } from "@pnp/sp";
import "@pnp/sp/search";
import { ISearchQuery, SearchResults, SearchQueryBuilder } from "@pnp/sp/search";
import "@pnp/sp/batching";
import "@pnp/logging";
import { getSP } from "./pnpjsconfig";
import { Caching, ICachingProps } from "@pnp/queryable";
import "@pnp/sp/site-groups";
import { Web } from "@pnp/sp/webs";
import "@pnp/sp/items/get-all";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/profiles";
import { IItemAddResult } from "@pnp/sp/items";
import "@pnp/sp/regional-settings/web";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import parseRecurrentEvent from './parseRecurrentEvent';

import { IEventData, ITokenComment } from './IEventData';
import { MSGraphClient } from '@microsoft/sp-http';
import { IItemObj } from '../webparts/home/components/ticker/ITickerState';
import { IPeopleItemObj ,INavItemObj} from '../webparts/home/components/ticker/ITickerState';
import * as moment from 'moment';
import { INewsItem } from '../webparts/home/components/news/INewsProps';
import { graphfi, GraphFI } from '@pnp/graph';
interface MenuItem {
    id: number;
    title: string;
    parent?: number;
    category: string,
    order:number,
    link:string

  }
  
  interface Menu {
    id: number;
    title: string;
    category: string,
    order:number,
    subMenuItems?: Menu[];
    link:string
  }

export class ItemsService {
    private _sp: SPFI;
    private _graph: GraphFI;

    constructor(private context: WebPartContext) {
        // this._sp = spfi().using(SPFx(this.context));

        this._sp = spfi().using(SPFx(context));
        this._graph = graphfi().using(SPFx(context));

    }
    //get helpdesk categories
 


    public async currentWeb() {
        try {
            let _sp: SPFI = getSP();
            _sp = _sp ? _sp : this._sp;
            const spCache = spfi(_sp);//.using(Caching("session"));
            const siteUrl: string = this.context.pageContext.site.absoluteUrl;
            //console.log(siteUrl);
            const web = Web([spCache.web, siteUrl]);
            return web;
        }
        catch (ex) {
            console.log(ex);

        }
    }


    public async _config() {
        let ListName: any = "config";
        let config = [];
        const web = await this.currentWeb();
        const response: any = await web.lists
            .getByTitle(ListName)
            .items
            .select("ID,Title,json,isactive")
            .top(1000)
            .orderBy("ID", false)
            .filter('isactive eq 1')();
        response.map((item) => {
            config.push({
                id: item.Id,
                title: item.Title,
                json: item.json
            })

        });
        return config;
    }
   // https://terraengineering.sharepoint.com/sites/SPvendortest/Lists/Navigation/
    
    public async _GetNav() {
        let ListName: any = "Navigation";      
        let navArray: Array<MenuItem> = [];

        const web = await this.currentWeb();
        const response: any = await web.lists
            .getByTitle(ListName)
            .items
            .select("ID,Title,Parent/Title,Parent/Id,Link,Category,IsActive")
            .expand("Parent")
            .top(1000)
            .orderBy("ID", false)
            .filter('IsActive eq 1')();
        response.map((item) => {
            navArray.push({
                id: item.Id,
                title: item.Title,
                parent: item.Parent? item.Parent.Id  : 0 ,
                order:item.Id,
                category:item.Category,
                link: item.Link            
            })

        });

       let menu = this.arrayToMenu(navArray);

        return menu;
    }

    arrayToMenu(menuItems: MenuItem[]): Menu[] {
        const menuMap: { [key: number]: Menu } = {};
        const roots: Menu[] = [];
      
        // Create a map of menu items based on their IDs
        menuItems.forEach(item => {
          menuMap[item.id] = { ...item, subMenuItems: [] };
        });
      
        // Build the menu hierarchy
        menuItems.forEach(item => {
          if (item.parent !== undefined && item.parent !== 0) {
            const parent = menuMap[item.parent];
            if (parent) {
              parent.subMenuItems.push(menuMap[item.id]);
            }
          } else {
            roots.push(menuMap[item.id]);
          }
        });
      
        return roots;
      }
      


    public async _HeroBanner() {
        let ListName: any = "Banner";
        let tickerArray: Array<IItemObj> = [];

        const web = await this.currentWeb();
        const response: any = await web.lists
            .getByTitle(ListName)
            .items
            .select("ID,Title,Thumbnail,FileRef")
            .top(1000)
            .orderBy("ID", false)
            ();
        response.map((item) => {
            tickerArray.push({
                id: item.Id,
                title: item.Title,
                banner: item.FileRef,


            })

        });
        return tickerArray;
    }

    public async _getPeople() {
        let ListName: any = "People";
        let tickerArray: Array<IPeopleItemObj> = [];

        const web = await this.currentWeb();
        const response: any = await web.lists
            .getByTitle(ListName)
            .items
            .select("ID,Title,Employee/Title,Employee/JobTitle,Employee/EMail,IsActive")
            .expand("Employee")
            .top(1000)
            .orderBy("ID", false)
            .filter('IsActive eq 1')();
        response.map((item) => {
            tickerArray.push({
                id: item.Id,
                name: item.Employee.Title,
                jobtitle: item.Employee.JobTitle,
                email: item.Employee.EMail
            })

        });
        return tickerArray;
    }
    public async _getTicker() {
        let ListName: any = "Announcement";
        let tickerArray: Array<IItemObj> = [];

        const web = await this.currentWeb();
        const response: any = await web.lists
            .getByTitle(ListName)
            .items
            .select("ID,Title,Description,IsActive")
            .top(1000)
            .orderBy("ID", false)
            .filter('IsActive eq 1')();
        response.map((item) => {
            tickerArray.push({
                id: item.Id,
                title: item.Title,
                category: item.Category,
                description: item.Description
            })

        });
        return tickerArray;
    }

    public async _getTab() {



        let ListName: any = "Tabs";
        let tickerArray: Array<IItemObj> = [];

        const web = await this.currentWeb();
        const response: any = await web.lists
            .getByTitle(ListName)
            .items
            .select("ID,Title,Link,Logo,IsActive,TabOrder")
            .top(1000)
            .orderBy("TabOrder", false)
            .filter('IsActive eq 1')();
        response.map((item) => {
            tickerArray.push({
                id: item.Id,
                title: item.Title,
                banner: item.Logo,
                description: item.Tab,
                link: item.Link
            })

        });
        return tickerArray;
    }


    public async _getQuickLinks() {
        let ListName: any = "QuickLinks";
        let tickerArray: Array<IItemObj> = [];

        const web = await this.currentWeb();
        const response: any = await web.lists
            .getByTitle(ListName)
            .items
            .select("ID,Title,Link,IsActive,Order0")
            .top(1000)
            .orderBy("Order0", false)
            .filter('IsActive eq 1')();
        response.map((item) => {
            tickerArray.push({
                id: item.Id,
                title: item.Title,
                description: item.Link
            })

        });
        return tickerArray;
    }




    public async getNewsItems(): Promise<INewsItem[]> {
        const sp: SPFI = spfi().using(SPFx(this.context));
        //  const web = await this.currentWeb();
        const queryText = "IsDocument:True AND FileExtension:aspx AND PromotedState:2";
        const results = await sp.search({
            Querytext: queryText,
            // SelectProperties: ["Title", "Description", "ImageUrl", "Url"],
            RowLimit: 4,
            SortList: [{ 'Property': 'LastModifiedTime', 'Direction': 1 }] //{'Property':'Rank','Direction':1},

        });
        const newsItems: INewsItem[] = results.PrimarySearchResults.map((result) => {

            return {
                Title: result.Title,
                Description: result.Description,
                ImageUrl: result.PictureThumbnailURL,
                Url: result.OriginalPath,
                SiteName: result.SiteName,
                SiteUrl: result.SPWebUrl,
                EventDate: result.LastModifiedTime,
                Author: result.Author
            };
        });
        return newsItems;
    }

    public greetingBanner() {
        return window.localStorage.getItem("closeGreeting");
    }

    public closeGreetings() {
        window.localStorage.setItem("closeGreeting", 'hide');
    }


    getFormattedDate = () => {
        let date = new Date();
        let str = date.getFullYear() + "_" + (date.getMonth() + 1) + "_" + date.getDate() + "_" + date.getHours() + "_" + date.getMinutes() + "_" + date.getSeconds();

        return str;
    }

    //This is going to bring you many details of an element.
    public async getDetailedListElement(list: string, id: number) {
        let singleItemQuery = `<View><Query>
      <Where>
         <Eq>
            <FieldRef Name='ID' />
            <Value Type='Counter'>${id}</Value>
         </Eq>
      </Where>
   </Query></View>`;
        let singleElement = await (
            await this._sp.web.lists
                .getByTitle(list)
                .renderListDataAsStream({ ViewXml: singleItemQuery })
        ).Row[0];
        return singleElement;
    }

    //This is going to bring you just the data that the pnp method is calling.
    public async getListElement(payload: any, groups: any, context: WebPartContext) {
        const graph = context.msGraphClientFactory;
        // graph.getClient().then((client: MSGraphClient) )

        let listDetails: any = JSON.parse(payload.listDetails);
        let Groups: any = JSON.parse(payload.listDetails);
        let events: any = [];
        for (let i = 0; i < listDetails.length; i++) {
            let data: any = await this.getEvents(listDetails[i].siteUrl, listDetails[i].listId, payload.eventStartDate, payload.eventEndDate, listDetails[i].siteName);
            events = [...events, ...data];
        }
        let data: any = await this.getGroupCalEvents(groups, [], payload.eventStartDate, payload.eventEndDate, graph);
        events = [...events, ...data];
        events = events.sort(this.compareEvents);

        window.localStorage.setItem("calevents", JSON.stringify(events));





        return events;
    }
    private compareEvents(event1, event2) {
        return event1.EventDate - event2.EventDate;
    }

    public async getEvents(siteUrl: string, listId: string, eventStartDate: any, eventEndDate: any, siteName: string): Promise<IEventData[]> {


        const bannerImages: string[] = [
            'https://terraengineering.sharepoint.com/sites/SPVendorTest/Shared%20Documents/UI-ARC-Plazza.jpg'
            
        
        ];
        let events: IEventData[] = [];
        if (!siteUrl) {
            return [];
        }
        try {
            // Get Category Field Choices
            const categoryDropdownOption = [];//await this.getChoiceFieldOptions(siteUrl, listId, 'Category');
            let categoryColor: { category: string, color: string }[] = [];
            for (const cat of categoryDropdownOption) {
                categoryColor.push({ category: cat.text, color: await this.colorGenerate() });
            }

            const _sp = this._sp;
            const spCache = spfi(_sp);
            const web = Web([spCache.web, siteUrl]);
            const results = await web.lists.getById(listId).renderListDataAsStream(
                {
                    DatesInUtc: true,
                    ViewXml: `<View><ViewFields><FieldRef Name='BannerUrl'/><FieldRef Name='RecurrenceData'/><FieldRef Name='Duration'/><FieldRef Name='Author'/><FieldRef Name='Category'/><FieldRef Name='Description'/><FieldRef Name='ParticipantsPicker'/><FieldRef Name='Geolocation'/><FieldRef Name='ID'/><FieldRef Name='EndDate'/><FieldRef Name='EventDate'/><FieldRef Name='ID'/><FieldRef Name='Location'/><FieldRef Name='Title'/><FieldRef Name='fAllDayEvent'/><FieldRef Name='EventType'/><FieldRef Name='UID' /><FieldRef Name='fRecurrence' /></ViewFields>
                <Query>
                <Where>
                    <And>
                    <Geq>
                        <FieldRef Name='EventDate' />
                        <Value IncludeTimeValue='false' Type='DateTime'>${moment(eventStartDate).format('YYYY-MM-DD')}</Value>
                    </Geq>
                    <Leq>
                        <FieldRef Name='EventDate' />
                        <Value IncludeTimeValue='false' Type='DateTime'>${moment(eventEndDate).format('YYYY-MM-DD')}</Value>
                    </Leq>
                    </And>
                </Where>
                </Query>
                <RowLimit Paged=\"FALSE\">2000</RowLimit>
                </View>`
                }
            );

            if (results && results.Row.length > 0) {
                let event: any = '';
                const mapEvents = async (): Promise<boolean> => {
                    for (event of results.Row) {
                        const eventDate = event.EventDate;//await this.getLocalTime();
                        const endDate = event.EndDate;//this.getLocalTime() //await ;
                        const initialsArray: string[] = event.Author[0].title.split(' ');
                        const initials: string = initialsArray[0].charAt(0) + initialsArray[initialsArray.length - 1].charAt(0);
                        const userPictureUrl = await this.getUserProfilePictureUrl(`i:0#.f|membership|${event.Author[0].email}`);
                        const attendees: number[] = [];
                        const first: number = event.Geolocation !== undefined ? event.Geolocation.indexOf('(') + 1 : null;
                        const last: number = event.Geolocation !== undefined ? event.Geolocation.indexOf('(') : null;
                        const geo = event.Geolocation !== undefined ? event.Geolocation.substring(first, last) : "";
                        const geolocation = geo !== undefined && geo !== "" ? geo.split(' ') : "";
                        const CategoryColorValue: any[] = categoryColor.filter((value) => {
                            return value.category == event.Category;
                        });
                        const isAllDayEvent: boolean = event["fAllDayEvent.value"] === "1";
                        if (event.ParticipantsPicker !== undefined && event.ParticipantsPicker !== null) {
                            for (const attendee of event.ParticipantsPicker) {
                                attendees.push(parseInt(attendee.id));
                            }
                        }


                        let streventDate: any = isAllDayEvent ? new Date(event.EventDate.slice(0, -1)) : new Date(eventDate);
                        let strendDate: any = isAllDayEvent ? new Date(event.EndDate.slice(0, -1)) : new Date(endDate);
                        // streventDate = streventDate.toDateString();
                        // strendDate = strendDate.toDateString();

                        //  streventDate = this.formatDate(streventDate);
                        //  strendDate = this.formatDate(strendDate);

                        let banner: string = bannerImages[Math.floor(Math.random() * bannerImages.length)];


                        events.push({
                            Id: event.ID,
                            ID: event.ID,
                            EventType: event.EventType,
                            title: await this.deCodeHtmlEntities(event.Title),
                            Description: event.Description,
                            EventDate: streventDate,
                            EndDate: strendDate,
                            location: event.Location,
                            ownerEmail: event.Author[0].email,
                            ownerPhoto: '',
                            ownerInitial: initials,
                            color: CategoryColorValue.length > 0 ? CategoryColorValue[0].color : '#1a75ff', // blue default
                            ownerName: event.Author[0].title,
                            attendes: attendees,
                            fAllDayEvent: isAllDayEvent,
                            geolocation: { Longitude: parseFloat(geolocation[0]), Latitude: parseFloat(geolocation[1]) },
                            Category: event.Category,
                            Duration: event.Duration,
                            RecurrenceData: event.RecurrenceData ? await this.deCodeHtmlEntities(event.RecurrenceData) : "",
                            fRecurrence: event.fRecurrence,
                            RecurrenceID: event.RecurrenceID ? event.RecurrenceID : undefined,
                            MasterSeriesItemID: event.MasterSeriesItemID,
                            UID: event.UID !== undefined ? event.UID.replace("{", "").replace("}", "") : null,
                            siteUrl: siteUrl,
                            siteName: siteName,
                            listId: listId,
                            BannerUrl: event.BannerUrl && event.BannerUrl !== "" ? event.BannerUrl : banner
                        });
                        //userPictureUrl ?
                        // `https://outlook.office365.com/owa/service.svc/s/GetPersonaPhoto?email=${event.Author[0].email}&UA=0&size=HR96x96` : '',

                    }
                    return true;
                };

                if (window.localStorage.getItem("eventResult")) {
                    if (window.localStorage.getItem("eventResult") === JSON.stringify(results)) {
                        events = JSON.parse(window.localStorage.getItem("calendarEventsWithLocalTime"));
                    } else {
                        window.localStorage.setItem("eventResult", JSON.stringify(results));
                        await mapEvents() ? window.localStorage.setItem("calendarEventsWithLocalTime", JSON.stringify(events)) : null;
                    }
                } else {
                    window.localStorage.setItem("eventResult", JSON.stringify(results));
                    await mapEvents() ? window.localStorage.setItem("calendarEventsWithLocalTime", JSON.stringify(events)) : null;
                }
            }
            let parseEvt: parseRecurrentEvent = new parseRecurrentEvent();
            events = parseEvt.parseEvents(events, null, null);

            // Return Data
            return events;
        } catch (error) {
            console.dir(error);
            return Promise.reject(error);
        }
    }

    public async getGroupCalEvents(CalendarList: any, CalEvents: any, eventStartDate: any, eventEndDate: any, graph: any): Promise<IEventData[]> {

        try {
            const bannerImages: string[] = [
                'https://terraengineering.sharepoint.com/sites/SPVendorTest/Shared%20Documents/UI-ARC-Plazza.jpg'
          
            ]
            const promises = CalendarList.map(async (calItem) => {
                const q2 = `/groups/${calItem.id}/calendarView?startDateTime=${eventStartDate}&endDateTime=${eventEndDate}`;
                const client = await graph.getClient();
                const eventsResponse = await client.api(q2).version("v1.0").select("*").top(100).get();


                if (eventsResponse && eventsResponse.value) {
                    const calendarEvents = eventsResponse.value;

                    for (const item of calendarEvents) {
                        let eventStartDate = item.start.dateTime;//this.formatDate(item.start.dateTime);
                        const endate = item.end.dateTime;// this.formatDate(item.end.dateTime);

                        if (item.isAllDay) {
                            eventStartDate = endate;
                        }

                        let banner: string = bannerImages[Math.floor(Math.random() * bannerImages.length)];
                        const obj = {
                            Id: CalEvents.length,
                            title: item.subject,
                            Description: item.body.content,
                            location: item.location !== null ? item.location.displayName : '',
                            EventDate: new Date(eventStartDate),
                            EndDate: new Date(endate),
                            color: calItem.color,
                            fAllDayEvent: item.isAllDay,
                            attendes: item.attendees,
                            ownerInitial: '',
                            ownerPhoto: `https://outlook.office365.com/owa/service.svc/s/GetPersonaPhoto?email=${item.organizer.emailAddress.address}&UA=0&size=HR96x96`,
                            ownerEmail: item.organizer.emailAddress.address,
                            ownerName: item.organizer.emailAddress.name,
                            DataSource: 'Outlook',
                            isAllDay: item.isAllDay,
                            BannerUrl: banner
                        };

                        CalEvents.push(obj);
                    }
                }
            });

            await Promise.all(promises);

            return CalEvents;
        } catch (error) {
            console.error(error);
            return CalEvents;
        }
    }

    private formatDate(dateTimeString: string): string {
        const ed = new Date(dateTimeString);
        const formattedDate = ed.toLocaleString("en-US", { timeZone: "America/New_York" });
        return formattedDate;
    }
    async generateICSFile(eventData: any) {
        const { title, description, startDate, endDate, location } = eventData;

        //  const formattedStartDate = startDate.toISOString().replace(/-/g, '').replace(/:/g, '').split('.')[0] + 'Z';
        //  const formattedEndDate = endDate.toISOString().replace(/-/g, '').replace(/:/g, '').split('.')[0] + 'Z';



    }


    public formatDateTime(inputDateString: string): string {

        const inputDate = new Date(inputDateString);

        const formattedDateString = inputDate.toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            timeZoneName: 'short'
        });

        return moment(inputDateString).format("dddd, MMM Do YYYY, h:mm a");

        //  return formattedDateString;
    }
    public formatDateOnly(inputDateString: string): string {

        const inputDate = new Date(inputDateString);

        const formattedDateString = inputDate.toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            timeZoneName: 'short'
        });

        return moment(inputDateString).format("MMM Do YYYY");

        //  return formattedDateString;
    }

    public async getUserProfilePictureUrl(loginName: string) {
        let results: any = null;
        try {
            const _sp = this._sp;
            const spCache = spfi(_sp);

            results = await spCache.profiles.getPropertiesFor(loginName);
        } catch (error) {
            results = null;
        }
        return results.PictureUrl;
    }
    public async getLocalTime(date: string | Date): Promise<string> {
        try {
              return date.toString();
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    public async colorGenerate() {

        var hexValues = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e"];
        var newColor = "#";

        for (var i = 0; i < 6; i++) {
            var x = Math.round(Math.random() * 14);

            var y = hexValues[x];
            newColor += y;
        }
        return newColor;
    }
    public calendarGroups() {
        return [
            {
                id: '3f1a93ee-4a0e-4fd2-8029-72db27ef972b',
                displayName: 'Training',
                color: '#7f2aff'
            },
            {
                id: '50330223-f5d8-4391-bb7e-65397ee5867e',
                displayName: 'Accounting',
                color: '#0259c2'
            }
            ,
            {
                id: 'aa76fdef-d651-4b02-a4dc-d2ee67f17a76',
                displayName: 'Operations',
                color: '#aa4600'
            }
            // ,
            // {
            //     id: 'afa6bed6-3be3-4ad8-a858-9d5850130821',
            //     displayName: 'HR_Loop',
            //     color: '#89ab00'
            // }

        ];
    }
    removeTags(str) {
        if ((str === null) || (str === ''))
            return false;
        else
            str = str.toString();

        return str.replace(/(<([^>]+)>)/ig, '');
    }

    public downloadEvent(event) {

        const start = new Date(event.EventDate).toISOString();// moment(event.EventDate).format('YYYY-M-D-H-m').split("-")
        const end = new Date(event.EndDate).toISOString(); //moment(event.EndDate).format("YYYY-M-D-H-m").split("-");
        let desc = `<!DOCTYPE >` + event.Description;
        let headposition = desc.indexOf('</head>');
        let position = desc.indexOf('<body');


        let text = '<title>' + event.title + '</title>';

        try {

            if (headposition > -1) {
                desc = [desc.slice(0, headposition - 1), text, desc.slice(headposition - 1)].join('');
            }
            else if (position > -1) {
                text = '<head>' + text + '</head>';
                desc = [desc.slice(0, position - 1), text, desc.slice(position - 1)].join('');
            }
            else if (event.Description == '') {
                desc = '<!DOCTYPE ><html><head>' + text + '</head><body></body></html>';
            }

        }
        catch (ex) {

        }


        const calendarData = [
            'data:text/calendar;charset=utf8,',
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'BEGIN:VEVENT',
            'DTSTART:' + start,
            'DTEND:' + end,
            'LOCATION:' + event.location,
            'SUMMARY:' + event.title,
            'X-ALT-DESC;FMTTYPE=text/html:' + escape(desc.replace(/[^\u0000-\u007E]/g, "").replace(/[\u0000-\u001F\u007F-\u009F]/g, "").replace(/[\u0000-\u001F\u007F-\u009F\u061C\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, "")),
            'TRANSP:TRANSPARENT',
            'END:VEVENT',
            'END:VCALENDAR',
            'UID:' + 1,
            'DTSTAMP:' + start,

        ].join('\n');




        window.open(calendarData);
    }
    public handleImageError = (event) => {

        event.target.src = '';
    };
    public slickCarouselSettings() {
        return {

            autoplay: false,
            autoplaySpeed: 3000,
            dots: false,
            infinite: false,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 4,
            initialSlide: 0,
            // nextArrow: <this.CustomNextArrow />,
            //  prevArrow: <this.CustomPrevArrow />,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3,
                        infinite: true,
                        dots: false
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        initialSlide: 1,
                        infinite: true,
                        dots: false
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        infinite: true,
                        dots: false
                    }
                }
            ]
        }
    }
    public slickTabCarouselSettings() {
        return {

            autoplay: false,
            autoplaySpeed: 3000,
            dots: false,
            infinite: false,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 4,
            initialSlide: 0,
            // nextArrow: <this.CustomNextArrow />,
            //  prevArrow: <this.CustomPrevArrow />,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3,
                        infinite: true,
                        dots: false
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1,
                        initialSlide: 1,
                        infinite: true,
                        dots: false
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1,
                        infinite: true,
                        dots: false
                    }
                }
            ]
        }
    }
    public async deCodeHtmlEntities(string: string) {

        const HtmlEntitiesMap = {
            "'": "&#39;",
            "<": "&lt;",
            ">": "&gt;",
            " ": "&nbsp;",
            "¡": "&iexcl;",
            "¢": "&cent;",
            "£": "&pound;",
            "¤": "&curren;",
            "¥": "&yen;",
            "¦": "&brvbar;",
            "§": "&sect;",
            "¨": "&uml;",
            "©": "&copy;",
            "ª": "&ordf;",
            "«": "&laquo;",
            "¬": "&not;",
            "®": "&reg;",
            "¯": "&macr;",
            "°": "&deg;",
            "±": "&plusmn;",
            "²": "&sup2;",
            "³": "&sup3;",
            "´": "&acute;",
            "µ": "&micro;",
            "¶": "&para;",
            "·": "&middot;",
            "¸": "&cedil;",
            "¹": "&sup1;",
            "º": "&ordm;",
            "»": "&raquo;",
            "¼": "&frac14;",
            "½": "&frac12;",
            "¾": "&frac34;",
            "¿": "&iquest;",
            "À": "&Agrave;",
            "Á": "&Aacute;",
            "Â": "&Acirc;",
            "Ã": "&Atilde;",
            "Ä": "&Auml;",
            "Å": "&Aring;",
            "Æ": "&AElig;",
            "Ç": "&Ccedil;",
            "È": "&Egrave;",
            "É": "&Eacute;",
            "Ê": "&Ecirc;",
            "Ë": "&Euml;",
            "Ì": "&Igrave;",
            "Í": "&Iacute;",
            "Î": "&Icirc;",
            "Ï": "&Iuml;",
            "Ð": "&ETH;",
            "Ñ": "&Ntilde;",
            "Ò": "&Ograve;",
            "Ó": "&Oacute;",
            "Ô": "&Ocirc;",
            "Õ": "&Otilde;",
            "Ö": "&Ouml;",
            "×": "&times;",
            "Ø": "&Oslash;",
            "Ù": "&Ugrave;",
            "Ú": "&Uacute;",
            "Û": "&Ucirc;",
            "Ü": "&Uuml;",
            "Ý": "&Yacute;",
            "Þ": "&THORN;",
            "ß": "&szlig;",
            "à": "&agrave;",
            "á": "&aacute;",
            "â": "&acirc;",
            "ã": "&atilde;",
            "ä": "&auml;",
            "å": "&aring;",
            "æ": "&aelig;",
            "ç": "&ccedil;",
            "è": "&egrave;",
            "é": "&eacute;",
            "ê": "&ecirc;",
            "ë": "&euml;",
            "ì": "&igrave;",
            "í": "&iacute;",
            "î": "&icirc;",
            "ï": "&iuml;",
            "ð": "&eth;",
            "ñ": "&ntilde;",
            "ò": "&ograve;",
            "ó": "&oacute;",
            "ô": "&ocirc;",
            "õ": "&otilde;",
            "ö": "&ouml;",
            "÷": "&divide;",
            "ø": "&oslash;",
            "ù": "&ugrave;",
            "ú": "&uacute;",
            "û": "&ucirc;",
            "ü": "&uuml;",
            "ý": "&yacute;",
            "þ": "&thorn;",
            "ÿ": "&yuml;",
            "Œ": "&OElig;",
            "œ": "&oelig;",
            "Š": "&Scaron;",
            "š": "&scaron;",
            "Ÿ": "&Yuml;",
            "ƒ": "&fnof;",
            "ˆ": "&circ;",
            "˜": "&tilde;",
            "Α": "&Alpha;",
            "Β": "&Beta;",
            "Γ": "&Gamma;",
            "Δ": "&Delta;",
            "Ε": "&Epsilon;",
            "Ζ": "&Zeta;",
            "Η": "&Eta;",
            "Θ": "&Theta;",
            "Ι": "&Iota;",
            "Κ": "&Kappa;",
            "Λ": "&Lambda;",
            "Μ": "&Mu;",
            "Ν": "&Nu;",
            "Ξ": "&Xi;",
            "Ο": "&Omicron;",
            "Π": "&Pi;",
            "Ρ": "&Rho;",
            "Σ": "&Sigma;",
            "Τ": "&Tau;",
            "Υ": "&Upsilon;",
            "Φ": "&Phi;",
            "Χ": "&Chi;",
            "Ψ": "&Psi;",
            "Ω": "&Omega;",
            "α": "&alpha;",
            "β": "&beta;",
            "γ": "&gamma;",
            "δ": "&delta;",
            "ε": "&epsilon;",
            "ζ": "&zeta;",
            "η": "&eta;",
            "θ": "&theta;",
            "ι": "&iota;",
            "κ": "&kappa;",
            "λ": "&lambda;",
            "μ": "&mu;",
            "ν": "&nu;",
            "ξ": "&xi;",
            "ο": "&omicron;",
            "π": "&pi;",
            "ρ": "&rho;",
            "ς": "&sigmaf;",
            "σ": "&sigma;",
            "τ": "&tau;",
            "υ": "&upsilon;",
            "φ": "&phi;",
            "χ": "&chi;",
            "ψ": "&psi;",
            "ω": "&omega;",
            "ϑ": "&thetasym;",
            "ϒ": "&Upsih;",
            "ϖ": "&piv;",
            "–": "&ndash;",
            "—": "&mdash;",
            "‘": "&lsquo;",
            "’": "&rsquo;",
            "‚": "&sbquo;",
            "“": "&ldquo;",
            "”": "&rdquo;",
            "„": "&bdquo;",
            "†": "&dagger;",
            "‡": "&Dagger;",
            "•": "&bull;",
            "…": "&hellip;",
            "‰": "&permil;",
            "′": "&prime;",
            "″": "&Prime;",
            "‹": "&lsaquo;",
            "›": "&rsaquo;",
            "‾": "&oline;",
            "⁄": "&frasl;",
            "€": "&euro;",
            "ℑ": "&image;",
            "℘": "&weierp;",
            "ℜ": "&real;",
            "™": "&trade;",
            "ℵ": "&alefsym;",
            "←": "&larr;",
            "↑": "&uarr;",
            "→": "&rarr;",
            "↓": "&darr;",
            "↔": "&harr;",
            "↵": "&crarr;",
            "⇐": "&lArr;",
            "⇑": "&UArr;",
            "⇒": "&rArr;",
            "⇓": "&dArr;",
            "⇔": "&hArr;",
            "∀": "&forall;",
            "∂": "&part;",
            "∃": "&exist;",
            "∅": "&empty;",
            "∇": "&nabla;",
            "∈": "&isin;",
            "∉": "&notin;",
            "∋": "&ni;",
            "∏": "&prod;",
            "∑": "&sum;",
            "−": "&minus;",
            "∗": "&lowast;",
            "√": "&radic;",
            "∝": "&prop;",
            "∞": "&infin;",
            "∠": "&ang;",
            "∧": "&and;",
            "∨": "&or;",
            "∩": "&cap;",
            "∪": "&cup;",
            "∫": "&int;",
            "∴": "&there4;",
            "∼": "&sim;",
            "≅": "&cong;",
            "≈": "&asymp;",
            "≠": "&ne;",
            "≡": "&equiv;",
            "≤": "&le;",
            "≥": "&ge;",
            "⊂": "&sub;",
            "⊃": "&sup;",
            "⊄": "&nsub;",
            "⊆": "&sube;",
            "⊇": "&supe;",
            "⊕": "&oplus;",
            "⊗": "&otimes;",
            "⊥": "&perp;",
            "⋅": "&sdot;",
            "⌈": "&lceil;",
            "⌉": "&rceil;",
            "⌊": "&lfloor;",
            "⌋": "&rfloor;",
            "⟨": "&lang;",
            "⟩": "&rang;",
            "◊": "&loz;",
            "♠": "&spades;",
            "♣": "&clubs;",
            "♥": "&hearts;",
            "♦": "&diams;"
        };

        var entityMap = HtmlEntitiesMap;
        for (var key in entityMap) {
            var entity = entityMap[key];
            var regex = new RegExp(entity, 'g');
            string = string.replace(regex, key);
        }
        string = string.replace(/&quot;/g, '"');
        string = string.replace(/&amp;/g, '&');
        return string;
    }
}
