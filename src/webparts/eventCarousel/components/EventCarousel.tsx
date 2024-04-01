import * as React from 'react';
import styles from './EventCarousel.module.scss';
import { IEventCarouselProps } from './IEventCarouselProps';
import { escape } from '@microsoft/sp-lodash-subset';
import Slider from "react-slick";
import Modal from 'react-modal';
import { SPComponentLoader } from '@microsoft/sp-loader';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ItemsService } from "../../../services/spservices"
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import EventDialogComponent from './EventDialog';
import Loader from '../../../shared/components/loader';
import 'office-ui-fabric-react/dist/css/fabric.css';
export interface ISliderListItemsState {
  Title: string,
  ID: number,
  StartDate: string,
  EndDate: string,
  items: any,
  carouselRef: any,
  isDialogOpen: boolean,
  selectedEvent: any,
  isLoading: boolean,
  isHovered: boolean
}

const modalStyles = {
  content: {
    width: '650px',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '0px!important',
    border: 'none'
    // Add any other styles you need
  },
};
export default class EventCarousel extends React.Component<IEventCarouselProps, ISliderListItemsState> {
  private itemService: ItemsService = null;
  public constructor(props: IEventCarouselProps, state: { ISliderListItemsState }) {
    super(props);
    this.state = {
      Title: "",
      ID: 0,
      StartDate: "",
      EndDate: "",
      items: [],
      carouselRef: null,
      isDialogOpen: false,
      selectedEvent: null,
      isLoading: false,
      isHovered: false
    };

    this.itemService = new ItemsService(this.props.context)
    //this.setState({carouselRef : React.createRef()});
  }
  public componentWillMount(): void {
  }

  handleCardClick = (event) => {

    this.setState({
      isDialogOpen: true,
      selectedEvent: event,
    });
  };

  handleCloseDialog = () => {
    this.setState({
      isDialogOpen: false,
      selectedEvent: null
    });
  };

  onMouseEnter = () => {
    this.setState({
      isHovered: true
    })
  }
  onMouseLeave = () => {
    this.setState({
      isHovered: false
    })
  }
  private async _ReadItem(load: boolean) {
    this.setState({ isLoading: true });

    try {

      const currentDate = this.props.eventStartDate;
      const sevenDaysAgo = new Date(currentDate.toString());
      sevenDaysAgo.setDate(currentDate.getDate() - 120);
      let formattedDate = sevenDaysAgo.toISOString().slice(0, 10);
      formattedDate = formattedDate + 'T00:00:00z';

      const thirtyDaysFromNow = new Date(currentDate.toString());
      thirtyDaysFromNow.setDate(currentDate.getDate() + 180);
      let formattedEndDate = thirtyDaysFromNow.toISOString().slice(0, 10);
      formattedEndDate = formattedEndDate + 'T00:00:00z';

      const payload = {
        title: this.props.title,
        eventStartDate: formattedDate,
        eventEndDate: formattedEndDate,
        listDetails: this.props.listDetails
      }
      let data = [];
      const savedResult = window.localStorage.getItem("calevents");

      if (savedResult !== null && savedResult !== undefined && savedResult !== '' && !load) {

        data = JSON.parse(savedResult);

      }
      else {

        const item = await this.itemService.getListElement(payload, this.itemService.calendarGroups(), this.props.context);
        console.log(this.state.items);
        data = item;

      }
      const today = new Date();
      const filteredData = data && data.filter(items => new Date(items.EventDate) >= today);

      this.setState({ items: filteredData });

    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      this.setState({ isLoading: false });
    }
  }


  public componentDidMount(): void {
    this._ReadItem(false);
  }

  private CustomNextArrow = (props) => {
    const { onClick } = props;
    return <div style={{ display: this.state.isHovered ? "block" : "none" }} className={`${styles['custom-arrow']} ${styles['custom-next-arrow']}`} onClick={onClick}><Icon iconName='ChevronRight' /></div>;
  };

