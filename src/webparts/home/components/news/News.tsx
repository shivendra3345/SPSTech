import * as React from 'react';
import styles from './News.module.scss';
import { INewsProps, INewsItem } from './INewsProps';
import { IItemObj, INewsState } from './INewsState';
import { escape } from '@microsoft/sp-lodash-subset';
import Slider from "react-slick";
import Modal from 'react-modal';
import { SPComponentLoader } from '@microsoft/sp-loader';

import { ItemsService } from "../../../../services/spservices"
import { Icon } from 'office-ui-fabric-react/lib/Icon';
 

export default class Home extends React.Component<INewsProps, INewsState> {
    private itemService: ItemsService = null;
    public constructor(props: INewsProps, state: INewsState) {
        super(props);
        this.state = {
            Title: "",
            ID: 0,
            items: [],
            carouselRef: null,
            isLoading: false,
            isHovered: true,
            newsCardActive: true,
            newsCarouselActive: false

        };

        this.itemService = new ItemsService(this.props.context)

    }
    public componentWillMount(): void {
    }

    public componentDidMount(): void {
        this.itemService.getNewsItems().then((data) => {
            this.setState({ items: data })
        });

    }
    public handleCardClick(card: any) {
        window.open(card.Url);
    }

    private CustomNextArrow = (props) => {
        const { onClick } = props;
        return <div style={{ display: this.state.isHovered ? "block" : "none" }} className={`${styles['custom-arrow']} ${styles['custom-next-arrow']}`} onClick={onClick}><Icon iconName='ChevronRight' /></div>;
    };

