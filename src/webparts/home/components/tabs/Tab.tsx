import * as React from 'react';
import styles from './Tab.module.scss';
import { ITabProps } from './ITabProps';
import { IItemObj, ITabState } from './ITabStates';
import { escape } from '@microsoft/sp-lodash-subset';
import Slider from "react-slick";
import Modal from 'react-modal';
import { SPComponentLoader } from '@microsoft/sp-loader';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ItemsService } from "../../../../services/spservices"
import { Icon } from 'office-ui-fabric-react/lib/Icon';

export default class Home extends React.Component<ITabProps, ITabState> {
    private itemService: ItemsService = null;
    public constructor(props: ITabProps, state: ITabState) {
        super(props);
        this.state = {
            Title: "",
            ID: 0,
            items: [],
            carouselRef: null,
            isLoading: false,
            isHovered: true
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
    public componentDidMount(): void {
        this.itemService._getTab().then((data) => {
            this.setState({ items: data })
        });

    }

    public render(): React.ReactElement<ITabProps> {
        const {
            title,
            slidesCount
        } = this.props;
        let settings: any = this.itemService.slickTabCarouselSettings();

        settings.slidesToShow = this.props.slidesCount ? Number(this.props.slidesCount) : settings.slidesToShow;
        settings.nextArrow = <this.CustomNextArrow />;
        settings.prevArrow = <this.CustomPrevArrow />;
        //settings.slidesToShow = 5;
        settings.autoplay = false;
        settings.infinite = true;
        settings.slidesToScroll = 1;
        return (
            <div className={styles['tab-wrapper']}>

                <div className={styles['tab-wrapper-slider']} >
                    <div className={styles['tab-wrapper-slider-content']}>
                        <div className="item-placeholder" style={{  overflow: "hidden" }} onMouseEnter={() => this.onMouseEnter()} onMouseLeave={() => this.onMouseLeave()}>

                            <Slider  {...settings}>
                                {this.state.items && this.state.items.length > 0 && this.state.items.map((card, index) => (

                                    <div key={index} className={styles['card1']}>
                                        <div style={{ padding: '10px 0px', margin: '0px -14px' }}>
                                            <div className={styles['container']}>
                                                <div className={styles['content']}>
                                                    <a href={card.link} target="_blank">                                                       
                                                        <div className={styles['content-overlay']}></div>
                                                        <img style={{width:'101px', height:'80px'}}  src={`${this.props.context.pageContext.site.absoluteUrl}${'/Lists/Tabs/Attachments/'}${card.id}/${JSON.parse(card.banner).fileName}`} className={styles['content-card']} alt="" />
                                                        <div className={styles['content-details']}>
                                                            <h3>{card.title}</h3>

                                                        </div>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                ))}
                            </Slider>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
