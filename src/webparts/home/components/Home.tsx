import * as React from 'react';
import styles from './Home.module.scss';
import { IHomeProps } from './IHomeProps';
import { escape } from '@microsoft/sp-lodash-subset';
import HeroBanner from './hero-banner/HeroBanner';
import MainMenuBar from './navigation/MainMenuBar';
import Ticker from './ticker/Ticker';
import Tab from './tabs/Tab';
import News from './news/News';
import QuickLinks from './quickLinks/QuickLinks';
import People from './people/People';
import Feed from './yammer/feed';
import EventCarousel from '../../eventCarousel/components/EventCarousel';
import 'office-ui-fabric-react/dist/css/fabric.css';
import '../../../assets/css/custom.css';

import { SPComponentLoader } from '@microsoft/sp-loader';

export default class Home extends React.Component<IHomeProps, {}> {
  public componentWillMount(): void {
    SPComponentLoader.loadCss('https://static2.sharepointonline.com/files/fabric/office-ui-fabric-core/11.0.0/css/fabric.min.css');
  }

  public render(): React.ReactElement<IHomeProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName

    } = this.props;

    let menuItems = [ 
    {
      id: 2,
      title: 'marketing',
      link:'',
      order:2,
      category:'link',
      subMenuItems: [{
        id: 6,
        title: 'menu1',
        link:'',
        order:2,
        category:'link',

        subMenuItems: [{
          id: 99,
          title: 'grand-child 1',
          link:'',
          order:2,
          category:'link',
        },
        {
          id: 990,
          title: 'grand-child 2',
          link:'',
          order:2,
          category:'link',
        }
        ]

      },
      {
        id: 7,
        title: 'menu2',
        link:'',
        order:2,
        category:'link',
        subMenuItems: [{
          id: 999,
          title: 'grand-child 3',
          link:'',
          order:2,
          category:'link',
        },
        {
          id: 991,
          title: 'grand-child 4',
          link:'',
          order:2,
          category:'link',
        }
        ]
      }
      ]

    } 
    ]

    let eventEndDate = new Date('2023-12-10T00:00:00Z');
    let eventStartDate = new Date('2024-04-08T00:00:00Z');
    let listDetails = [{
      "siteUrl": "https://terraengineering.sharepoint.com/sites/SPVendorTest/",
      "listId": "B43D5500-6326-4E83-99D4-1C070F5A22C2",
      "siteName": "SPVendorTest",
      "eventStartDate": "2023-12-10T00:00:00z",
      "eventEndDate": "2024-04-08T00:00:00z"
    }];
    let slidesCount = 3;
    return (
      <>
        <section className={`${styles['grid-container-one-col']} ${styles.responsiveContainer}`}>
          {
            (this.props.showHeroBanner === 'yes') ?
              <HeroBanner context={this.props.context} title={this.props.description}></HeroBanner>
              : <></>
          }

        </section>
        <section className={`${styles['grid-container-one-col']} ${styles.responsiveContainer}`}>
          {
            (this.props.showAnnouncement === 'yes') ?
              <Ticker context={this.props.context} title={this.props.description}></Ticker>
              : <></>
          }

          {
            (this.props.showTabs === 'yes') ?
              <Tab context={this.props.context} slidesCount={this.props.slidesCount} title={this.props.description}></Tab>
              : <></>
          }



          {
            (this.props.showMenuBar === 'yes') ?
              <MainMenuBar context={this.props.context} menuItems={menuItems}></MainMenuBar>
              : <></>
          }




        </section>
        <section className={`${styles['grid-container-two-col']} ${styles.responsiveContainer}`}>
          <div className={`ms-Grid ${styles.responsiveInnerGrid}`}>

            {
              (this.props.showLeftPanel === 'yes') ?
                <>
                  <QuickLinks context={this.props.context} slidesCount={this.props.slidesCount} title={this.props.description}></QuickLinks>
                  <People context={this.props.context} slidesCount={this.props.slidesCount} title={this.props.peopleWptitle}></People>

                  <Feed context={this.props.context} yammerlink={this.props.yammerlink} title={this.props.description}></Feed>


                </>
                : <></>
            }

          </div>
          <div className={`ms-Grid ${styles.responsiveInnerGrid}`} style={{ padding: '0px 10px' }}>
            {
              (this.props.showNews === 'yes') ?
                <News context={this.props.context} title={this.props.description}></News>
                : <></>
            }
            {
              (this.props.showEvents === 'yes') ?
                <EventCarousel context={this.props.context} eventEndDate={eventEndDate} eventStartDate={eventStartDate} listDetails={this.props.listDetails} slidesCount={slidesCount} title={this.props.calendarWptitle}></EventCarousel>

                : <></>
            }

          </div>
        </section>



      </>
    );
  }
}