    private CustomPrevArrow = (props) => {
        const { onClick } = props;
        return <div style={{ display: this.state.isHovered ? "block" : "none" }} className={`${styles['custom-arrow']} ${styles['custom-prev-arrow']}`} onClick={onClick}> <Icon iconName='ChevronLeft' /></div>;
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
    public render(): React.ReactElement<INewsProps> {
        const {
            title,
        } = this.props;
        let settings: any = this.itemService.slickCarouselSettings();
        settings.nextArrow = <this.CustomNextArrow />;
        settings.prevArrow = <this.CustomPrevArrow />;
        settings.slidesToShow = 3;

        return (
            <div className={`${styles['news-wrapper']} ${styles.responsiveNewsWrapper}`}>  
                <div className="ms-Grid">
                     <div className="ms-grid-row">
                        <h3>News</h3>
                    </div>
                    <div className={styles['button-container']}>
                        <div style={{ display: "flex" }} >
                            <div className={styles['add-event-button']} style={{ marginRight: "5px" }} onClick={() => window.open(`${this.props.context.pageContext.web.absoluteUrl}/_layouts/15/CreatePageFromTemplate.aspx?source=%2Fsites%2Ftheloop&promotedState=1`)}>
                                <Icon iconName='Add' style={{ marginRight: "5px" }} /> <span style={{ lineHeight: "16px" }} >Add News Post</span>
                            </div>
                        </div>
                        <span className={styles['view-all-button']} onClick={() => window.open(`${this.props.context.pageContext.web.absoluteUrl}/_layouts/15/news.aspx?Page=${this.props.context.pageContext.web.serverRelativeUrl}&InstanceId=25c26266-dac3-4346-97fb-4e581546fd58&AudienceTarget=false`)}>See all</span>
                    </div>
                </div>
                <div className="ms-Grid" style={{padding:'10px'}}>
                    {
                        this.state.newsCardActive ?


                        <div className={styles['grid-container-two-col']}>
                                {this.state.items && this.state.items.length > 0 && this.state.items.map((card, index) => (
                                    <>
                                        {(index === 0)
                                            ?
                                            <div className={`${styles['news-col-left']} ${'ms-Grid'} `} >
                                                <div className="ms-Grid-row" onClick={() => this.handleCardClick(card)}>
                                                    <div className={styles['card-image']} style={{ 'height': 'auto' }}>
                                                        {/* Your background image */}
                                                        {card.ImageUrl && (
                                                            <img src={card.ImageUrl}
                                                                style={{ 'height': '360px' }}
                                                                onError={() => this.itemService.handleImageError(event)}
                                                                alt="Event Image" />
                                                        )
                                                        }
                                                    </div>
                                                    {/* <div className={styles['card-gradient']}></div> */}
                                                </div>
                                                <div className="ms-Grid-row" onClick={() => this.handleCardClick(card)}>
                                                    <div className={styles['card-header']}>
                                                        <p style={{ margin: "0px", padding: "5px 0px", fontSize: "12px" , display:"none"}}>
                                                            <a href={card.SiteUrl} className={styles['card-site-name']}>{card.SiteName}</a></p>
                                                        <span className={styles['card-title']}>{card.Title}</span>
                                                    </div>
                                                    <p className={styles['card-description-1']}>{card.Description}</p>

                                                    <p className={styles['profile-container']}>
                                                        <img className={styles['profile-img']} src={`${this.props.context.pageContext.web.absoluteUrl}/_layouts/15/userphoto.aspx?UserName=${card.Author}&size=s`} draggable="false" /> <span className={styles['profile-name']} >{card.Author} </span><span className={styles['profile-date']}>{this.itemService.formatDateOnly(card.EventDate)}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            :
                                            <></>
                                        }
                                    </>
                                )
                                )}
                                <div className={`${styles['news-col-right']} ${'ms-Grid'} `} >
                                    {
                                        this.state.items && this.state.items.length > 0 && this.state.items.map((card, index) => (
                                            <>
                                                {(index !== 0)
                                                    ?
                                                    <>
                                                        <div className="ms-Grid-row"  >
                                                            <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg6" onClick={() => this.handleCardClick(card)}>
                                                                <div className={styles['card-image']}>
                                                                    {/* Your background image */}
                                                                    {card.ImageUrl && (
                                                                        <img src={card.ImageUrl}
                                                                            onError={() => this.itemService.handleImageError(event)}
                                                                            alt="Event Image" />
                                                                    )
                                                                    }
                                                                </div>
                                                                {/* <div className={styles['card-gradient']}></div> */}
                                                            </div>
                                                            <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg6" onClick={() => this.handleCardClick(card)}>
                                                                <div className={styles['card-header']}>
                                                                    <p style={{ margin: "0px", padding: "5px 0px", fontSize: "12px", display:"none" }}>
                                                                        <a href={card.SiteUrl} className={styles['card-site-name']}>{card.SiteName}</a></p>
                                                                    <span className={styles['card-title']}>{card.Title}</span>
                                                                </div>
                                                                <p className={styles['card-description']}>{card.Description}</p>

                                                                <p className={styles['profile-container']}>
                                                                    <span className={styles['profile-name']} >{card.Author} </span><span className={styles['profile-date']}> {this.itemService.formatDateOnly(card.EventDate)}</span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {(index !== 3) ?
                                                            <hr style={{ marginBottom: '20px', color: 'gainsboro', width: '100%' }} />
                                                            :
                                                            <></>
                                                        }

                                                    </>

                                                    : <>
                                                    </>
                                                }
                                            </>

                                        ))}
                                </div>
                            </div>
                            :
                            <></>

                    }

                    {
                        this.state.newsCarouselActive ?
                            <div className="ms-Grid" onMouseEnter={() => this.onMouseEnter()} onMouseLeave={() => this.onMouseLeave()}>
                                <Slider  {...settings}>
                                    {this.state.items && this.state.items.length > 0 && this.state.items.map((card, index) => (
                                        <div key={index} className={styles['card1']}>
                                            <div style={{ padding: '5px', margin: '5px' }}>
                                                <div key={index} className={styles['card-container']}>
                                                    <div className={styles['card-background']} onClick={() => this.handleCardClick(card)}>
                                                        <div className={styles['card-image']}>
                                                            {card.ImageUrl && (
                                                                <img src={card.ImageUrl}
                                                                    onError={() => this.itemService.handleImageError(event)}
                                                                    alt="Event Image" />
                                                            )
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className={styles['card-content']} onClick={() => this.handleCardClick(card)}>
                                                        <div className={styles['card-header']}>
                                                            <a href={card.SiteUrl} className={styles['card-site-name']}>{card.SiteName}</a>
                                                        </div>
                                                        <p style={{ height: "60px" }} className={styles['card-title']}>{card.Title}</p>
                                                        <p className={styles['card-description']}>{card.Description}</p>
                                                        <p className={styles['profile-container']}>
                                                            <img className={styles['profile-img']} src={`${this.props.context.pageContext.web.absoluteUrl}/_layouts/15/userphoto.aspx?UserName=${card.Author}&size=s`} draggable="false" /> <span className={styles['profile-name']} >{card.Author} </span><span className={styles['profile-date']}>{this.itemService.formatDateOnly(card.EventDate)}</span>
                                                        </p>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </Slider>
                            </div>
                            :
                            <></>
                    }
                </div>
            </div>

        );
    }
}