  private CustomPrevArrow = (props) => {
    const { onClick } = props;
    return <div style={{ display: this.state.isHovered ? "block" : "none" }} className={`${styles['custom-arrow']} ${styles['custom-prev-arrow']}`} onClick={onClick}> <Icon iconName='ChevronLeft' /></div>;
  };
  public render(): React.ReactElement<IEventCarouselProps> {
    const {
      title,
      eventStartDate,
      eventEndDate,
      listDetails,
      slidesCount,
      context,
      websiteurl,

    } = this.props;
    let settings: any = this.itemService.slickCarouselSettings();
    settings.nextArrow = <this.CustomNextArrow />;
    settings.prevArrow = <this.CustomPrevArrow />;

    settings.slidesToShow =  this.props.slidesCount?  Number(this.props.slidesCount): settings.slidesToShow;


    // // Find the index of the event for the current week
    // const currentWeekEventIndex = this.state.items.findIndex(event => this.isEventInCurrentWeek(event));

    // // Use Slick Carousel's slickGoTo method to navigate to the current week's event
    // if (this.state.carouselRef.current && currentWeekEventIndex !== -1) {
    //   this.state.carouselRef.current.slickGoTo(currentWeekEventIndex);
    // }


    if (this.state.isLoading) {
      return <Loader />;
    }
    else {

      return (

        <div className={styles['slick-content']}>
          <div  className="ms-Grid">
            <h3>
              {this.props.title}
            </h3>

          </div>

          <div className={styles['button-container']}>

            <div style={{ display: "flex" }} >
              <div className={styles['add-event-button']} style={{ marginRight: "5px" }} onClick={() => window.open(`${context.pageContext.web.absoluteUrl}/_layouts/15/Event.aspx?ListGuid={YOUR_LIST_ID}&Mode=Edit`)}>
                <Icon iconName='Add' style={{ marginRight: "5px" }} /> <span style={{ lineHeight: "16px" }} >Add event</span>
              </div>
              <div style={{ marginLeft: "15px", cursor: "pointer" }} onClick={() => this._ReadItem(true)} >
                <Icon iconName='Refresh' style={{ marginRight: "5px", fontWeight: "600" }} /> <span style={{ lineHeight: "16px" }} >Refresh</span>
              </div>
            </div>



            <span className={styles['view-all-button']} onClick={() => window.open(`${context.pageContext.web.absoluteUrl}/_layouts/15/Events.aspx?Page=${context.pageContext.web.serverRelativeUrl}&InstanceId=25c26266-dac3-4346-97fb-4e581546fd58&AudienceTarget=false`)}>See all</span>
          </div>
          <div className="item-placeholder" style={{ minHeight: "380px" }} onMouseEnter={() => this.onMouseEnter()} onMouseLeave={() => this.onMouseLeave()}>

            <Slider  {...settings}>
              {this.state.items && this.state.items.length > 0 && this.state.items.map((card, index) => (

                // onClick={() => window.open(`${card.siteUrl}/_layouts/15/Event.aspx?ListGuid=${card.listId}&ItemId=${card.Id}`)} 

                <div key={index} className={styles['card-container']}>
                  <div className={styles['card-background']} onClick={() => this.handleCardClick(card)}>
                    <div className={styles['card-image']}>
                      {/* Your background image */}
                      {card.BannerUrl && (
                        <img src={card.BannerUrl}
                          onError={() => this.itemService.handleImageError(event)}
                          alt="Event Image" />
                      )
                      }
                      <div className={styles['date-overlay']}>
                        <div className={styles['month']}>{new Date(card.EventDate).toLocaleString('en-US', { month: 'short' })}</div>
                        <div className={styles['date']}>
                          {new Date(card.EventDate).getDate()}
                        </div>

                      </div>

                    </div>
                    <div className={styles['card-gradient']}></div>
                  </div>
                  <div className={styles['card-content']} onClick={() => this.handleCardClick(card)}>
                    <div className={styles['card-header']}>
                      <p style={{ margin: "0px", padding: "5px 0px", fontSize: "12px" }}>
                        <a href={card.siteUrl} className={styles['card-site-name']}>{card.siteName}</a></p>
                      <span className={styles['card-title']}>{card.title}</span>
                    </div>
                    <p className={styles['card-description']}></p>
                    <p>{card.locaion}</p>
                    <p className={styles['card-end-date']}>{this.itemService.formatDateTime(card.EventDate)}</p>
                    <p className={styles['profile-container']}>
                      <img className={styles['profile-img']} src={`${context.pageContext.web.absoluteUrl}/_layouts/15/userphoto.aspx?UserName=${card.ownerEmail}&size=s`} draggable="false" /> <span className={styles['profile-name']} >{card.ownerName}</span>
                    </p>
                    <div className={styles['card-location']}>
                      <span title={card.location}>{card.location}</span>
                    </div>
                  </div>
                  <div className={styles['card-ics']}>
                    <a onClick={() => this.itemService.downloadEvent(card)} download={card.title + '.ics'} ><Icon iconName='AddEvent' /></a>
                  </div>
                </div>
              ))}
            </Slider>
            <Modal
              isOpen={this.state.isDialogOpen}
              onRequestClose={this.handleCloseDialog}
              style={modalStyles}
            >
              {this.state.isDialogOpen && (
                <EventDialogComponent
                  onClose={this.handleCloseDialog}
                  eventData={this.state.selectedEvent}
                  context={this.props.context}
                // Pass any other necessary props to your dialog component
                />
              )}
            </Modal>
          </div>
        </div>
      );
    }
  }
}
