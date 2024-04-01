import * as React from 'react';
import styles from './HeroBanner.module.scss';
import { IHeroBannerProps } from './IHeroBannerProps';
import { IItemObj, IHeroBannerState } from './IHeroBannerState';
import { escape } from '@microsoft/sp-lodash-subset';
import Slider from "react-slick";
import Modal from 'react-modal';
import { SPComponentLoader } from '@microsoft/sp-loader';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ItemsService } from "../../../../services/spservices"
import { Icon } from 'office-ui-fabric-react/lib/Icon';

export default class Home extends React.Component<IHeroBannerProps, IHeroBannerState> {
    private itemService: ItemsService = null;
    public constructor(props: IHeroBannerProps, state: IHeroBannerState) {
        super(props);
        this.state = {
            Title: "",
            ID: 0,
            items: [],
            carouselRef: null,
            isLoading: false,
            isHovered: false
        };

        this.itemService = new ItemsService(this.props.context)

    }

    private CustomNextArrow = (props) => {
        const { onClick } = props;
        return <div style={{ display: this.state.isHovered ? "block" : "none" }} className={`${styles['custom-arrow']} ${styles['custom-next-arrow']}`} onClick={onClick}><Icon iconName='ChevronRight' /></div>;
    };

    private CustomPrevArrow = (props) => {
        const { onClick } = props;
        return <div style={{ display: this.state.isHovered ? "block" : "none" }} className={`${styles['custom-arrow']} ${styles['custom-prev-arrow']}`} onClick={onClick}> <Icon iconName='ChevronLeft' /></div>;
    };

    public componentDidMount(): void {
        this.itemService._HeroBanner().then((data) => {

            this.setState({ items: data });
        });

    }    

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
    public render(): React.ReactElement<IHeroBannerProps> {
        const {
            title,
        } = this.props;
        let settings: any = this.itemService.slickCarouselSettings();
        settings.nextArrow = <this.CustomNextArrow />;
        settings.prevArrow = <this.CustomPrevArrow />;
        settings.slidesToShow = 1;
        settings.autoplay = false;
        settings.infinite = true;
        settings.slidesToScroll = 1;
        
        return (
            <div className={styles['HeroBanner-wrapper']}>
                <div className={styles['HeroBanner-wrapper-label']} >

                </div>
                <div className={styles['HeroBanner-wrapper-slider']} >
                    
                <div className={styles['HeroBanner-wrapper-slider-content']} style={{ minHeight: "380px" }} onMouseEnter={() => this.onMouseEnter()} onMouseLeave={() => this.onMouseLeave()}>

                        <Slider  {...settings}>
                            {this.state.items && this.state.items.length > 0 && this.state.items.map((card, index) => (
                                <>
                                    {
                                        (card.banner && card.banner !== "") ?
                                         
                                            (index == 0) ?
                                            (<div style={{ padding: '10px 0px', margin: '0px -14px' }}>
                                                <div className={styles['container']}>

                                                    <div className={styles['content']}>
                                                        <a target="_blank">
                                                            <img style={{width:'1180px',height:'380px'}}  src={`${window.location.origin}/${card.banner}`}></img>

                                                            <div className={styles['content-overlay']}></div>
                                                             
                                                            <div className={styles['content-details']}>
                                                            <h3>{this.props.context.pageContext.user.displayName}, stay connected through The Intranet </h3>

                                                            </div>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>

                                            )
                                            :
                                            (<div style={{ padding: '10px 0px', margin: '0px -14px' }}>
                                                <div className={styles['container']}>

                                                    <div className={styles['content']}>
                                                        <a target="_blank">
                                                            <img style={{width:'1180px',height:'380px'}} src={`${window.location.origin}/${card.banner}`}></img>

                                                            <div className={styles['content-overlay']}></div>
                                                            <img className={styles['content-card']} alt="" />
                                                            <div className={styles['content-details']}>
                                                            <h3>{card.title}</h3>

                                                            </div>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>

                                            )
                                            :
                                            (null)


                                    }
                                </>

                            ))}
                        </Slider>
                    </div>
                </div>
            </div>
        );
    }
}
